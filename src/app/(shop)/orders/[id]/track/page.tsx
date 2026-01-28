import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order';
import { getSession } from '@/lib/auth';
import OrderTrackingClient from './track-client';

export const dynamic = 'force-dynamic';

export default async function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        redirect(`/login?redirect=/orders/${id}/track`);
    }

    const { success, data: order } = await getOrderById(id);

    if (!success || !order) {
        notFound();
    }

    return <OrderTrackingClient order={order} />;
}
