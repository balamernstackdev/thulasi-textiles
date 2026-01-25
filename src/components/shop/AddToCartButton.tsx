'use client';

import { useCartStore } from '@/lib/store/cart';
import { ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    product: any;
}

export default function AddToCartButton({ product, selectedVariant, quantity = 1 }: { product: any; selectedVariant?: any; quantity?: number }) {
    const addItem = useCartStore((state) => state.addItem);

    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.variants.every((v: any) => v.stock <= 0);

    const handleAddToCart = () => {
        if (isOutOfStock) {
            toast.error('This variant is currently out of stock');
            return;
        }

        addItem({
            id: selectedVariant?.id || product.id,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            variantSku: selectedVariant?.sku || 'N/A',
            price: selectedVariant ? Number(selectedVariant.price) : Number(product.basePrice),
            image: product.images[0]?.url || '/placeholder-product.png',
            stock: selectedVariant?.stock || 10,
            size: selectedVariant?.size,
            quantity: quantity,
        });

        toast.success(`${product.name}${selectedVariant ? ` (${selectedVariant.size})` : ''} added to cart!`, {
            description: `${quantity} item${quantity > 1 ? 's' : ''} added to your selection.`,
            action: {
                label: 'View Cart',
                onClick: () => window.location.href = '/cart'
            },
        });
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-4 rounded-3xl font-black text-sm md:text-[12px] uppercase tracking-[0.25em] flex items-center justify-center gap-4 active:scale-[0.98] transition-all shadow-xl shadow-gray-200 group ${isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-200'
                }`}
        >
            <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
    );
}
