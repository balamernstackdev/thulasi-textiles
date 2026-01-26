
'use server';

import prismadb from '@/lib/prisma';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const categoryId = formData.get('categoryId') as string;

    const imagesStr = formData.get('images') as string;
    const variantsStr = formData.get('variants') as string;
    const isFeatured = formData.get('isFeatured') === 'true';
    const isBestSeller = formData.get('isBestSeller') === 'true';
    const isOffer = formData.get('isOffer') === 'true';
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

    const images = imagesStr ? JSON.parse(imagesStr) : [];
    const variants = variantsStr ? JSON.parse(variantsStr) : [];

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
                isActive,
                artisanStory,
                artisanImage,
                careInstructions,
                fabric,
                weave,
                origin,
                occasion,
                // metaTitle, // Uncomment after running: npx prisma db push
                // metaDescription,
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

import { cache } from 'react';

export const getProducts = cache(async (options: {
    categorySlug?: string,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isOffer?: boolean,
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

                if (options.categorySlug) {
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
                        },
                        take: options.limit || options.pageSize || 10,
                        skip: options.limit ? 0 : skip,
                        orderBy
                    }),
                    prismadb.product.count({ where })
                ]);

                const processedProducts = products.map(product => {
                    const reviewCount = product.reviews.length;
                    const averageRating = reviewCount > 0
                        ? product.reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount
                        : 0;

                    return {
                        ...product,
                        basePrice: Number(product.basePrice),
                        reviewCount,
                        averageRating,
                        variants: product.variants.map((v: any) => ({
                            ...v,
                            price: Number(v.price)
                        }))
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

export const getFilterValues = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const [sizes, colors, materials, fabrics, occasions] = await Promise.all([
                    prismadb.productVariant.findMany({ select: { size: true }, distinct: ['size'] }),
                    prismadb.productVariant.findMany({ select: { color: true }, distinct: ['color'] }),
                    prismadb.productVariant.findMany({ select: { material: true }, distinct: ['material'] }),
                    prismadb.product.findMany({ select: { fabric: true }, distinct: ['fabric'] }),
                    prismadb.product.findMany({ select: { occasion: true }, distinct: ['occasion'] }),
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
        ['filter-values'],
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
                        basePrice: Number(p.basePrice)
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
                    include: {
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
                    }))
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
                    }))
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
    const isActive = formData.get('isActive') === 'true';
    const artisanStory = formData.get('artisanStory') as string | null;
    const artisanImage = formData.get('artisanImage') as string | null;
    const careInstructions = formData.get('careInstructions') as string | null;
    const fabric = formData.get('fabric') as string | null;
    const weave = formData.get('weave') as string | null;
    const origin = formData.get('origin') as string | null;
    const occasion = formData.get('occasion') as string | null;
    const metaTitle = formData.get('metaTitle') as string | null;

    const images = imagesStr ? JSON.parse(imagesStr) : [];
    const variants = variantsStr ? JSON.parse(variantsStr) : [];

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
                isActive,
                artisanStory,
                artisanImage,
                careInstructions,
                fabric,
                weave,
                origin,
                occasion,
                // metaTitle, // Uncomment after running: npx prisma db push
                // metaDescription,
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
