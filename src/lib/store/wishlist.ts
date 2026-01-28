import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toggleWishlist as toggleWishlistAction } from '@/lib/actions/wishlist';

interface WishlistStore {
    wishlistIds: string[];
    setWishlist: (ids: string[]) => void;
    toggleWishlist: (productId: string) => Promise<{ success: boolean; action?: string; error?: string }>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlistIds: [],
            setWishlist: (ids) => set({ wishlistIds: ids }),
            toggleWishlist: async (productId) => {
                const result = await toggleWishlistAction(productId);

                if (result.success) {
                    const currentIds = get().wishlistIds;
                    if (result.action === 'added') {
                        set({ wishlistIds: [...currentIds, productId] });
                    } else if (result.action === 'removed') {
                        set({ wishlistIds: currentIds.filter(id => id !== productId) });
                    }
                }

                return result;
            },
            isInWishlist: (productId) => get().wishlistIds.includes(productId),
        }),
        {
            name: 'thulasi-wishlist',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
