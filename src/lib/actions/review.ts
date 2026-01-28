'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache';
import { cache } from 'react';

export async function addReview(productId: string, rating: number, comment: string, images: string[] = []) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Please login to leave a review.' };
    }

    try {
        // Verified Purchase Check
        const hasOrdered = await prismadb.order.findFirst({
            where: {
                userId: session.user.id,
                status: 'DELIVERED',
                items: {
                    some: {
                        variant: {
                            productId
                        }
                    }
                }
            }
        });

        if (!hasOrdered) {
            return { success: false, error: 'You can only review products you have purchased and received.' };
        }

        // Check if already reviewed
        const existingReview = await prismadb.review.findFirst({
            where: {
                userId: session.user.id,
                productId
            }
        });

        if (existingReview) {
            return { success: false, error: 'You have already reviewed this product.' };
        }

        await prismadb.review.create({
            data: {
                rating,
                comment,
                userId: session.user.id,
                productId,
                isPublic: true,
                images: {
                    create: images.map(url => ({ url }))
                }
            }
        });

        revalidateTag('reviews', 'product-reviews');
        revalidatePath(`/product/${productId}`);

        return { success: true, message: 'Review submitted successfully!' };
    } catch (error) {
        console.error('Add review error:', error);
        return { success: false, error: 'Failed to submit review.' };
    }
}

export const getReviews = cache(async (productId: string) => {
    return unstable_cache(
        async () => {
            try {
                const reviews = await prismadb.review.findMany({
                    where: {
                        productId,
                        isPublic: true
                    },
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        },
                        images: true
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                });

                return { success: true, data: reviews };
            } catch (error) {
                console.error('Get reviews error:', error);
                return { success: false, data: [] };
            }
        },
        ['product-reviews', productId],
        { tags: ['reviews', `product-reviews-${productId}`], revalidate: 3600 }
    )();
});

export async function getAdminReviews() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const reviews = await prismadb.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, slug: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, data: reviews };
    } catch (error) {
        console.error('Admin get reviews error:', error);
        return { success: false, error: 'Failed to fetch reviews' };
    }
}

export async function updateReviewStatus(id: string, isPublic: boolean) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prismadb.review.update({
            where: { id },
            data: { isPublic }
        });

        revalidateTag('reviews', 'product-reviews');
        return { success: true };
    } catch (error) {
        console.error('Update review status error:', error);
        return { success: false, error: 'Failed to update review status' };
    }
}

export async function deleteReview(id: string) {
    const session = await getSession();
    if (!session) return { success: false, error: 'Unauthorized' };

    try {
        const review = await prismadb.review.findUnique({
            where: { id }
        });

        if (!review) return { success: false, error: 'Review not found' };

        // Only allow owner or admin to delete
        if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return { success: false, error: 'Unauthorized' };
        }

        await prismadb.review.delete({
            where: { id }
        });

        revalidateTag('reviews', 'product-reviews');
        return { success: true };
    } catch (error) {
        console.error('Delete review error:', error);
        return { success: false, error: 'Failed to delete review' };
    }
}

export const getGalleryReviews = cache(async () => {
    return unstable_cache(
        async () => {
            try {
                const reviews = await prismadb.review.findMany({
                    where: {
                        isPublic: true,
                        images: {
                            some: {} // Only reviews with at least one image
                        }
                    },
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                        createdAt: true,
                        user: { select: { name: true } },
                        images: true,
                        product: { select: { name: true, slug: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 12
                });

                return { success: true, data: reviews };
            } catch (error) {
                console.error('Get gallery reviews error:', error);
                return { success: false, data: [] };
            }
        },
        ['social-gallery'],
        { tags: ['reviews'], revalidate: 3600 }
    )();
});
