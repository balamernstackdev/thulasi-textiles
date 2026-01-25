'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function toggleWishlist(productId: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const existing = await prismadb.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        });

        if (existing) {
            await prismadb.wishlist.delete({
                where: {
                    userId_productId: {
                        userId: session.user.id,
                        productId,
                    },
                },
            });
            revalidatePath('/wishlist');
            revalidatePath(`/product/${productId}`);
            return { success: true, action: 'removed' };
        } else {
            await prismadb.wishlist.create({
                data: {
                    userId: session.user.id,
                    productId,
                },
            });
            revalidatePath('/wishlist');
            revalidatePath(`/product/${productId}`);
            return { success: true, action: 'added' };
        }
    } catch (error) {
        console.error('Toggle wishlist error:', error);
        return { success: false, error: 'Failed to update wishlist' };
    }
}

export async function getWishlist() {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const wishlist = await prismadb.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: {
                        images: { take: 1 },
                        variants: {
                            take: 1,
                            orderBy: { price: 'asc' },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Serialize decimals
        const serializedWishlist = wishlist.map((item) => ({
            ...item,
            product: {
                ...item.product,
                basePrice: Number(item.product.basePrice),
                variants: item.product.variants.map(v => ({
                    ...v,
                    price: Number(v.price),
                })),
            },
        }));

        return { success: true, data: serializedWishlist };
    } catch (error) {
        console.error('Get wishlist error:', error);
        return { success: false, error: 'Failed to fetch wishlist' };
    }
}

import { unstable_cache } from 'next/cache';

export async function checkWishstatus(productId: string) {
    const session = await getSession();
    if (!session) {
        return { isWishlisted: false };
    }

    return unstable_cache(
        async () => {
            try {
                const count = await prismadb.wishlist.count({
                    where: {
                        userId: session.user.id,
                        productId,
                    },
                });
                return { isWishlisted: count > 0 };
            } catch (error) {
                return { isWishlisted: false };
            }
        },
        ['wishlist-status', session.user.id, productId],
        { tags: ['wishlist'], revalidate: 3600 }
    )();
}
