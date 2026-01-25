import type { Metadata } from 'next';
import CartClient from './cart-client';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
    title: 'Shopping Cart | Thulasi Textiles',
    description: 'Review your selected items and proceed to checkout',
};

export default async function CartPage() {
    const session = await getSession();

    // Optionally require authentication
    // if (!session) {
    //     redirect('/login?redirect=/cart');
    // }

    return <CartClient session={session} />;
}
