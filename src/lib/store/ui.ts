import { create } from 'zustand';
import { Product } from '@prisma/client';

interface UIState {
    isQuickViewOpen: boolean;
    quickViewProduct: any | null; // using any to accommodate included relations like images/variants
    openQuickView: (product: any) => void;
    closeQuickView: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isQuickViewOpen: false,
    quickViewProduct: null,
    openQuickView: (product) => set({ isQuickViewOpen: true, quickViewProduct: product }),
    closeQuickView: () => set({ isQuickViewOpen: false, quickViewProduct: null }),
}));
