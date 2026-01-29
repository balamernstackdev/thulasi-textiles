'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';

interface StickyAddToCartProps {
    product: any;
    selectedVariant: any;
}

export default function StickyAddToCart({ product, selectedVariant }: StickyAddToCartProps) {
    const [isVisible, setIsVisible] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 600px (approx height of main image + title)
            if (window.scrollY > 600) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAddToCart = () => {
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
            quantity: 1,
        });
        // Optional: open cart drawer or show toast
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] z-50 lg:hidden animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <p className="text-xs font-black text-gray-900 uppercase truncate">{product.name}</p>
                    <p className="text-sm font-bold text-orange-600">
                        ₹{selectedVariant ? Number(selectedVariant.price).toLocaleString() : Number(product.basePrice).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="bg-black text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg"
                >
                    <ShoppingBag className="w-4 h-4" />
                    Add
                </button>
            </div>
        </div>
    );
}
