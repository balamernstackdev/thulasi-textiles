
'use server';

import prismadb from '@/lib/prisma';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;

    const imagesStr = formData.get('images') as string;
    const variantsStr = formData.get('variants') as string;
    const artisanId = formData.get('artisanId') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isOffer = formData.get('isOffer') === 'true';
    const isNew = formData.get('isNew') === 'true';
    const isActive = formData.get('isActive') === 'true';

    const artisanStory = formData.get('artisanStory') as string;
    const artisanImage = formData.get('artisanImage') as string;
    const careInstructions = formData.get('careInstructions') as string;
    const fabric = formData.get('fabric') as string;
    const weave = formData.get('weave') as string;
    const origin = formData.get('origin') as string;
    const occasion = formData.get('occasion') as string;

    const metaTitle = formData.get('metaTitle') as string;
    const metaDescription = formData.get('metaDescription') as string;
    const heritageTitle = formData.get('heritageTitle') as string;
    const qualityAuditStr = formData.get('qualityAudit') as string;
    const videoUrl = formData.get('videoUrl') as string;
    const complementaryProductIdsStr = formData.get('complementaryProducts') as string;

    const images = imagesStr ? JSON.parse(imagesStr) : [];
    const variants = variantsStr ? JSON.parse(variantsStr) : [];
    const qualityAudit = qualityAuditStr ? JSON.parse(qualityAuditStr) : null;
    const complementaryProductIds = complementaryProductIdsStr ? JSON.parse(complementaryProductIdsStr) : [];

    if (!name || isNaN(price) || !categoryId) {
        throw new Error('Missing required fields');
    }

    try {
        const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();

        await prismadb.product.create({
            data: {
                name,
                slug,
                description: description || '',
                basePrice: price || 0,
                categoryId,
                isFeatured,
                isBestSeller,
                isOffer,
                isNew,
                isActive,
                artisanStory,
                artisanImage,
                careInstructions,
                fabric,
                weave,
                origin,
                occasion,
                heritageTitle,
                qualityAudit,
                metaTitle,
                metaDescription,
                videoUrl,
                artisanId: artisanId || null,
                complementaryProducts: {
                    create: complementaryProductIds.map((id: string) => ({
                        complementary: { connect: { id } }
                    }))
                },
                images: {
                    create: images.map((url: string, index: number) => ({
                        url,
                        isPrimary: index === 0,
                        altText: name
                    }))
                },
                variants: {
                    create: variants.map((v: any) => ({
                        sku: v.sku,
                        size: v.size,
                        color: v.color,
                        price: v.price || price,
                        stock: v.stock || 0
                    }))
                }
            } as any
        });
        revalidatePath('/admin/products', 'page');
        revalidatePath('/', 'layout');
        revalidateTag('products', 'default');
    } catch (error) {
        console.error('Failed to create product:', error);
        throw new Error('Failed to create product');
    }

    redirect('/admin/products');
}

export const getProducts = cache(async (options: {
    categorySlug?: string,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isOffer?: boolean,
    isNew?: boolean,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    sizes?: string[],
    colors?: string[],
    materials?: string[],
    fabrics?: string[],
    occasions?: string[],
    sort?: string,
    page?: number,
    pageSize?: number,
    limit?: number
} = {}) => {
    const key = JSON.stringify(options);
    return unstable_cache(
        async () => {
            try {
                let where: any = {};
                if (options.isFeatured) where.isFeatured = true;
                if (options.isBestSeller) where.isBestSeller = true;
                if (options.isOffer) where.isOffer = true;
                if (options.isNew) where.isNew = true;

                if (options.categorySlug && options.categorySlug !== 'all') {
                    where.category = {
                        OR: [
                            { slug: options.categorySlug },
                            { parent: { slug: options.categorySlug } }
                        ]
                    };
                }

                if (options.search) {
                    where.OR = [
                        { name: { contains: options.search } },
                        { description: { contains: options.search } },
                        { fabric: { contains: options.search } },
                        { occasion: { contains: options.search } }
                    ];
                }

                if (options.minPrice || options.maxPrice) {
                    where.basePrice = {};
                    if (options.minPrice) where.basePrice.gte = options.minPrice;
                    if (options.maxPrice) where.basePrice.lte = options.maxPrice;
                }

                // Attribute Filters
                if (options.fabrics && options.fabrics.length > 0) {
                    where.fabric = { in: options.fabrics };
                }
                if (options.occasions && options.occasions.length > 0) {
                    where.occasion = { in: options.occasions };
                }

                // Variant Filters (Size, Color, Material)
                if ((options.sizes && options.sizes.length > 0) ||
                    (options.colors && options.colors.length > 0) ||
                    (options.materials && options.materials.length > 0)) {
                    where.variants = {
                        some: {
                            ...(options.sizes && options.sizes.length > 0 && { size: { in: options.sizes } }),
                            ...(options.colors && options.colors.length > 0 && { color: { in: options.colors } }),
                            ...(options.materials && options.materials.length > 0 && { material: { in: options.materials } }),
                        }
                    };
                }

                where.isActive = true;

                const page = options.page || 1;
                const pageSize = options.pageSize || 10;
                const skip = (page - 1) * pageSize;

                let orderBy: any = { createdAt: 'desc' };
                if (options.sort === 'price_asc') orderBy = { basePrice: 'asc' };
                else if (options.sort === 'price_desc') orderBy = { basePrice: 'desc' };
                else if (options.sort === 'newest') orderBy = { createdAt: 'desc' };

                const [products, total] = await Promise.all([
                    prismadb.product.findMany({
                        where,
                        include: {
                            images: {
                                take: 2,
                                select: {
                                    url: true,
                                    isPrimary: true,
                                }
                            },
                            category: true,
                            variants: {
                                select: {
                                    id: true,
                                    size: true,
                                    color: true,
                                    material: true,
                                    stock: true,
                                    price: true
                                }
                            },
                            reviews: {
                                where: { isPublic: true },
                                select: { rating: true }
                            }
                        } as any,
                        take: options.limit || options.pageSize || 10,
                        skip: options.limit ? 0 : skip,
                        orderBy
                    }),
                    prismadb.product.count({ where })
                ]);

                const processedProducts = (products as any[]).map(product => {
                    const reviewCount = product.reviews?.length || 0;
                    const averageRating = reviewCount > 0
                        ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
                        : 0;

                    return {
                        ...product,
                        basePrice: Number(product.basePrice),
                        reviewCount,
                        averageRating,
                        variants: product.variants?.map((v: any) => ({
                            ...v,
                            price: Number(v.price)
                        })) || []
                    };
                });

                return {
                    success: true,
                    data: processedProducts,
                    pagination: {
                        total,
                        page: options.page || 1,
                        pageSize: options.pageSize || 10,
                        totalPages: Math.ceil(total / (options.pageSize || 10))
                    }
                };
            } catch (error) {
                console.error('[DATABASE_ERROR] Failed to get products:', error);
                return {
                    success: false,
                    data: [],
                    pagination: {
                        total: 0,
                        page: options.page || 1,
                        pageSize: options.pageSize || 10,
                        totalPages: 0
                    },
                    error: 'Failed to fetch products'
                };
            }
        },
        ['products-list', key],
        { tags: ['products'], revalidate: 3600 }
    )();
});

export const getFilterValues = cache(async (categorySlug?: string) => {
    const key = `filter-values-${categorySlug || 'all'}`;
    return unstable_cache(
        async () => {
            try {
                const categoryFilter = categorySlug ? {
                    category: {
                        OR: [
                            { slug: categorySlug },
                            { parent: { slug: categorySlug } }
                        ]
                    }
                } : {};

                const variantWhere = {
                    product: {
                        ...categoryFilter,
                        isActive: true
                    }
                };

                const productWhere = {
                    ...categoryFilter,
                    isActive: true
                };

                const [sizes, colors, materials, fabrics, occasions] = await Promise.all([
                    prismadb.productVariant.findMany({
                        where: variantWhere,
                        select: { size: true },
                        distinct: ['size']
                    }),
                    prismadb.productVariant.findMany({
                        where: variantWhere,
                        select: { color: true },
                        distinct: ['color']
                    }),
                    prismadb.productVariant.findMany({
                        where: variantWhere,
                        select: { material: true },
                        distinct: ['material']
                    }),
                    prismadb.product.findMany({
                        where: productWhere,
                        select: { fabric: true },
                        distinct: ['fabric']
                    }),
                    prismadb.product.findMany({
                        where: productWhere,
                        select: { occasion: true },
                        distinct: ['occasion']
                    }),
                ]);

                return {
                    success: true,
                    data: {
                        sizes: sizes.map(s => s.size).filter(Boolean) as string[],
                        colors: colors.map(c => c.color).filter(Boolean) as string[],
                        materials: materials.map(m => m.material).filter(Boolean) as string[],
                        fabrics: fabrics.map(f => f.fabric).filter(Boolean) as string[],
                        occasions: occasions.map(o => o.occasion).filter(Boolean) as string[],
                    }
                };
            } catch (error) {
                console.error('Error fetching filter values:', error);
                return { success: false, data: { sizes: [], colors: [], materials: [], fabrics: [], occasions: [] } };
            }
        },
        [key],
        { tags: ['products'], revalidate: 3600 }
    )();
});

export const getRelatedProducts = cache(async (productId: string, categoryId: string, fabric?: string) => {
    return unstable_cache(
        async () => {
            try {
                const products = await prismadb.product.findMany({
                    where: {
                        isActive: true,
                        id: { not: productId },
                        OR: [
                            { categoryId: categoryId },
                            { fabric: fabric || undefined }
                        ]
                    },
                    take: 4,
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        basePrice: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1
                        },
                        variants: {
                            select: {
                                id: true,
                                sku: true,
                                price: true,
                                stock: true,
                                size: true,
                                color: true
                            }
                        }
                    },
                    orderBy: {
                        isBestSeller: 'desc'
                    }
                });

                return {
                    success: true,
                    data: products.map(p => ({
                        ...p,
                        basePrice: Number(p.basePrice),
                        variants: p.variants.map(v => ({
                            ...v,
                            price: Number(v.price)
                        }))
                    }))
                };
            } catch (error) {
                console.error('Related products fetch error:', error);
                return { success: false, data: [] };
            }
        },
        ['related-products', productId],
        { tags: ['products'], revalidate: 3600 }
    )();
});

export const getProductBySlug = cache(async (slug: string) => {
    return unstable_cache(
        async () => {
            try {
                const product = await prismadb.product.findUnique({
                    where: { slug, isActive: true },
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        description: true,
                        basePrice: true,
                        fabric: true,
                        weave: true,
                        origin: true,
                        occasion: true,
                        artisanId: true,
                        artisan: true,
                        loomType: true,
                        weavingHours: true,
                        careInstructions: true,
                        heritageTitle: true,
                        metaTitle: true,
                        metaDescription: true,
                        videoUrl: true,
                        images: true,
                        category: {
                            include: {
                                parent: true
                            }
                        },
                        variants: true,
                        reviews: {
                            where: { isPublic: true },
                            select: { rating: true }
                        },
                        complementaryProducts: {
                            include: {
                                complementary: {
                                    include: {
                                        images: { take: 1 },
                                        variants: { take: 1 }
                                    }
                                }
                            }
                        }
                    }
                });
                if (!product) return { success: true, data: null };

                const reviewCount = product.reviews.length;
                const averageRating = reviewCount > 0
                    ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
                    : 0;

                const serializedProduct = {
                    ...product,
                    basePrice: Number(product.basePrice),
                    reviewCount,
                    averageRating,
                    variants: product.variants.map((v: any) => ({
                        ...v,
                        price: Number(v.price),
                        discount: v.discount ? Number(v.discount) : 0
                    })),
                    complementaryProducts: product.complementaryProducts.map((cp: any) => {
                        const p = cp.complementary;
                        return {
                            ...p,
                            basePrice: Number(p.basePrice),
                            variants: p.variants?.map((v: any) => ({
                                ...v,
                                price: Number(v.price)
                            })) || []
                        };
                    })
                };

                return { success: true, data: serializedProduct as any };
            } catch (error) {
                console.error('Error fetching product:', error);
                return { success: false, error: 'Failed to load product' };
            }
        },
        ['product-detail', slug],
        { tags: ['products'], revalidate: 3600 }
    )();
});

export const getProductById = cache(async (id: string) => {
    return unstable_cache(
        async () => {
            try {
                const product = await prismadb.product.findUnique({
                    where: { id },
                    include: {
                        images: true,
                        category: true,
                        variants: true,
                        reviews: {
                            where: { isPublic: true },
                            select: { rating: true }
                        },
                        complementaryProducts: {
                            include: {
                                complementary: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                });
                if (!product) return { success: true, data: null };

                const reviewCount = product.reviews.length;
                const averageRating = reviewCount > 0
                    ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
                    : 0;

                const serializedProduct = {
                    ...product,
                    basePrice: Number(product.basePrice),
                    reviewCount,
                    averageRating,
                    variants: product.variants.map((v: any) => ({
                        ...v,
                        price: Number(v.price),
                        discount: v.discount ? Number(v.discount) : 0
                    })),
                    complementaryProducts: product.complementaryProducts.map((cp: any) => cp.complementary)
                };

                return { success: true, data: serializedProduct as any };
            } catch (error) {
                console.error('Error fetching product:', error);
                return { success: false, error: 'Failed to load product' };
            }
        },
        ['product-by-id', id],
        { tags: ['products'], revalidate: 3600 }
    )();
});

export async function updateProduct(id: string, formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;

    const imagesStr = formData.get('images') as string;
    const variantsStr = formData.get('variants') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isOffer = formData.get('isOffer') === 'true';
    const isNew = formData.get('isNew') === 'true';
    const isActive = formData.get('isActive') === 'true';
    const artisanStory = formData.get('artisanStory') as string | null;
    const artisanImage = formData.get('artisanImage') as string | null;
    const careInstructions = formData.get('careInstructions') as string | null;
    const fabric = formData.get('fabric') as string | null;
    const weave = formData.get('weave') as string | null;
    const origin = formData.get('origin') as string | null;
    const occasion = formData.get('occasion') as string | null;
    const metaTitle = formData.get('metaTitle') as string | null;
    const metaDescription = formData.get('metaDescription') as string | null;
    const heritageTitle = formData.get('heritageTitle') as string | null;
    const qualityAuditStr = formData.get('qualityAudit') as string | null;
    const videoUrl = formData.get('videoUrl') as string | null;
    const artisanId = formData.get('artisanId') as string | null;
    const complementaryProductIdsStr = formData.get('complementaryProducts') as string | null;

    const images = imagesStr ? JSON.parse(imagesStr) : [];
    const variants = variantsStr ? JSON.parse(variantsStr) : [];
    const qualityAudit = qualityAuditStr ? JSON.parse(qualityAuditStr) : null;
    const complementaryProductIds = complementaryProductIdsStr ? JSON.parse(complementaryProductIdsStr) : [];

    if (!name || isNaN(price) || !categoryId) {
        throw new Error('Missing required fields');
    }

    try {
        await prismadb.product.update({
            where: { id },
            data: {
                name,
                description: description || '',
                basePrice: price || 0,
                category: {
                    connect: { id: categoryId }
                },
                isFeatured,
                isBestSeller,
                isOffer,
                isNew,
                isActive,
                artisanStory,
                artisanImage,
                careInstructions,
                fabric,
                weave,
                origin,
                occasion,
                heritageTitle,
                qualityAudit,
                metaTitle,
                metaDescription,
                videoUrl,
                artisanId: artisanId || null,
                complementaryProducts: {
                    deleteMany: {},
                    create: complementaryProductIds.map((id: string) => ({
                        complementary: { connect: { id } }
                    }))
                },
                images: {
                    deleteMany: {},
                    create: images.map((url: string, index: number) => ({
                        url,
                        isPrimary: index === 0,
                        altText: name
                    }))
                },
                variants: {
                    deleteMany: {},
                    create: variants.map((v: any) => ({
                        sku: v.sku,
                        size: v.size,
                        color: v.color,
                        price: v.price || price,
                        stock: v.stock || 0
                    }))
                }
            } as any
        });

        revalidateTag('products', 'default');
        revalidatePath('/admin/products');
        revalidatePath(`/product/${id}`, 'page');
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Failed to update product' };
    }
}

export async function deleteProduct(id: string) {
    try {
        await prismadb.product.delete({
            where: { id }
        });
        revalidatePath('/admin/products');
        revalidateTag('products', 'default');
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product' };
    }
}

export async function deleteProducts(ids: string[]) {
    try {
        await prismadb.product.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        revalidatePath('/admin/products');
        revalidateTag('products', 'default');
        return { success: true };
    } catch (error) {
        console.error('Error deleting products:', error);
        return { success: false, error: 'Failed to delete products' };
    }
}

// ============================================
// RELATED PRODUCTS ACTIONS
// ============================================

/**
 * Get product with its related products included
 */
export async function getProductWithRelated(slug: string) {
    try {
        const product = await prismadb.product.findUnique({
            where: { slug },
            include: {
                images: true,
                variants: true,
                category: true,
                complementaryProducts: {
                    where: { complementary: { isActive: true } },
                    include: {
                        complementary: {
                            include: {
                                images: {
                                    where: { isPrimary: true }
                                },
                                variants: {
                                    take: 1
                                }
                            }
                        }
                    },
                    take: 6
                }
            }
        });

        if (!product) {
            return { success: false, error: 'Product not found' };
        }

        return {
            success: true,
            data: {
                ...product,
                complementaryProducts: product.complementaryProducts.map(cp => cp.complementary)
            }
        };
    } catch (error) {
        console.error('Failed to fetch product with related:', error);
        return { success: false, error: 'Failed to fetch product' };
    }
}

/**
 * Update related products for a given product
 */
export async function updateRelatedProducts(productId: string, relatedProductIds: string[]) {
    try {
        // Create new relationships
        await prismadb.product.update({
            where: { id: productId },
            data: {
                complementaryProducts: {
                    deleteMany: {}, // Clear existing
                    create: relatedProductIds.map(id => ({
                        complementary: { connect: { id } }
                    }))
                }
            }
        });

        revalidatePath('/admin/products', 'page');
        revalidatePath('/', 'layout');
        revalidateTag('products', 'default');
        // revalidateTag('products', 'layout');

        return { success: true, message: 'Related products updated successfully' };
    } catch (error) {
        console.error('Failed to update related products:', error);
        return { success: false, error: 'Failed to update related products' };
    }
}

/**
 * Get available products that can be linked as related products
 * Excludes the current product and already linked products
 */
export async function getAvailableRelatedProducts(productId: string, searchQuery?: string) {
    try {
        // First get the current product with its existing relationships
        const currentProduct = await prismadb.product.findUnique({
            where: { id: productId },
            include: {
                complementaryProducts: {
                    select: { complementaryId: true }
                }
            }
        });

        if (!currentProduct) {
            return { success: false, error: 'Product not found' };
        }

        // Get IDs of already linked products
        const excludedIds = [
            productId, // Exclude self
            ...currentProduct.complementaryProducts.map(p => p.complementaryId)
        ];

        // Build search filter
        const where: any = {
            id: { notIn: excludedIds },
            isActive: true
        };

        if (searchQuery) {
            where.OR = [
                { name: { contains: searchQuery, mode: 'insensitive' } },
                { description: { contains: searchQuery, mode: 'insensitive' } }
            ];
        }

        // Fetch available products
        const availableProducts = await prismadb.product.findMany({
            where,
            include: {
                images: {
                    where: { isPrimary: true },
                    take: 1
                },
                category: {
                    select: { name: true }
                }
            },
            take: 20, // Limit results for performance
            orderBy: { name: 'asc' }
        });

        return { success: true, data: availableProducts };
    } catch (error) {
        console.error('Failed to fetch available related products:', error);
        return { success: false, error: 'Failed to fetch available products' };
    }
}


export const getQuickSearch = cache(async (query: string) => {
    if (!query || query.length < 2) return { success: true, data: [] };

    try {
        const products = await prismadb.product.findMany({
            where: {
                isActive: true,
                OR: [
                    { name: { contains: query } },
                    { category: { name: { contains: query } } }
                ]
            },
            take: 6,
            select: {
                id: true,
                name: true,
                slug: true,
                basePrice: true,
                images: {
                    where: { isPrimary: true },
                    take: 1,
                    select: { url: true }
                }
            }
        });

        return {
            success: true,
            data: products.map(p => ({
                ...p,
                basePrice: Number(p.basePrice)
            }))
        };
    } catch (error) {
        console.error('Quick search error:', error);
        return { success: false, data: [] };
    }
});

export async function bulkUpdateProductPrice(productIds: string[], percentage: number, type: 'increase' | 'decrease') {
    try {
        const products = await prismadb.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, basePrice: true }
        });

        await prismadb.$transaction(
            products.map(p => {
                const currentPrice = Number(p.basePrice);
                const adjustment = (currentPrice * percentage) / 100;
                const newPrice = type === 'increase' ? currentPrice + adjustment : currentPrice - adjustment;

                return prismadb.product.update({
                    where: { id: p.id },
                    data: { basePrice: newPrice }
                });
            })
        );

        revalidatePath('/admin/products');
        revalidateTag('products', 'default');
        return { success: true };
    } catch (error) {
        console.error('Bulk price update error:', error);
        return { success: false, error: 'Failed to update prices' };
    }
}

export async function bulkToggleProductVisibility(productIds: string[], isActive: boolean) {
    try {
        await prismadb.product.updateMany({
            where: {
                id: { in: productIds }
            },
            data: {
                isActive
            }
        });
        revalidatePath('/admin/products');
        revalidateTag('products', 'default');
        return { success: true };
    } catch (error) {
        console.error('Bulk visibility update error:', error);
        return { success: false, error: 'Failed to update visibility' };
    }
}

export const getTrendingProducts = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                // Fetch best sellers or just recent products if no best sellers
                const products = await prismadb.product.findMany({
                    where: {
                        isActive: true,
                        isBestSeller: true
                    },
                    take: 4,
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        basePrice: true,
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                            select: { url: true }
                        },
                        category: { select: { name: true } }
                    },
                    orderBy: {
                        updatedAt: 'desc'
                    }
                });

                // Fallback if no best sellers
                if (products.length === 0) {
                    const recent = await prismadb.product.findMany({
                        where: { isActive: true },
                        take: 4,
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                            basePrice: true,
                            images: { where: { isPrimary: true }, take: 1, select: { url: true } },
                            category: { select: { name: true } }
                        },
                        orderBy: { createdAt: 'desc' }
                    });
                    return { success: true, data: recent.map(p => ({ ...p, basePrice: Number(p.basePrice) })) };
                }

                return {
                    success: true,
                    data: products.map(p => ({ ...p, basePrice: Number(p.basePrice) }))
                };
            } catch (error) {
                console.error('Trend fetch error:', error);
                return { success: false, data: [] };
            }
        },
        ['trending-search'],
        { tags: ['products'], revalidate: 3600 }
    )();
});
