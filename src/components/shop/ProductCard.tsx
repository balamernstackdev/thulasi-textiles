'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Icon from '@/components/ui/Icon';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/cart';
import { useUIStore } from '@/lib/store/ui';
import Price from '@/components/store/Price';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefetch } from '@/lib/hooks/usePrefetch';

const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        slug: string;
        description?: string;
        basePrice: number;
        images: { url: string; isPrimary: boolean }[];
        category?: { name: string; slug: string };
        variants: { id: string; price: number; stock: number; size?: string; color?: string; sku?: string }[];
        isNew?: boolean;
        isBestSeller?: boolean;
        isFeatured?: boolean;
    };
    session?: any;
    priority?: boolean;
}

export default function ProductCard({ product, session, priority = false }: ProductCardProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imgError, setImgError] = useState(false);
    const [isFlying, setIsFlying] = useState(false);
    const imageRef = useRef<HTMLDivElement>(null);
    const addItem = useCartStore((state) => state.addItem);
    const openQuickView = useUIStore((state) => state.openQuickView);
    const { onMouseEnter: prefetchEnter, onMouseLeave: prefetchLeave } = usePrefetch();

    const productUrl = `/product/${product.slug}`;

    const validImages = product.images?.length > 0 ? product.images : [{ url: '/placeholder-product.png', isPrimary: true }];
    const primaryImage = validImages.find(img => img.isPrimary) || validImages[0];

    const priceValue = product.variants?.[0]?.price || product.basePrice;
    const originalPrice = product.variants?.[0]?.price ? product.variants[0].price * 1.5 : product.basePrice * 1.5; // Mocking for demo
    const discount = Math.round(((originalPrice - priceValue) / originalPrice) * 100);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isHovering && validImages.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % Math.min(validImages.length, 3));
            }, 1500);
        } else {
            setCurrentImageIndex(0);
        }
        return () => clearInterval(interval);
    }, [isHovering, validImages.length]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (product.variants.length > 1) {
            window.location.href = `/product/${product.slug}`;
            return;
        }

        const variant = product.variants[0];
        if (!variant || variant.stock === 0) {
            toast.error("Product out of stock");
            return;
        }

        // Trigger Flying Animation
        setIsFlying(true);
        setTimeout(() => setIsFlying(false), 800);

        addItem({
            id: variant.id,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            variantSku: variant.sku || 'default',
            price: priceValue,
            image: primaryImage.url,
            quantity: 1,
            size: variant.size,
            color: variant.color,
            stock: variant.stock
        });

        toast.success("Added to cart", {
            duration: 2000,
            style: { border: 'none', background: '#000', color: '#fff' }
        });
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(product);
    };

    return (
        <div
            className="group relative flex flex-col h-full bg-white rounded-3xl overflow-visible hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500"
            onMouseEnter={() => {
                setIsHovering(true);
                prefetchEnter(productUrl);
            }}
            onMouseLeave={() => {
                setIsHovering(false);
                prefetchLeave();
            }}
        >
            <AnimatePresence>
                {isFlying && (
                    <motion.div
                        initial={{
                            position: 'fixed',
                            top: imageRef.current?.getBoundingClientRect().top || 0,
                            left: imageRef.current?.getBoundingClientRect().left || 0,
                            width: imageRef.current?.offsetWidth || 100,
                            height: imageRef.current?.offsetHeight || 100,
                            opacity: 0.8,
                            zIndex: 9999,
                            borderRadius: '24px',
                            overflow: 'hidden'
                        }}
                        animate={{
                            top: document.getElementById('cart-icon-desktop')?.getBoundingClientRect().top || 20,
                            left: document.getElementById('cart-icon-desktop')?.getBoundingClientRect().left || window.innerWidth - 100,
                            width: 20,
                            height: 20,
                            opacity: 0,
                            scale: 0.2,
                        }}
                        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                    >
                        <Image
                            src={primaryImage.url}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <Link href={`/product/${product.slug}`} className="flex flex-col flex-1">
                {/* Image Container */}
                <div ref={imageRef} className="relative aspect-[10/13] overflow-hidden bg-gray-100 rounded-t-3xl">
                    <Image
                        src={imgError ? '/placeholder-product.png' : validImages[currentImageIndex].url}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                        priority={priority}
                        placeholder="blur"
                        blurDataURL={BLUR_DATA_URL}
                        onError={() => setImgError(true)}
                    />

                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 items-start">
                        {product.isBestSeller && (
                            <span className="bg-orange-600 text-white text-[9px] md:text-[10px] uppercase font-black px-2.5 py-1.5 rounded-full shadow-lg tracking-[0.1em]">
                                Best Seller
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-[#10B981] text-white text-[9px] md:text-[10px] uppercase font-black px-2.5 py-1 rounded-md shadow-lg tracking-[0.1em]">
                                New
                            </span>
                        )}
                        {(() => {
                            const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                            if (totalStock > 0 && totalStock <= 5) {
                                return (
                                    <span className="bg-rose-600 text-white text-[9px] md:text-[10px] uppercase font-black px-2.5 py-1.5 rounded-full shadow-lg tracking-[0.1em] animate-pulse">
                                        Only {totalStock} Left
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 right-3 bg-[#EF4444] text-white text-[10px] md:text-xs font-black px-2.5 py-1.5 rounded-full shadow-lg tracking-wider">
                            -{discount}%
                        </div>
                    )}

                    {/* Quick View Button - Hidden on Mobile */}
                    <div className={`hidden md:block absolute bottom-4 left-4 right-4 z-10 transition-all duration-500 transform ${isHovering ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <button
                            onClick={handleQuickView}
                            className="w-full bg-white/95 backdrop-blur-sm text-gray-900 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-orange-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                            <Icon name="eye" className="w-4 h-4" /> Quick View
                        </button>
                    </div>
                </div>

                {/* Content Details */}
                <div className="flex flex-col flex-1 p-3 md:p-5 space-y-1 md:space-y-2">
                    <span className="text-[9px] md:text-xs font-bold uppercase tracking-wider text-orange-600 block">
                        {product.category?.name || 'Handloom'}
                    </span>
                    <h3 className="text-sm md:text-base font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-1">
                        <div className="flex items-center text-amber-500">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Icon key={s} name="star" className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                            ))}
                        </div>
                        <span className="text-[9px] md:text-[11px] font-bold text-gray-400 number-font ml-0.5">(127)</span>
                    </div>

                    <div className="mt-auto pt-2 flex items-baseline gap-2 border-t border-gray-50">
                        <span className="text-base md:text-xl font-bold text-gray-900">
                            <Price amount={priceValue} />
                        </span>
                        {originalPrice > priceValue && (
                            <span className="text-[10px] md:text-sm text-gray-400 line-through decoration-gray-300">
                                <Price amount={originalPrice} />
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            <div className="px-3 pb-1 md:px-5 md:pb-5">
                <button
                    onClick={handleAddToCart}
                    className="w-full bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 md:py-4 rounded-xl text-[8px] xs:text-[9px] md:text-xs uppercase font-extrabold tracking-wide transition-all shadow-xl shadow-gray-200/50 flex items-center justify-center gap-1 md:gap-2 group/btn relative overflow-hidden active:scale-95 px-1 md:px-2"
                >
                    {product.variants.length > 1 ? (
                        <>
                            <Icon name="eye" className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span className="truncate">SELECT OPTIONS</span>
                        </>
                    ) : (
                        (() => {
                            const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0;
                            if (totalStock === 0) return <span className="truncate">OUT OF STOCK</span>;
                            return (
                                <>
                                    <Icon name="shopping-bag" className="w-3 h-3 md:w-3.5 md:h-3.5" />
                                    <span className="truncate">ADD TO CART</span>
                                </>
                            );
                        })()
                    )}
                </button>
            </div>
        </div>
    );
}
