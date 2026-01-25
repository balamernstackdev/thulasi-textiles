import type { Metadata } from 'next';
import CheckoutClient from './checkout-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserAddresses } from '@/lib/actions/address';

export const metadata: Metadata = {
    title: 'Checkout | Thulasi Textiles',
    description: 'Complete your purchase',
};

export default async function CheckoutPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/checkout');
    }

    const { data: addresses } = await getUserAddresses();

    return <CheckoutClient session={session} addresses={addresses || []} />;
}
