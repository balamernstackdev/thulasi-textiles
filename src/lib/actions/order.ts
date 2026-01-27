'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { subDays, startOfDay, endOfDay } from 'date-fns';

export async function createOrder(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const addressId = formData.get('addressId') as string;
        const cartItems = JSON.parse(formData.get('cartItems') as string);
        const total = parseFloat(formData.get('total') as string);
        const couponId = formData.get('couponId') as string;
        const discountAmount = parseFloat(formData.get('discountAmount') as string) || 0;

        if (!addressId || !cartItems || cartItems.length === 0) {
            return { success: false, error: 'Invalid order data' };
        }

        // Create order with items
        const order = await prismadb.order.create({
            data: {
                userId: session.user.id,
                addressId,
                total,
                discountAmount,
                couponId: couponId || null,
                status: 'PENDING',
                paymentStatus: 'PENDING',
                items: {
                    create: cartItems.map((item: any) => ({
                        variantId: item.id,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true,
                            },
                        },
                    },
                },
            },
        });

        // Increment coupon usage
        if (couponId) {
            await prismadb.coupon.update({
                where: { id: couponId },
                data: {
                    usedCount: { increment: 1 }
                }
            });
        }

        // Update stock for each variant
        for (const item of cartItems) {
            await prismadb.productVariant.update({
                where: { id: item.id },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
            });
        }

        revalidatePath('/orders');
        return { success: true, data: order };
    } catch (error) {
        console.error('Order creation error:', error);
        return { success: false, error: 'Failed to create order' };
    }
}

export async function getUserOrders() {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const ordersRaw = await prismadb.order.findMany({
            where: { userId: session.user.id },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: { take: 1 },
                                    },
                                },
                            },
                        },
                    },
                },
                address: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const orders = ordersRaw as any[];

        // Serialize Decimal fields
        const serializedOrders = orders.map((order) => ({
            ...order,
            total: Number(order.total),
            discountAmount: Number(order.discountAmount || 0),
            items: order.items.map((item: any) => ({
                ...item,
                price: Number(item.price),
                variant: {
                    ...item.variant,
                    price: Number(item.variant.price),
                    discount: item.variant.discount ? Number(item.variant.discount) : 0,
                    product: {
                        ...item.variant.product,
                        basePrice: Number(item.variant.product.basePrice),
                    },
                },
            })),
        }));

        return { success: true, data: serializedOrders };
    } catch (error) {
        console.error('Fetch orders error:', error);
        return { success: false, error: 'Failed to fetch orders' };
    }
}

export async function getOrderById(orderId: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const order = await prismadb.order.findFirst({
            where: {
                id: orderId,
                userId: session.user.id,
            },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: { take: 1 },
                                    },
                                },
                            },
                        },
                    },
                },
                address: true,
            },
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        // Serialize
        const orderData = order as any;
        const serializedOrder = {
            ...orderData,
            total: Number(orderData.total),
            discountAmount: Number(orderData.discountAmount || 0),
            items: orderData.items.map((item: any) => ({
                ...item,
                price: Number(item.price),
                variant: {
                    ...item.variant,
                    price: Number(item.variant.price),
                    discount: item.variant.discount ? Number(item.variant.discount) : 0,
                    product: {
                        ...item.variant.product,
                        basePrice: Number(item.variant.product.basePrice),
                    },
                },
            })),
        };

        return { success: true, data: serializedOrder };
    } catch (error) {
        console.error('Fetch order error:', error);
        return { success: false, error: 'Failed to fetch order' };
    }
}

export async function getAdminOrders(options: {
    page?: number,
    pageSize?: number,
    status?: string
} = {}) {
    try {
        const { page = 1, pageSize = 10, status } = options;
        const skip = (page - 1) * pageSize;

        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }

        const [orders, total] = await Promise.all([
            prismadb.order.findMany({
                where,
                include: {
                    user: true,
                    address: true,
                    items: {
                        include: {
                            variant: {
                                include: {
                                    product: true
                                }
                            }
                        }
                    }
                },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prismadb.order.count({ where })
        ]);

        const serializedOrders = (orders as any[]).map((order) => ({
            ...order,
            total: Number(order.total),
            discountAmount: Number(order.discountAmount || 0),
            items: order.items.map((item: any) => ({
                ...item,
                price: Number(item.price),
                variant: {
                    ...item.variant,
                    price: Number(item.variant.price),
                    discount: item.variant.discount ? Number(item.variant.discount) : 0,
                    product: {
                        ...item.variant.product,
                        basePrice: Number(item.variant.product.basePrice),
                    },
                },
            })),
        }));

        return {
            success: true,
            data: JSON.parse(JSON.stringify(serializedOrders)),
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        console.error('Admin Fetch orders error:', error);
        return { success: false, error: 'Failed to fetch orders' };
    }
}

export async function getDashboardStats() {
    try {
        const thirtyDaysAgo = subDays(new Date(), 30);

        const [
            orderCount,
            totalRevenueResult,
            productCount,
            categoryCount,
            recentOrders,
            pendingOrdersCount,
            lowStockProducts,
            last30DaysOrdersFull,
            allCategories,
            newUserList
        ] = await Promise.all([
            prismadb.order.count(),
            prismadb.order.aggregate({
                _sum: { total: true },
                where: {
                    status: { notIn: ['CANCELLED'] },
                    paymentStatus: { notIn: ['FAILED'] }
                }
            }),
            prismadb.product.count(),
            prismadb.category.count(),
            prismadb.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: true }
            }),
            prismadb.order.count({
                where: { status: 'PENDING' }
            }),
            prismadb.product.findMany({
                where: {
                    variants: { some: { stock: { lte: 5 } } }
                },
                include: {
                    variants: { where: { stock: { lte: 5 } } }
                },
                take: 5
            }),
            prismadb.order.findMany({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    status: { not: 'CANCELLED' },
                    paymentStatus: { not: 'FAILED' }
                },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: { product: true }
                            }
                        }
                    }
                }
            }),
            prismadb.category.findMany({
                select: { id: true, name: true }
            }),
            prismadb.user.findMany({
                where: {
                    createdAt: { gte: thirtyDaysAgo },
                    role: 'CUSTOMER'
                },
                select: { createdAt: true }
            })
        ]);

        // Flatten items from orders for easier processing
        const topOrderItems = last30DaysOrdersFull.flatMap(order => order.items);

        // Process Sales Trend & Customer Growth (Last 30 Days)
        const salesTrend = Array.from({ length: 30 }, (_, i) => {
            const date = subDays(new Date(), i);
            const dateStr = date.toISOString().split('T')[0];

            const dayTotal = last30DaysOrdersFull
                .filter(o => o.createdAt.toISOString().split('T')[0] === dateStr)
                .reduce((sum, o) => sum + Number(o.total), 0);

            const dayNewUsers = newUserList
                .filter(u => u.createdAt.toISOString().split('T')[0] === dateStr)
                .length;

            return {
                date: dateStr,
                revenue: dayTotal,
                customers: dayNewUsers
            };
        }).reverse();

        // Process Category Distribution
        const categoryData = allCategories.map(cat => {
            const catRevenue = topOrderItems
                .filter(item => item.variant?.product?.categoryId === cat.id)
                .reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

            return {
                name: cat.name,
                value: catRevenue
            };
        }).filter(c => c.value > 0);

        // Process Top Products
        const productSales: Record<string, { name: string, revenue: number, sales: number }> = {};
        topOrderItems.forEach(item => {
            const p = item.variant?.product;
            if (p) {
                if (!productSales[p.id]) {
                    productSales[p.id] = { name: p.name, revenue: 0, sales: 0 };
                }
                productSales[p.id].revenue += Number(item.price) * item.quantity;
                productSales[p.id].sales += item.quantity;
            }
        });

        const topSellingProducts = Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        return {
            success: true,
            data: {
                orderCount,
                totalRevenue: Number(totalRevenueResult._sum.total || 0),
                productCount,
                categoryCount,
                recentOrders: JSON.parse(JSON.stringify(recentOrders.map(o => ({
                    ...o,
                    total: Number(o.total)
                })))),
                pendingOrdersCount,
                lowStockProducts: JSON.parse(JSON.stringify(lowStockProducts.map(p => ({
                    ...p,
                    basePrice: Number(p.basePrice)
                })))),
                analytics: JSON.parse(JSON.stringify({
                    salesTrend,
                    categoryData,
                    topSellingProducts
                }))
            }
        };
    } catch (error) {
        console.error('Dashboard stats error:', error);
        return { success: false, error: 'Failed to fetch dashboard stats' };
    }
}

export async function getAdminOrderById(orderId: string) {
    try {
        const order = await prismadb.order.findUnique({
            where: { id: orderId },
            include: {
                user: true,
                address: true,
                items: {
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!order) {
            return { success: false, error: 'Order not found' };
        }

        const orderData = order as any;
        const serializedOrder = {
            ...orderData,
            total: Number(orderData.total),
            discountAmount: Number(orderData.discountAmount || 0),
            items: orderData.items.map((item: any) => ({
                ...item,
                price: Number(item.price),
                variant: {
                    ...item.variant,
                    price: Number(item.variant.price),
                    discount: item.variant.discount ? Number(item.variant.discount) : 0,
                    product: {
                        ...item.variant.product,
                        basePrice: Number(item.variant.product.basePrice),
                    },
                },
            })),
        };

        return { success: true, data: serializedOrder };
    } catch (error) {
        console.error('Admin Fetch order error:', error);
        return { success: false, error: 'Failed to fetch order' };
    }
}

import { sendEmail } from '@/lib/mail';
import { getShippingNotificationTemplate } from '@/lib/mail-templates';

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const order = await prismadb.order.update({
            where: { id: orderId },
            data: { status: status as any },
            include: {
                items: {
                    include: {
                        variant: {
                            include: {
                                product: true
                            }
                        }
                    }
                },
                user: true,
                address: true
            }
        });

        // Email Triggers
        if (order.user?.email) {
            if (status === 'SHIPPED') {
                await sendEmail({
                    to: order.user.email,
                    subject: 'Good News! Your Thulasi Textiles order has shipped 🚚',
                    html: getShippingNotificationTemplate(order)
                });
            } else if (status === 'CANCELLED') {
                await sendEmail({
                    to: order.user.email,
                    subject: 'Order Cancellation Update - Thulasi Textiles',
                    html: `<p>Your order #${orderId.slice(-6).toUpperCase()} has been cancelled. If this was not requested by you, please contact support.</p>`
                });
            }
        }

        // If cancelled, restore stock
        if (status === 'CANCELLED') {
            for (const item of order.items) {
                await prismadb.productVariant.update({
                    where: { id: item.variantId },
                    data: {
                        stock: {
                            increment: item.quantity
                        }
                    }
                });
            }
        }

        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        return { success: true, data: order };
    } catch (error) {
        console.error('Update order status error:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}

export async function updateUserRole(userId: string, role: 'ADMIN' | 'CUSTOMER') {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        await prismadb.user.update({
            where: { id: userId },
            data: { role }
        });
        revalidatePath('/admin/customers');
        return { success: true };
    } catch (error) {
        console.error('Update user role error:', error);
        return { success: false, error: 'Failed to update user role' };
    }
}

export async function updateOrderTracking(orderId: string, courierName: string, trackingNumber: string) {
    try {
        await prismadb.order.update({
            where: { id: orderId },
            data: {
                courierName,
                trackingNumber,
                status: 'SHIPPED'
            }
        });
        revalidatePath('/admin/orders');
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/orders');
        return { success: true };
    } catch (error) {
        console.error('Error updating order tracking:', error);
        return { success: false, error: 'Failed to update tracking' };
    }
}
