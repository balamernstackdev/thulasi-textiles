'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Grant points to a user based on an order.
 * Rule: 1 point for every ₹100 of the total.
 */
export async function grantPointsForOrder(orderId: string) {
    try {
        const order = await prismadb.order.findUnique({
            where: { id: orderId },
            include: { user: true }
        });

        if (!order || !order.userId || order.status !== 'DELIVERED') {
            return { success: false, error: 'Invalid order for points' };
        }

        // Calculate points (₹100 = 1 point)
        const total = Number(order.total);
        const pointsToGrant = Math.floor(total / 100);

        if (pointsToGrant <= 0) return { success: true, message: 'Total too low for points' };

        // Check if transaction already exists for this order to prevent double-granting
        const existing = await prismadb.pointTransaction.findFirst({
            where: {
                userId: order.userId,
                description: { contains: `Order ${orderId}` }
            }
        });

        if (existing) return { success: false, error: 'Points already granted for this order' };

        // Transactional update
        await prismadb.$transaction([
            prismadb.user.update({
                where: { id: order.userId },
                data: {
                    loyaltyPoints: { increment: pointsToGrant }
                }
            }),
            prismadb.pointTransaction.create({
                data: {
                    userId: order.userId,
                    amount: pointsToGrant,
                    description: `Points earned from Order #${orderId.slice(-6).toUpperCase()}`,
                    type: 'EARNED'
                }
            })
        ]);

        return { success: true, pointsEarned: pointsToGrant };
    } catch (error) {
        console.error('Grant points error:', error);
        return { success: false, error: 'Failed to grant points' };
    }
}

/**
 * Get current user's loyalty points and transaction history
 */
export async function getLoyaltyData() {
    const session = await getSession();
    if (!session) return { success: false, error: 'Not authenticated' };

    try {
        const user = await prismadb.user.findUnique({
            where: { id: session.user.id },
            select: { loyaltyPoints: true }
        });

        const history = await prismadb.pointTransaction.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' }
        });

        return {
            success: true,
            data: {
                points: user?.loyaltyPoints || 0,
                history: JSON.parse(JSON.stringify(history))
            }
        };
    } catch (error) {
        console.error('Get loyalty data error:', error);
        return { success: false, error: 'Failed' };
    }
}

/**
 * Admin: Manually adjust user points
 */
export async function adjustUserPoints(userId: string, amount: number, reason: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Unauthorized');
    }

    try {
        await prismadb.$transaction([
            prismadb.user.update({
                where: { id: userId },
                data: {
                    loyaltyPoints: { increment: amount }
                }
            }),
            prismadb.pointTransaction.create({
                data: {
                    userId,
                    amount,
                    description: `Admin adjustment: ${reason}`,
                    type: 'ADJUSTMENT'
                }
            })
        ]);

        revalidatePath('/admin/customers');
        return { success: true };
    } catch (error) {
        console.error('Adjust points error:', error);
        return { success: false, error: 'Failed to adjust points' };
    }
}
