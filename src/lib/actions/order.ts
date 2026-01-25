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
