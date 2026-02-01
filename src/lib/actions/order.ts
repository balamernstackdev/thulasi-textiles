'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { sendEmail } from '@/lib/mail';
import { grantPointsForOrder } from '@/lib/actions/loyalty';
import { createNotification, notifyAdmins } from '@/lib/actions/notification';
import { WhatsappService } from '@/lib/services/whatsapp';
import { serialize } from '@/lib/utils';




export async function createOrder(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const addressId = formData.get('addressId') as string;
        const cartItems = JSON.parse(formData.get('cartItems') as string);
        const couponId = formData.get('couponId') as string;
        const discountAmount = parseFloat(formData.get('discountAmount') as string) || 0;

        if (!addressId || !cartItems || cartItems.length === 0) {
            return { success: false, error: 'Invalid order data' };
        }

        // Calculate total server-side for security and consistency (Inclusive Tax model)
        const itemsSubtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const shipping = itemsSubtotal > 2999 ? 0 : 99;
        const total = itemsSubtotal + shipping - discountAmount;

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

        // Notify User: Order Placed
        await createNotification({
            userId: session.user.id,
            title: 'Order Confirmed! 🎉',
            message: `Your order #${order.id.slice(-6).toUpperCase()} has been placed successfully.`,
            type: 'ORDER_NEW',
            link: `/orders/${order.id}`
        });

        // Notify User: WhatsApp Confirmation (Fire & Forget)
        if (session.user.email) {
            const phone = '919876543210'; // In a real app, use the phone from Address
            console.log('Use Whatsapp Service', phone, order.id, total, session.user.name);
            try {
                await WhatsappService.sendOrderConfirmation(phone, order.id, total, session.user.name || 'Valued Customer');
            } catch (e) {
                console.error('Failed to send WhatsApp:', e);
            }
        }

        // Notify Admins: New Sale
        await notifyAdmins({
            title: 'New Sale Alert! 💰',
            message: `New order #${order.id.slice(-6).toUpperCase()} received from ${session.user.name}. Value: ₹${total}`,
            type: 'ORDER_NEW',
            link: `/admin/orders`
        });

        // Update stock and check for alerts

        const settings = await prismadb.storeSettings.findFirst();
        const adminEmail = settings?.supportEmail || 'support@thulasitextiles.com';

        for (const item of cartItems) {
            const updatedVariant = await prismadb.productVariant.update({
                where: { id: item.id },
                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },
                include: {
                    product: true
                }
            });

            // Inventory Alert Trigger
            if (updatedVariant.stock <= 5) {
                await sendEmail({
                    to: adminEmail,
                    subject: `🚨 Inventory Alert: ${updatedVariant.product.name} is Low!`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                            <h2 style="color: #e11d48; margin-top: 0;">Low Stock Alert</h2>
                            <p>The following masterpiece is running out of stock:</p>
                            <div style="background: #fff1f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <p style="margin: 0; font-weight: bold; color: #9f1239;">${updatedVariant.product.name}</p>
                                <p style="margin: 5px 0 0 0; font-size: 14px; color: #e11d48;">
                                    Remaining Stock: <strong>${updatedVariant.stock} units</strong>
                                </p>
                            </div>
                            <p style="font-size: 13px; color: #666;">
                                Please restock soon to avoid missing out on potential sales.
                            </p>
                            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/products/${updatedVariant.product.id}/edit" 
                               style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 12px; text-transform: uppercase;">
                               Update Inventory
                            </a>
                        </div>
                    `
                });

                // Notify Admins: Low Stock
                await notifyAdmins({
                    title: 'Low Stock Alert ⚠️',
                    message: `${updatedVariant.product.name} is running low (${updatedVariant.stock} left).`,
                    type: 'SYSTEM',
                    link: `/admin/products/${updatedVariant.product.id}/edit`
                });
            }
        }


        revalidatePath('/orders');
        return { success: true, data: serialize(order) };
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
        return { success: true, data: serialize(ordersRaw) };
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
                                        artisan: true,
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

        return { success: true, data: serialize(order) };
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

        return {
            success: true,
            data: serialize(orders),
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
            data: serialize({
                orderCount,
                totalRevenue: Number(totalRevenueResult._sum.total || 0),
                productCount,
                categoryCount,
                recentOrders,
                pendingOrdersCount,
                lowStockProducts,
                analytics: {
                    salesTrend,
                    categoryData,
                    topSellingProducts
                }
            })
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

        return { success: true, data: serialize(order) };
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

        // Grant loyalty points if delivered
        if (status === 'DELIVERED') {
            await grantPointsForOrder(orderId);

            // Notify User: Points Earned
            if (order.user) {
                await createNotification({
                    userId: order.user.id,
                    title: 'Rewards Unlocked! 💎',
                    message: `You earned loyalty points for your recent purchase.`,
                    type: 'PROMOTION',
                    link: `/profile/rewards`
                });
            }
        }

        // Notify User: Status Update
        if (order.user) {
            await createNotification({
                userId: order.user.id,
                title: `Order Update: ${status}`,
                message: getStatusMessage(status, orderId),
                type: 'ORDER_STATUS',
                link: `/orders/${orderId}`
            });
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
        return { success: true, data: serialize(order) };
    } catch (error) {
        console.error('Update order status error:', error);
        return { success: false, error: 'Failed to update order status' };
    }
}

import { getShippingNotificationTemplate } from '@/lib/mail-templates';

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
        revalidatePath(`/admin/orders/${orderId}`);
        revalidatePath('/orders');

        // Trigger WhatsApp Update
        try {
            // Fetch order to get user details
            const order = await prismadb.order.findUnique({
                where: { id: orderId },
                include: { user: true, address: true }
            });
            if (order && (order.address?.phone || '919876543210')) {
                await WhatsappService.sendShippingUpdate(order.address?.phone || '919876543210', orderId, trackingNumber, courierName);
            }
        } catch (e) {
            console.error('WhatsApp Shipping Update Failed:', e);
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating order tracking:', error);
        return { success: false, error: 'Failed to update tracking' };
    }
}

export async function getRecentPublicOrders() {
    try {
        const orders = await prismadb.order.findMany({
            where: {
                status: { not: 'CANCELLED' },
                paymentStatus: 'PAID'
            },
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    take: 1,
                    include: {
                        variant: {
                            include: {
                                product: {
                                    include: {
                                        images: { take: 1 }
                                    }
                                }
                            }
                        }
                    }
                },
                address: true
            }
        });

        return {
            success: true,
            data: orders.map(order => ({
                id: order.id,
                city: order.address.city,
                productName: order.items[0]?.variant.product.name,
                productImage: order.items[0]?.variant.product.images[0]?.url,
                createdAt: order.createdAt
            }))
        };
    } catch (error) {
        console.error('Fetch public orders error:', error);
        return { success: false, error: 'Failed' };
    }
}

export async function getFulfillmentOrders() {
    try {
        const orders = await prismadb.order.findMany({
            where: {
                status: { in: ['PENDING', 'PROCESSING'] }
            },
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
            },
            orderBy: { createdAt: 'asc' } // Oldest first for fulfillment
        });

        return { success: true, data: serialize(orders) };
    } catch (error) {
        console.error('Fulfillment fetch error:', error);
        return { success: false, error: 'Failed to fetch fulfillment orders' };
    }
}

export async function bulkUpdateOrders(orderIds: string[], status: string) {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        // We use the existing updateOrderStatus to leverage its triggers (emails, loyalty, stock)
        const results = await Promise.all(
            orderIds.map(id => updateOrderStatus(id, status))
        );

        const allSuccess = results.every(r => r.success);

        revalidatePath('/admin/inventory/fulfillment');
        revalidatePath('/admin/orders');

        return {
            success: allSuccess,
            message: allSuccess ? 'All orders updated' : 'Some orders failed to update'
        };
    } catch (error) {
        console.error('Bulk update error:', error);
        return { success: false, error: 'Failed to perform bulk update' };
    }
}

export async function getAdvancedAnalytics() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const ninetyDaysAgo = subDays(new Date(), 90);

        const [orders, users, allProducts] = await Promise.all([
            prismadb.order.findMany({
                where: {
                    status: { not: 'CANCELLED' },
                    paymentStatus: 'PAID',
                    createdAt: { gte: ninetyDaysAgo }
                },
                include: {
                    items: {
                        include: {
                            variant: {
                                include: { product: true }
                            }
                        }
                    },
                    user: true
                }
            }),
            prismadb.user.findMany({
                where: { role: 'CUSTOMER' },
                include: {
                    orders: {
                        where: { paymentStatus: 'PAID' }
                    }
                }
            }),
            prismadb.product.findMany({
                include: {
                    variants: true
                }
            })
        ]);

        // 1. Sales Heatmap (Day vs Hour)
        const heatmapData = Array.from({ length: 7 }, (_, day) => ({
            day,
            hours: Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0, revenue: 0 }))
        }));

        orders.forEach(order => {
            const date = new Date(order.createdAt);
            const day = date.getDay();
            const hour = date.getHours();
            heatmapData[day].hours[hour].count += 1;
            heatmapData[day].hours[hour].revenue += Number(order.total);
        });

        // 2. Inventory Velocity (Sales per day / current stock)
        const productPerformance: Record<string, { name: string, sold: number, stock: number }> = {};

        allProducts.forEach(p => {
            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
            productPerformance[p.id] = { name: p.name, sold: 0, stock: totalStock };
        });

        orders.forEach(order => {
            order.items.forEach(item => {
                const productId = item.variant.product.id;
                if (productPerformance[productId]) {
                    productPerformance[productId].sold += item.quantity;
                }
            });
        });

        const velocityData = Object.values(productPerformance)
            .map(p => ({
                ...p,
                velocity: p.stock > 0 ? (p.sold / 90) / p.stock : p.sold > 0 ? 1 : 0
            }))
            .sort((a, b) => b.velocity - a.velocity)
            .slice(0, 10);

        // 3. VIP Patrons (CLV)
        const vipPatrons = users.map(user => {
            const u = user as any;
            const totalSpent = u.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);
            return {
                id: u.id,
                name: u.name || u.email,
                email: u.email,
                totalSpent,
                orderCount: u.orders.length,
                points: u.loyaltyPoints || 0
            };
        })
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);

        return {
            success: true,
            data: {
                heatmap: heatmapData,
                velocity: velocityData,
                vips: vipPatrons
            }
        };
    } catch (error) {
        console.error('Advanced analytics error:', error);
        return { success: false, error: 'Failed' };
    }
}

function getStatusMessage(status: string, orderId: string) {
    const id = orderId.slice(-6).toUpperCase();
    switch (status) {
        case 'PROCESSING': return `We are preparing your order #${id} for shipment.`;
        case 'SHIPPED': return `Order #${id} is on its way! Track it now.`;
        case 'DELIVERED': return `Order #${id} has been delivered. Enjoy!`;
        case 'CANCELLED': return `Order #${id} was cancelled.`;
        default: return `Order #${id} status updated to ${status}.`;
    }
}
