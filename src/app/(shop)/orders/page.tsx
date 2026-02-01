import type { Metadata } from 'next';
import OrdersClient from './orders-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/lib/actions/order';

export const metadata: Metadata = {
    title: 'My Orders | Thulasi Textiles',
    description: 'Track and manage your orders',
};

export default async function OrdersPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/orders');
    }

    const { data: orders } = await getUserOrders();

    return <OrdersClient orders={(orders as any) || []} />;
}
