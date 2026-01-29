'use server';

import prismadb from '@/lib/prisma';
import { startOfMonth, subMonths, format, startOfDay, subDays } from 'date-fns';

export async function getAdminDashboardStats() {
    try {
        const [
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers,
            recentOrders,
            lowStockProducts
        ] = await Promise.all([
            // Total Revenue (Paid)
            prismadb.order.aggregate({
                where: { paymentStatus: 'PAID' },
                _sum: { total: true }
            }),
            // Total Orders
            prismadb.order.count(),
            // Total Products
            prismadb.product.count({ where: { isActive: true } }),
            // Total Customers
            prismadb.user.count({ where: { role: 'CUSTOMER' } }),
            // Recent Orders
            prismadb.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true, email: true } } }
            }),
            // Low Stock
            prismadb.productVariant.findMany({
                where: { stock: { lte: 5 } },
                take: 5,
                include: { product: { select: { name: true } } }
            })
        ]);

        return {
            totalRevenue: Number(totalRevenue._sum.total || 0),
            totalOrders,
            totalProducts,
            totalCustomers,
            recentOrders: recentOrders.map(o => ({
                id: o.id,
                customer: o.user?.name || 'Guest',
                total: Number(o.total),
                status: o.status,
                date: o.createdAt
            })),
            lowStockProducts: lowStockProducts.map(v => ({
                id: v.id,
                name: v.product.name,
                stock: v.stock,
                variant: `${v.size || ''} ${v.color || ''}`.trim()
            }))
        };
    } catch (error) {
        console.error('Admin stats error:', error);
        return null;
    }
}

export async function getSalesAnalyticsData(range: '7d' | '30d' | '6m' = '30d') {
    try {
        const endDate = new Date();
        let startDate = subDays(endDate, 30);

        if (range === '7d') startDate = subDays(endDate, 7);
        if (range === '6m') startDate = subMonths(endDate, 6);

        const orders = await prismadb.order.findMany({
            where: {
                createdAt: { gte: startDate },
                paymentStatus: 'PAID'
            },
            select: {
                createdAt: true,
                total: true
            },
            orderBy: { createdAt: 'asc' }
        });

        // Group by Date
        const grouped = orders.reduce((acc, order) => {
            const dateKey = format(order.createdAt, 'MMM d');
            if (!acc[dateKey]) {
                acc[dateKey] = { date: dateKey, revenue: 0, orders: 0 };
            }
            acc[dateKey].revenue += Number(order.total);
            acc[dateKey].orders += 1;
            return acc;
        }, {} as Record<string, any>);

        return Object.values(grouped);
    } catch (error) {
        console.error('Analytics Data Error:', error);
        return [];
    }
}

export async function getInventoryHeatmapData() {
    try {
        const categories = await prismadb.category.findMany({
            include: {
                products: {
                    include: {
                        variants: true
                    }
                }
            }
        });

        return categories.map(category => {
            const totalStock = category.products.reduce((acc, product) => {
                return acc + product.variants.reduce((sum, v) => sum + v.stock, 0);
            }, 0);
            return {
                name: category.name,
                stock: totalStock
            };
        }).sort((a, b) => b.stock - a.stock);

    } catch (error) {
        console.error('Inventory Heatmap Error:', error);
        return [];
    }
}
