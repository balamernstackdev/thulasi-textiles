'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getInventoryItems() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        const variants = await prismadb.productVariant.findMany({
            include: {
                product: {
                    include: { category: true }
                }
            },
            orderBy: {
                product: { createdAt: 'desc' }
            }
        });

        return {
            success: true,
            data: JSON.parse(JSON.stringify(variants.map(v => ({
                ...v,
                price: Number(v.price),
                discount: v.discount ? Number(v.discount) : 0,
                product: {
                    ...v.product,
                    basePrice: Number(v.product.basePrice)
                }
            }))))
        };
    } catch (error) {
        console.error('Fetch inventory error:', error);
        return { success: false, error: 'Failed to fetch inventory' };
    }
}

export async function bulkUpdateInventory(data: {
    variantIds: string[];
    stockUpdate?: number;
    priceUpdate?: number;
    isActive?: boolean;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        const { variantIds, stockUpdate, priceUpdate, isActive } = data;

        const updateData: any = {};
        if (typeof stockUpdate === 'number') updateData.stock = stockUpdate;
        if (typeof priceUpdate === 'number') updateData.price = priceUpdate;
        if (typeof isActive === 'boolean') updateData.isActive = isActive;

        await prismadb.productVariant.updateMany({
            where: {
                id: { in: variantIds }
            },
            data: updateData
        });

        revalidatePath('/admin/inventory');
        revalidatePath('/admin/products');
        revalidatePath('/admin');

        return { success: true };
    } catch (error) {
        console.error('Bulk update error:', error);
        return { success: false, error: 'Failed to perform bulk update' };
    }
}
