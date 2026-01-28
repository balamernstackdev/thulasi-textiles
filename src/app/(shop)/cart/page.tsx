import type { Metadata } from 'next';
import CartClient from './cart-client';
import { getSession } from '@/lib/auth';
import { getWishlist } from '@/lib/actions/wishlist';

export const metadata: Metadata = {
    title: 'Shopping Cart | Thulasi Textiles',
    description: 'Review your selected items and proceed to checkout',
};

export default async function CartPage() {
    const session = await getSession();
    let wishlistItems = [];

    if (session) {
        const result = await getWishlist();
        if (result.success) {
            wishlistItems = result.data;
        }
    }

    return <CartClient session={session} initialWishlist={wishlistItems} />;
}
