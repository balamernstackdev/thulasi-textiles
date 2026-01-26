'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Star, CheckCircle2 } from 'lucide-react';
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
        <div className="group relative bg-white flex flex-col h-full bg-white transition-all duration-300">
            <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                {/* Image Container */}
                <div
                    className="relative aspect-square overflow-hidden bg-gray-50 rounded-xl mb-3"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                >
                    <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        className="object-cover transition-all duration-700 group-hover:scale-105 gpu"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        priority={priority}
                        onError={() => setBrokenImages(prev => [...prev, primaryImage])}
                    />

                    {/* Image Progress Dots (Only on Hover) */}
                    {images.length > 1 && (
                        <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
                            {images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIdx ? "w-4 bg-white shadow-sm" : "w-1 bg-white/40"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Quick Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                        {product.isBestSeller && (
                            <span className="bg-[#B12704] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">
                                #1 Best Seller
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col flex-1 px-1 sm:px-0">
                    <h3 className="text-[11px] md:text-sm font-medium text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-[#C45500] transition-colors">
                        {product.name}
                    </h3>

                    {/* Ratings */}
                    <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center gap-0.5 text-[#FFA41C]">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round((product as any).averageRating || 0) ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-[#007185] hover:text-[#C45500] ml-1">
                            {(product as any).reviewCount || 0}
                        </span>
                    </div>

                    {/* Deal Badge */}
                    {product.isOffer && (
                        <div className="mb-1">
                            <span className="bg-[#B12704] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-sm">
                                Limited time deal
                            </span>
                        </div>
                    )}

                    <div className="mt-auto space-y-0.5 md:space-y-1">
                        <div className="flex items-baseline flex-wrap gap-x-1.5 md:gap-x-2">
                            <span className="text-lg md:text-2xl font-black text-orange-600">-{discount}%</span>
                            <div className="flex items-baseline">
                                <span className="text-xs md:text-sm font-bold text-gray-900 mr-0.5">₹</span>
                                <span className="text-xl md:text-2xl font-black text-gray-900">{priceValue.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                            M.R.P.: <span className="line-through">₹{originalPrice.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1 pt-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-700">Thulasi Assured</span>
                        </div>

                        <p className="text-[12px] text-gray-900 mt-1">Get it by <span className="font-bold">Tomorrow, 10 PM</span></p>
                        <p className="text-[12px] text-gray-500">FREE Delivery by Thulasi</p>
                    </div>
                </div>
            </Link>

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
                className="mt-3 md:mt-4 bg-orange-600 hover:bg-orange-700 text-white py-2 md:py-2.5 rounded-full text-[9px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-orange-100 border-none"
            >
                Add to Cart
            </button>
        </div>
    );
}
