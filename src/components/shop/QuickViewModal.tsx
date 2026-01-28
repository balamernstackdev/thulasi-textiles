'use client';

import { useUIStore } from '@/lib/store/ui';
import { X, Star, CheckCircle2, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';
import Link from 'next/link';

export default function QuickViewModal() {
    const { isQuickViewOpen, quickViewProduct, closeQuickView } = useUIStore();
    const addItem = useCartStore((state) => state.addItem);

    // Local state for interaction
    const [selectedVariant, setSelectedVariant] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState('');

    useEffect(() => {
        if (quickViewProduct) {
            // Reset state when product changes
            const initialVariant = quickViewProduct.variants?.find((v: any) => v.stock > 0) || quickViewProduct.variants?.[0] || null;
            setSelectedVariant(initialVariant);
            setQuantity(1);

            setQuantity(1);

            // Reset image state so fallback logic works on re-open
            setActiveImage('');
        }
    }, [quickViewProduct]);

    if (!isQuickViewOpen || !quickViewProduct) return null;

    const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(quickViewProduct.basePrice);
    const originalPrice = Math.round(currentPrice * 1.5);
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        addItem({
            id: selectedVariant?.id || quickViewProduct.id,
            productId: quickViewProduct.id,
            productName: quickViewProduct.name,
            productSlug: quickViewProduct.slug,
            variantSku: selectedVariant?.sku || 'N/A',
            price: currentPrice,
            image: activeImage,
            stock: selectedVariant?.stock || 10,
            size: selectedVariant?.size,
            quantity: quantity,
        });
        toast.success('Added to cart');
        closeQuickView();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={closeQuickView}
            />

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-5xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <button
                    onClick={closeQuickView}
                    className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-900" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 h-[85vh] md:h-auto overflow-y-auto md:overflow-visible">
                    {/* Image Column */}
                    <div className="relative bg-gray-100 aspect-square md:aspect-auto md:h-[600px] flex items-center justify-center">
                        <Image
                            src={activeImage || quickViewProduct.images?.[0]?.url || 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80'}
                            alt={quickViewProduct.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80';
                            }}
                        />

                        {/* Thumbnails */}
                        {quickViewProduct.images && quickViewProduct.images.length > 1 && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1 bg-white/20 backdrop-blur-md rounded-xl">
                                {quickViewProduct.images.map((img: any, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(img.url)}
                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${(activeImage === img.url || (!activeImage && idx === 0))
                                            ? 'border-orange-600 shadow-lg scale-110'
                                            : 'border-transparent opacity-80 hover:opacity-100 hover:scale-105'
                                            }`}
                                    >
                                        <Image
                                            src={img.url}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none'; // Hide broken thumbnails
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Details Column */}
                    <div className="p-8 md:p-12 flex flex-col h-full">
                        <div className="flex-1 space-y-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-orange-600 text-[10px] font-black uppercase tracking-[0.2em]">
                                        {quickViewProduct.category?.name || 'Heritage'}
                                    </span>
                                    {quickViewProduct.isBestSeller && (
                                        <span className="bg-gradient-to-r from-orange-600 to-red-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                            Best Seller
                                        </span>
                                    )}
                                </div>

                                <h2 className="text-3xl md:text-4xl font-serif font-medium text-gray-900 mb-4 leading-tight">
                                    {quickViewProduct.name}
                                </h2>

                                <div className="flex items-center gap-6 mb-6">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-gray-900">₹{currentPrice.toLocaleString()}</span>
                                        <span className="text-sm text-gray-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                                        <span className="text-sm font-bold text-gray-900">4.8</span>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {quickViewProduct.description}
                                </p>
                            </div>

                            {/* Variants */}
                            {quickViewProduct.variants?.length > 0 && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Size</span>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map(size => {
                                            const variant = quickViewProduct.variants.find((v: any) => v.size === size);
                                            const isAvailable = variant && variant.stock > 0;
                                            const isSelected = selectedVariant?.size === size;

                                            return (
                                                <button
                                                    key={size}
                                                    disabled={!isAvailable}
                                                    onClick={() => variant && setSelectedVariant(variant)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected
                                                        ? 'bg-gray-900 text-white shadow-lg scale-110'
                                                        : isAvailable
                                                            ? 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900'
                                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-transparent'
                                                        }`}
                                                >
                                                    {size}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="space-y-4 pt-6">
                                <div className="flex items-center gap-4">
                                    {/* Quantity */}
                                    <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900"
                                        >
                                            -
                                        </button>
                                        <span className="text-base font-black w-6 text-center text-gray-900">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock}
                                        className={`flex-1 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-orange-500/25 active:scale-[0.98] ${isOutOfStock
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-b from-gray-900 to-black text-white hover:from-black hover:to-black'
                                            }`}
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        <span>Add to Cart</span>
                                    </button>
                                </div>

                                <Link
                                    href={`/product/${quickViewProduct.slug}`}
                                    onClick={closeQuickView}
                                    className="block w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-orange-600 transition-colors"
                                >
                                    View Full Details
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
