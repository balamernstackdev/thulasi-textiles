import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toggleWishlist as toggleWishlistAction } from '@/lib/actions/wishlist';

interface WishlistStore {
    wishlistIds: string[];
    isHydrated: boolean;
    isSynced: boolean;
    setWishlist: (ids: string[]) => void;
    setHydrated: () => void;
    toggleWishlist: (productId: string) => Promise<{ success: boolean; action?: string; error?: string }>;
    isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
    persist(
        (set, get) => ({
            wishlistIds: [],
            isHydrated: false,
            isSynced: false,
            setWishlist: (ids) => set({ wishlistIds: ids, isSynced: true }),
            setHydrated: () => set({ isHydrated: true }),
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
            onRehydrateStorage: () => (state) => {
                state?.setHydrated();
            },
        }
    )
);
