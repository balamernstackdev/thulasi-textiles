'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/cart';
import { useUIStore } from '@/lib/store/ui';
import { Product, ProductImage, Category } from '@prisma/client';

interface ProductWithData extends Product {
    images: ProductImage[];
    category: Category;
}

export default function ProductCard({ product, session, priority = false }: { product: ProductWithData, session?: any, priority?: boolean }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [imgError, setImgError] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Filter out invalid images if needed (though Prisma types usually ensure URL)
    const validImages = product.images?.filter((img) => img.url) || [];
    const hasImages = validImages.length > 0;

    // Use proper placeholder logic
    const displayImage = (!hasImages || imgError)
        ? 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80' // Generic minimal placeholder
        : validImages[currentIdx]?.url;

    const addItem = useCartStore((state) => state.addItem);
    const { openQuickView } = useUIStore();

    const priceValue = Number(product.basePrice);
    const originalPrice = priceValue * 1.5;
    const discount = Math.round(((originalPrice - priceValue) / originalPrice) * 100);

    // Auto-cycle images on hover
    useEffect(() => {
        if (!isHovering || validImages.length <= 1) {
            setCurrentIdx(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % validImages.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isHovering, validImages.length]);

    return (
        <div className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
            <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                {/* Image Container with Aspect Ratio */}
                <div
                    className="relative aspect-[4/5] overflow-hidden bg-gray-100"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={displayImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        priority={priority}
                        onError={() => setImgError(true)}
                    />

                    {/* Gradient Overlay for Text Readability if needed, mostly for aesthetics here */}
                    <div className={`absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                    {/* Image Navigation Dots */}
                    {validImages.length > 1 && isHovering && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 p-1 bg-black/10 backdrop-blur-sm rounded-full">
                            {validImages.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIdx ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
                        {product.isBestSeller && (
                            <span className="bg-orange-600 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm tracking-wider">
                                Best Seller
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-emerald-500 text-white text-[10px] uppercase font-bold px-2.5 py-1 rounded shadow-sm tracking-wider">
                                New
                            </span>
                        )}
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                            -{discount}%
                        </div>
                    )}

                    {/* Quick Access Buttons */}
                    <div className={`absolute bottom-3 right-3 flex flex-col gap-2 transition-all duration-300 z-20 translate-x-12 group-hover:translate-x-0`}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsWishlisted(!isWishlisted);
                                toast.success(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
                            }}
                            className={`p-2.5 rounded-full shadow-lg transition-colors duration-200 ${isWishlisted
                                ? 'bg-red-500 text-white border-red-500'
                                : 'bg-white text-gray-700 hover:bg-red-50 hover:text-red-500 border border-transparent'
                                }`}
                            title="Add to Wishlist"
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                openQuickView(product);
                            }}
                            className="p-2.5 bg-white text-gray-700 rounded-full shadow-lg hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 border border-transparent"
                            title="Quick View"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col flex-1 p-2.5 md:p-4 space-y-1.5 md:space-y-2">
                    <span className="text-[9px] md:text-[10px] font-bold text-orange-600 uppercase tracking-widest truncate">
                        {product.category?.name || 'Collection'}
                    </span>

                    <h3 className="text-xs md:text-sm font-semibold text-gray-900 leading-snug line-clamp-2 h-8 md:h-10 group-hover:text-orange-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1.5">
                        <div className="flex items-center text-yellow-400">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                            ))}
                        </div>
                        <span className="text-[9px] md:text-[10px] font-medium text-gray-400 number-font">(127)</span>
                    </div>

                    <div className="mt-auto pt-2 flex items-baseline gap-2 border-t border-gray-50">
                        <span className="text-sm md:text-lg font-bold text-gray-900">₹{priceValue.toLocaleString()}</span>
                        {originalPrice > priceValue && (
                            <span className="text-[10px] md:text-xs text-gray-400 line-through decoration-gray-300">₹{originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Action Footer */}
            <div className="px-2.5 pb-2.5 md:px-4 md:pb-4">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!session) {
                            toast.error('Please login to shop');
                            return;
                        }
                        addItem({
                            id: product.id,
                            productId: product.id,
                            productName: product.name,
                            productSlug: product.slug,
                            variantSku: 'default',
                            price: priceValue,
                            image: displayImage,
                            stock: 10,
                        });
                        toast.success('Added to cart');
                    }}
                    className="w-full bg-gray-900 hover:bg-black text-white py-2 md:py-2.5 rounded-lg text-[10px] md:text-xs uppercase font-bold tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 md:gap-2 group-hover:shadow-lg hover:-translate-y-0.5"
                >
                    <ShoppingCart className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
