'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createOrder(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const addressId = formData.get('addressId') as string;
        const cartItems = JSON.parse(formData.get('cartItems') as string);
        const total = parseFloat(formData.get('total') as string);

        if (!addressId || !cartItems || cartItems.length === 0) {
            return { success: false, error: 'Invalid order data' };
        }

        // Create order with items
        const order = await prismadb.order.create({
            data: {
                userId: session.user.id,
                addressId,
                total,
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
        const orders = await prismadb.order.findMany({
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

        // Serialize Decimal fields
        const serializedOrders = orders.map((order) => ({
            ...order,
            total: Number(order.total),
            items: order.items.map((item) => ({
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
        const serializedOrder = {
            ...order,
            total: Number(order.total),
            items: order.items.map((item) => ({
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

        const serializedOrders = orders.map((order) => ({
            ...order,
            total: Number(order.total),
        }));

        return {
            success: true,
            data: serializedOrders,
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
        const [
            orderCount,
            totalRevenueResult,
            productCount,
            categoryCount,
            recentOrders,
            pendingOrdersCount,
            lowStockProducts
        ] = await Promise.all([
            prismadb.order.count(),
            prismadb.order.aggregate({
                _sum: {
                    total: true
                },
                where: {
                    status: {
                        notIn: ['CANCELLED']
                    },
                    paymentStatus: {
                        notIn: ['FAILED']
                    }
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
                    variants: {
                        some: {
                            stock: {
                                lte: 5
                            }
                        }
                    }
                },
                include: {
                    variants: {
                        where: {
                            stock: {
                                lte: 5
                            }
                        }
                    }
                },
                take: 5
            })
        ]);

        return {
            success: true,
            data: {
                orderCount,
                totalRevenue: Number(totalRevenueResult._sum.total || 0),
                productCount,
                categoryCount,
                recentOrders: recentOrders.map(o => ({
                    ...o,
                    total: Number(o.total)
                })),
                pendingOrdersCount,
                lowStockProducts: lowStockProducts.map(p => ({
                    ...p,
                    basePrice: Number(p.basePrice)
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

        const serializedOrder = {
            ...order,
            total: Number(order.total),
            items: order.items.map((item) => ({
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

export async function updateOrderStatus(orderId: string, status: string) {
    try {
        const order = await prismadb.order.update({
            where: { id: orderId },
            data: { status: status as any },
            include: { items: true }
        });

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
