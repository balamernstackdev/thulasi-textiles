import type { Metadata } from 'next';
import ProfileClient from './profile-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserOrders } from '@/lib/actions/order';
import { getUserAddresses } from '@/lib/actions/address';
import { getWishlist } from '@/lib/actions/wishlist';
import { getLoyaltyData } from '@/lib/actions/loyalty';

export const metadata: Metadata = {
    title: 'My Profile | Thulasi Textiles',
    description: 'Manage your account settings',
};

export default async function ProfilePage() {
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/profile');
    }

    // Fetch all required data for the dashboard
    const [ordersResult, addressesResult, wishlistResult, loyaltyResult] = await Promise.all([
        getUserOrders(),
        getUserAddresses(),
        getWishlist(),
        getLoyaltyData()
    ]);

    return (
        <ProfileClient
            session={session}
            initialOrders={ordersResult.data || []}
            initialAddresses={addressesResult.data || []}
            initialWishlist={wishlistResult.data || []}
            initialLoyaltyData={loyaltyResult.data || { points: 0, history: [] }}
        />
    );
}
