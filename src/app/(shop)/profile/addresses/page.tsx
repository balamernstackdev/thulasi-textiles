import type { Metadata } from 'next';
import AddressesClient from '@/app/(shop)/profile/addresses/addresses-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserAddresses } from '@/lib/actions/address';

export const metadata: Metadata = {
    title: 'My Addresses | Thulasi Textiles',
    description: 'Manage your shipping addresses',
};

export default async function AddressesPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/profile/addresses');
    }

    const { data: addresses } = await getUserAddresses();

    return <AddressesClient addresses={addresses || []} />;
}
