'use server';

import prisma from '@/lib/prisma';
import { unstable_cache, revalidateTag, revalidatePath } from 'next/cache';

export async function getCategoriesTree() {
    try {
        const categories = await prisma.category.findMany({
            where: { parentId: null },
            include: {
                children: true,
            },
            orderBy: { name: 'asc' }
        });
        console.log(`[DATABASE_SUCCESS] Loaded ${categories.length} root categories.`);
        return { success: true, data: categories };
    } catch (error) {
        console.error('[DATABASE_ERROR] Failed to load categories tree:', error);
        return { success: false, error: 'Failed to load categories' };
    }
}

export async function getCategoryBySlug(slug: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { slug },
            include: {
                children: true,
                parent: {
                    include: {
                        children: true
                    }
                },
            }
        });
        return { success: true, data: category };
    } catch (error) {
        console.error('Error fetching category:', error);
        return { success: false, error: 'Failed to load category' };
    }
}
export async function getCategories(options: {
    page?: number,
    pageSize?: number
} = {}) {
    try {
        const { page = 1, pageSize = 10 } = options;
        const skip = (page - 1) * pageSize;

        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                include: {
                    parent: true,
                },
                skip,
                take: pageSize,
                orderBy: { name: 'asc' }
            }),
            prisma.category.count()
        ]);

        return {
            success: true,
            data: categories,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        return { success: false, error: 'Failed to load categories' };
    }
}

export async function getCategoryById(id: string) {
    try {
        const category = await prisma.category.findUnique({
            where: { id },
            include: {
                parent: true
            }
        });
        return { success: true, data: category };
    } catch (error) {
        return { success: false, error: 'Failed to load category' };
    }
}

export async function createCategory(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const parentId = formData.get('parentId') as string || null;

        const category = await prisma.category.create({
            data: {
                name,
                slug,
                description,
                image,
                parentId: parentId === 'none' ? null : parentId,
            }
        });

        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        revalidatePath('/admin/categories', 'page');

        return { success: true, data: category };
    } catch (error) {
        return { success: false, error: 'Failed to create category' };
    }
}

export async function updateCategory(id: string, formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const parentId = formData.get('parentId') as string || null;

        const category = await prisma.category.update({
            where: { id },
            data: {
                name,
                slug,
                description,
                image,
                parentId: parentId === 'none' ? null : parentId,
            }
        });

        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        revalidatePath('/admin/categories', 'page');

        return { success: true, data: category };
    } catch (error) {
        return { success: false, error: 'Failed to update category' };
    }
}

export async function deleteCategory(id: string) {
    try {
        await prisma.category.delete({
            where: { id }
        });

        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        revalidatePath('/admin/categories', 'page');

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete category' };
    }
}
export async function revalidateCategories() {
    try {
        revalidateTag('categories', 'default');
        revalidatePath('/', 'layout');
        revalidatePath('/admin/categories', 'page');
        return { success: true };
    } catch (error) {
        console.error('Revalidation error:', error);
        return { success: false, error: 'Failed to refresh cache' };
    }
}
