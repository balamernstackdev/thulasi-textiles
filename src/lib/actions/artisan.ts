'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getArtisans() {
    try {
        const artisans = await prismadb.artisan.findMany({
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });
        return { success: true, data: JSON.parse(JSON.stringify(artisans)) };
    } catch (error) {
        console.error('Fetch artisans error:', error);
        return { success: false, error: 'Failed to fetch artisans' };
    }
}

export async function getArtisanById(id: string) {
    try {
        const artisan = await prismadb.artisan.findUnique({
            where: { id },
            include: {
                products: {
                    include: {
                        images: { where: { isPrimary: true } }
                    }
                }
            }
        });
        if (!artisan) return { success: false, error: 'Artisan not found' };
        return { success: true, data: JSON.parse(JSON.stringify(artisan)) };
    } catch (error) {
        console.error('Fetch artisan error:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function createArtisan(data: {
    name: string;
    bio?: string;
    experienceYears?: number;
    village?: string;
    imageUrl?: string;
    specialty?: string;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        const artisan = await prismadb.artisan.create({
            data
        });
        revalidatePath('/admin/artisans');
        return { success: true, data: artisan };
    } catch (error) {
        console.error('Create artisan error:', error);
        return { success: false, error: 'Failed to create artisan' };
    }
}

export async function updateArtisan(id: string, data: {
    name: string;
    bio?: string;
    experienceYears?: number;
    village?: string;
    imageUrl?: string;
    specialty?: string;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        const artisan = await prismadb.artisan.update({
            where: { id },
            data
        });
        revalidatePath('/admin/artisans');
        revalidatePath(`/admin/artisans/${id}`);
        return { success: true, data: artisan };
    } catch (error) {
        console.error('Update artisan error:', error);
        return { success: false, error: 'Failed to update artisan' };
    }
}

export async function deleteArtisan(id: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        await prismadb.artisan.delete({
            where: { id }
        });
        revalidatePath('/admin/artisans');
        return { success: true };
    } catch (error) {
        console.error('Delete artisan error:', error);
        return { success: false, error: 'Failed to delete artisan. Ensure they have no linked products.' };
    }
}
