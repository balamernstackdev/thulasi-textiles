'use server';

import prismadb from '@/lib/prisma';
import { revalidatePath, unstable_cache } from 'next/cache';
import { cache } from 'react';

export const getBanners = cache(async (options: {
    page?: number,
    pageSize?: number,
    isActive?: boolean
} = {}) => {
    const key = JSON.stringify(options);
    return unstable_cache(
        async () => {
            try {
                const { page = 1, pageSize = 10, isActive } = options;
                const skip = (page - 1) * pageSize;

                let where: any = {};
                if (isActive !== undefined) {
                    where.isActive = isActive;
                }

                const [banners, total] = await Promise.all([
                    prismadb.banner.findMany({
                        where,
                        skip,
                        take: pageSize,
                        orderBy: { order: 'asc' }
                    }),
                    prismadb.banner.count({ where })
                ]);

                return {
                    success: true,
                    data: banners,
                    pagination: {
                        total,
                        page,
                        pageSize,
                        totalPages: Math.ceil(total / pageSize)
                    }
                };
            } catch (error) {
                console.error('Failed to fetch banners:', error);
                return { success: false, error: 'Failed to fetch banners' };
            }
        },
        ['banners-list', key],
        { tags: ['banners'], revalidate: 3600 }
    )();
});

export async function createBanner(formData: FormData) {
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const buttonText = formData.get('buttonText') as string;
    const link = formData.get('link') as string;
    const type = formData.get('type') as any; // BannerType
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    const videoUrl = formData.get('videoUrl') as string;
    const mobileImageUrl = formData.get('mobileImageUrl') as string;
    const countdownEndDate = formData.get('countdownEndDate') as string;
    const backgroundColor = formData.get('backgroundColor') as string;
    const textColor = formData.get('textColor') as string;
    const alignment = formData.get('alignment') as any; // BannerAlignment

    if (!imageUrl && !videoUrl) {
        return { success: false, error: 'Image URL or Video URL is required' };
    }

    try {
        await prismadb.banner.create({
            data: {
                imageUrl,
                mobileImageUrl: mobileImageUrl || null,
                videoUrl: videoUrl || null,
                title: title || null,
                subtitle: subtitle || null,
                buttonText: buttonText || "Shop Now",
                link: link || null,
                type: type || 'HOME_MAIN',
                isActive,
                order,
                countdownEndDate: countdownEndDate ? new Date(countdownEndDate) : null,
                backgroundColor: backgroundColor || "#000000",
                textColor: textColor || "#ffffff",
                alignment: alignment || 'LEFT',
            } as any
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        console.error('Failed to create banner:', error);
        return { success: false, error: 'Failed to create banner' };
    }
}

export async function updateBanner(id: string, formData: FormData) {
    const imageUrl = formData.get('imageUrl') as string;
    const title = formData.get('title') as string;
    const subtitle = formData.get('subtitle') as string;
    const buttonText = formData.get('buttonText') as string;
    const link = formData.get('link') as string;
    const type = formData.get('type') as any;
    const isActive = formData.get('isActive') === 'true';
    const order = parseInt(formData.get('order') as string) || 0;

    const videoUrl = formData.get('videoUrl') as string;
    const mobileImageUrl = formData.get('mobileImageUrl') as string;
    const countdownEndDate = formData.get('countdownEndDate') as string;
    const backgroundColor = formData.get('backgroundColor') as string;
    const textColor = formData.get('textColor') as string;
    const alignment = formData.get('alignment') as any;

    try {
        await prismadb.banner.update({
            where: { id },
            data: {
                imageUrl,
                mobileImageUrl: mobileImageUrl || null,
                videoUrl: videoUrl || null,
                title: title || null,
                subtitle: subtitle || null,
                buttonText: buttonText || "Shop Now",
                link: link || null,
                type: type || 'HOME_MAIN',
                isActive,
                order,
                countdownEndDate: countdownEndDate ? new Date(countdownEndDate) : null,
                backgroundColor: backgroundColor || "#000000",
                textColor: textColor || "#ffffff",
                alignment: alignment || 'LEFT',
            } as any
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error) {
        console.error('Failed to update banner:', error);
        return { success: false, error: 'Failed to update banner' };
    }
}

export async function deleteBanner(id: string) {
    try {
        await prismadb.banner.delete({
            where: { id }
        });
        revalidatePath('/');
        revalidatePath('/admin/banners');
        return { success: true };
    } catch (error: any) {
        // If record doesn't exist (P2025), consider it success to avoid UI errors on stale data
        if (error.code === 'P2025') {
            revalidatePath('/');
            revalidatePath('/admin/banners');
            return { success: true };
        }
        console.error('Failed to delete banner:', error);
        return { success: false, error: 'Failed to delete banner' };
    }
}
