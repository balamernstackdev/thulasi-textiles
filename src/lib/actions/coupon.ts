'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { CouponType } from '@prisma/client';

export async function getCoupons() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const coupons = await prismadb.coupon.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: JSON.parse(JSON.stringify(coupons)) };
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return { success: false, error: 'Failed to fetch coupons' };
    }
}

export async function createCoupon(data: {
    code: string;
    discountType: CouponType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    expiryDate?: Date;
    isActive?: boolean;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const coupon = await prismadb.coupon.create({
            data: {
                ...data,
                code: data.code.toUpperCase().trim()
            }
        });
        revalidatePath('/admin/coupons');
        return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
    } catch (error) {
        console.error('Error creating coupon:', error);
        return { success: false, error: 'Failed to create coupon. Code might already exist.' };
    }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prismadb.coupon.update({
            where: { id },
            data: { isActive }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update coupon status' };
    }
}

export async function deleteCoupon(id: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prismadb.coupon.delete({
            where: { id }
        });
        revalidatePath('/admin/coupons');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete coupon' };
    }
}

export async function validateCoupon(code: string, cartTotal: number) {
    try {
        const coupon = await prismadb.coupon.findUnique({
            where: { code: code.toUpperCase().trim() }
        });

        if (!coupon || !coupon.isActive) {
            return { success: false, error: 'Invalid or inactive coupon code' };
        }

        if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
            return { success: false, error: 'This coupon has expired' };
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return { success: false, error: 'Coupon usage limit reached' };
        }

        if (cartTotal < Number(coupon.minOrderAmount)) {
            return { success: false, error: `Minimum order of ₹${coupon.minOrderAmount} required for this coupon` };
        }

        let discountAmount = 0;
        if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (cartTotal * Number(coupon.discountValue)) / 100;
            if (coupon.maxDiscount && discountAmount > Number(coupon.maxDiscount)) {
                discountAmount = Number(coupon.maxDiscount);
            }
        } else {
            discountAmount = Number(coupon.discountValue);
        }

        return {
            success: true,
            data: {
                id: coupon.id,
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: Number(coupon.discountValue),
                discountAmount: Math.min(discountAmount, cartTotal)
            }
        };
    } catch (error) {
        console.error('Coupon validation error:', error);
        return { success: false, error: 'An error occurred during verification' };
    }
}

export async function getCoupon(id: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const coupon = await prismadb.coupon.findUnique({
            where: { id }
        });

        if (!coupon) {
            return { success: false, error: 'Coupon not found' };
        }

        return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
    } catch (error) {
        console.error('Error fetching coupon:', error);
        return { success: false, error: 'Failed to fetch coupon' };
    }
}

export async function updateCoupon(id: string, data: {
    code: string;
    discountType: CouponType;
    discountValue: number;
    minOrderAmount?: number;
    maxDiscount?: number;
    usageLimit?: number;
    expiryDate?: Date;
    isActive?: boolean;
}) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        // Check if code is already taken by another coupon
        const existingCoupon = await prismadb.coupon.findFirst({
            where: {
                code: data.code.toUpperCase().trim(),
                NOT: { id }
            }
        });

        if (existingCoupon) {
            return { success: false, error: 'Coupon code already exists' };
        }

        const coupon = await prismadb.coupon.update({
            where: { id },
            data: {
                ...data,
                code: data.code.toUpperCase().trim()
            }
        });
        revalidatePath('/admin/coupons');
        revalidatePath(`/admin/coupons/${id}`);
        return { success: true, data: JSON.parse(JSON.stringify(coupon)) };
    } catch (error) {
        console.error('Error updating coupon:', error);
        return { success: false, error: 'Failed to update coupon' };
    }
}
