import type { Metadata } from 'next';
import WishlistClient from './wishlist-client';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getWishlist } from '@/lib/actions/wishlist';

export const metadata: Metadata = {
    title: 'My Wishlist | Thulasi Textiles',
    description: 'Your curated collection of favorites',
};

export default async function WishlistPage() {
    const session = await getSession();

    if (!session) {
        redirect('/login?redirect=/wishlist');
    }

    const { data: wishlist } = await getWishlist();

    return <WishlistClient wishlist={wishlist || []} />;
}
