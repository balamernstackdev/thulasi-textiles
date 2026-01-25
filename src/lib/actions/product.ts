
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

export async function getProducts(options: {
    categorySlug?: string,
    isFeatured?: boolean,
    isBestSeller?: boolean,
    isOffer?: boolean,
    page?: number,
    pageSize?: number,
    limit?: number
} = {}) {
    const key = JSON.stringify(options);
    return unstable_cache(
        async () => {
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

            where.isActive = true;
            const skip = ((options.page || 1) - 1) * (options.pageSize || 10);

            const [products, total] = await Promise.all([
                prismadb.product.findMany({
                    where,
                    include: {
                        images: { take: 1 },
                        category: true,
                    },
                    take: options.limit || options.pageSize || 10,
                    skip: options.limit ? 0 : skip,
                    orderBy: { createdAt: 'desc' }
                }),
                prismadb.product.count({ where })
            ]);

            const serializedProducts = products.map(p => ({
                ...p,
                basePrice: Number(p.basePrice),
            }));

            return {
                success: true,
                data: serializedProducts,
                pagination: {
                    total,
                    page: options.page || 1,
                    pageSize: options.pageSize || 10,
                    totalPages: Math.ceil(total / (options.pageSize || 10))
                }
            };
        },
        ['products-list', key],
        { tags: ['products'], revalidate: 3600 }
    )();
}

export async function getProductBySlug(slug: string) {
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
                        variants: true
                    }
                });
                if (!product) return { success: true, data: null };

                const serializedProduct = {
                    ...product,
                    basePrice: Number(product.basePrice),
                    variants: product.variants.map(v => ({
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
}

export async function getProductById(id: string) {
    return unstable_cache(
        async () => {
            try {
                const product = await prismadb.product.findUnique({
                    where: { id },
                    include: {
                        images: true,
                        category: true,
                        variants: true
                    }
                });
                if (!product) return { success: true, data: null };

                const serializedProduct = {
                    ...product,
                    basePrice: Number(product.basePrice),
                    variants: product.variants.map(v => ({
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
}

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
