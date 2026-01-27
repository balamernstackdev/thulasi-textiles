'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, CheckCircle2, Heart, Eye, Zap, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/cart';
import { Product, ProductImage, Category } from '@prisma/client';

interface ProductWithData extends Product {
    images: ProductImage[];
    category: Category;
}

export default function ProductCard({ product, session, priority = false }: { product: ProductWithData, session?: any, priority?: boolean }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const [brokenImages, setBrokenImages] = useState<string[]>([]);
    const [isWishlisted, setIsWishlisted] = useState(false);

    const rawImages = (product.images && product.images.length > 0) ? product.images : [{ url: '/placeholder-product.png' }];
    const images = rawImages.filter((img: any) => img.url && !brokenImages.includes(img.url));
    const primaryImage = images[currentIdx]?.url || '/placeholder-product.png';
    const addItem = useCartStore((state) => state.addItem);

    const priceValue = Number(product.basePrice);
    const originalPrice = priceValue * 1.5;
    const discount = 33; // Fixed for demo

    useEffect(() => {
        if (!isHovering || images.length <= 1) {
            setCurrentIdx(0);
            return;
        }

        const interval = setInterval(() => {
            setCurrentIdx((prev) => (prev + 1) % images.length);
        }, 1500);

        return () => clearInterval(interval);
    }, [isHovering, images.length]);

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
            {/* Decorative Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/0 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                {/* Image Container */}
                <div
                    className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        priority={priority}
                        onError={() => setBrokenImages(prev => [...prev, primaryImage])}
                    />

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Image Progress Dots */}
                    {images.length > 1 && (
                        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 transition-all duration-300 ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                            {images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 shadow-lg ${idx === currentIdx ? "w-6 bg-white" : "w-1.5 bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {product.isBestSeller && (
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                <TrendingUp className="w-3 h-3" />
                                <span>BEST SELLER</span>
                            </div>
                        )}
                        {product.isNew && (
                            <div className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
                                <Zap className="w-3 h-3" />
                                <span>NEW</span>
                            </div>
                        )}
                    </div>

                    {/* Discount Badge */}
                    {product.isOffer && (
                        <div className="absolute top-3 right-3 z-10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-orange-600 rounded-full blur-md opacity-60" />
                                <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-xl">
                                    <div className="text-center">
                                        <div className="text-lg font-black leading-none">-{discount}%</div>
                                        <div className="text-[7px] font-bold uppercase">OFF</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions - Show on Hover */}
                    <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${isHovering ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'} ${product.isOffer ? 'top-20' : ''}`}>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsWishlisted(!isWishlisted);
                                toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
                            }}
                            className={`p-2.5 rounded-full backdrop-blur-md transition-all shadow-lg hover:scale-110 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toast.info('Quick view coming soon!');
                            }}
                            className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-gray-700 hover:bg-orange-500 hover:text-white transition-all shadow-lg hover:scale-110"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 p-4 space-y-3">
                    {/* Category Tag */}
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-wider bg-orange-50 px-2 py-1 rounded-md">
                            {product.category?.name || 'Product'}
                        </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors min-h-[2.5rem]">
                        {product.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round((product as any).averageRating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-gray-600">
                            ({(product as any).reviewCount || 127})
                        </span>
                    </div>

                    {/* Price Section */}
                    <div className="mt-auto space-y-2">
                        <div className="flex items-baseline gap-2">
                            <div className="flex items-baseline">
                                <span className="text-2xl font-black text-gray-900">₹{priceValue.toLocaleString()}</span>
                            </div>
                            <span className="text-sm text-gray-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="font-bold">In Stock</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <span className="font-semibold text-gray-600">Free Shipping</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Add to Cart Button - Always Visible */}
            <div className="p-4 pt-0">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        if (!session) {
                            toast.error('Please login to add items to cart');
                            window.location.href = '/login';
                            return;
                        }

                        addItem({
                            id: product.id,
                            productId: product.id,
                            productName: product.name,
                            productSlug: product.slug,
                            variantSku: 'N/A',
                            price: priceValue,
                            image: primaryImage,
                            stock: 10,
                        });
                        toast.success(`${product.name} added to cart`);
                    }}
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2 group/btn"
                >
                    <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    <span>Add to Cart</span>
                </button>
            </div>
        </div>
    );
}
