'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getStoreSettings() {
    try {
        // Try to find the existing settings
        let settings = await prisma.storeSettings.findFirst();

        // If no settings exist, create a default record
        if (!settings) {
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: 'Thulasi Textiles',
                    currency: 'INR',
                }
            });
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error('Failed to fetching store settings:', error);
        return { success: false, error: 'Failed to load settings' };
    }
}

export async function updateStoreSettings(formData: FormData) {
    try {
        const storeName = formData.get('storeName') as string;
        const supportEmail = formData.get('supportEmail') as string;
        const supportPhone = formData.get('supportPhone') as string;
        const currency = formData.get('currency') as string;

        const seoTitle = formData.get('seoTitle') as string;
        const seoDescription = formData.get('seoDescription') as string;

        const socialInstagram = formData.get('socialInstagram') as string;
        const socialFacebook = formData.get('socialFacebook') as string;
        const socialTwitter = formData.get('socialTwitter') as string;

        // Helper to find the first record ID since we treat it as a singleton
        const existing = await prisma.storeSettings.findFirst();

        if (existing) {
            await prisma.storeSettings.update({
                where: { id: existing.id },
                data: {
                    storeName,
                    supportEmail,
                    supportPhone,
                    currency,
                    seoTitle,
                    seoDescription,
                    socialInstagram,
                    socialFacebook,
                    socialTwitter
                }
            });
        } else {
            // Fallback if somehow missing
            await prisma.storeSettings.create({
                data: {
                    storeName,
                    supportEmail,
                    supportPhone,
                    currency,
                    seoTitle,
                    seoDescription,
                    socialInstagram,
                    socialFacebook,
                    socialTwitter
                }
            });
        }

        revalidatePath('/', 'layout');
        revalidatePath('/admin/settings');

        return { success: true };
    } catch (error) {
        console.error('Failed to update store settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
