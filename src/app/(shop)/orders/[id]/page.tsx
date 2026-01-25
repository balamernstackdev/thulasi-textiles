import type { Metadata } from 'next';
import OrderDetailClient from './order-detail-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order';

export const metadata: Metadata = {
    title: 'Order Details | Thulasi Textiles',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/orders');
    }

    const { data: order } = await getOrderById(id);

    if (!order) {
        redirect('/orders');
    }

    return <OrderDetailClient order={order} />;
}
