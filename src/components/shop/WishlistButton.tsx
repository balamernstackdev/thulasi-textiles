'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions/wishlist';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useWishlistStore } from '@/lib/store/wishlist';

export default function WishlistButton({ productId, initialState }: { productId: string; initialState: boolean }) {
    const { toggleWishlist: toggleInStore, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(productId);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleToggle = async () => {
        startTransition(async () => {
            const result = await toggleInStore(productId);
            if (!result.success) {
                if (result.error === 'Not authenticated') {
                    toast.error('Please login to save your wishlist');
                    router.push('/login');
                } else {
                    toast.error('Failed to update wishlist');
                }
            } else {
                if (result.action === 'added') {
                    toast.success('Added to your wishlist', {
                        description: 'Find it later in your profile.',
                        icon: <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    });
                } else {
                    toast('Removed from wishlist');
                }
                router.refresh();
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`w-full py-4 px-6 rounded-3xl border bg-white border-gray-300 hover:bg-gray-50 font-black text-[11px] uppercase grayscale text-gray-500 tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98] transition-all group whitespace-nowrap`}
        >
            <Heart className={`w-3.5 h-3.5 shrink-0 transition-colors ${isWishlisted ? 'fill-rose-600' : 'group-hover:fill-gray-900'}`} />
            {isWishlisted ? 'Saved to Wish List' : 'Add to Wish List'}
        </button>
    );
}
