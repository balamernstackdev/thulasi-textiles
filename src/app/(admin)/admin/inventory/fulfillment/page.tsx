import type { Metadata } from 'next';
import FulfillmentClient from './fulfillment-client';
import { getFulfillmentOrders } from '@/lib/actions/order';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Fulfillment Hub | Thulasi Admin',
    description: 'Manage bulk shipments and packing slips',
};

export default async function FulfillmentPage() {
    const session = await getSession();
    if (!session || session.user.role !== 'ADMIN') {
        redirect('/login');
    }

    const result = await getFulfillmentOrders();
    const orders = result.success ? result.data : [];

    return <FulfillmentClient initialOrders={orders} />;
}
