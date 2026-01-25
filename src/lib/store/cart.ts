import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: string; // Product variant ID
    productId: string;
    productName: string;
    productSlug: string;
    variantSku: string;
    size?: string;
    color?: string;
    material?: string;
    price: number;
    quantity: number;
    image: string;
    stock: number;
}

interface CartStore {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const items = get().items;
                const existingItem = items.find((i) => i.id === item.id);

                if (existingItem) {
                    // Update quantity if item already exists
                    set({
                        items: items.map((i) =>
                            i.id === item.id
                                ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock) }
                                : i
                        ),
                    });
                } else {
                    // Add new item
                    set({
                        items: [...items, { ...item, quantity: item.quantity || 1 }],
                    });
                }
            },

            removeItem: (variantId) => {
                set({
                    items: get().items.filter((item) => item.id !== variantId),
                });
            },

            updateQuantity: (variantId, quantity) => {
                if (quantity <= 0) {
                    get().removeItem(variantId);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === variantId
                            ? { ...item, quantity: Math.min(quantity, item.stock) }
                            : item
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
