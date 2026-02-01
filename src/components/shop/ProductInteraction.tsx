'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Share2, Ruler, Minus, Plus, RefreshCw, AlertCircle, Info, CheckCircle2, ArrowRight
} from 'lucide-react';
import Icon from '@/components/ui/Icon';
import Image from 'next/image';
import { toggleWishlist as toggleWishlistAction } from '@/lib/actions/wishlist';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

const SizeAssistant = dynamic(() => import('@/components/shop/SizeAssistant'), { ssr: false });

interface Variant {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: string;
    stock: number;
}

export default function ProductInteraction({ product, isWishlisted: initialWishlisted, session }: { product: any; isWishlisted: boolean; session?: any }) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants.find((v: Variant) => v.stock > 0) || product.variants[0] || null
    );
    const [quantity, setQuantity] = useState(1);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [brokenImages, setBrokenImages] = useState<string[]>([]);
    const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
    const [isWishlisting, setIsWishlisting] = useState(false);
    const [isSizeAssistantOpen, setIsSizeAssistantOpen] = useState(false);

    // Magnifier state
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [magnifierCursor, setMagnifierCursor] = useState({ x: 0, y: 0 });

    // Track View Logic
    useEffect(() => {
        const trackView = () => {
            if (!product) return;

            const executeTracking = () => {
                const viewedProduct = {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    image: product.images[0]?.url || '',
                    price: Number(product.basePrice),
                    timestamp: Date.now()
                };

                const stored = localStorage.getItem('thulasi_recently_viewed');
                let list = stored ? JSON.parse(stored) : [];

                list = list.filter((p: any) => p.id !== product.id);
                list.unshift(viewedProduct);
                list = list.slice(0, 20);

                localStorage.setItem('thulasi_recently_viewed', JSON.stringify(list));
            };

            if ('requestIdleCallback' in window) {
                (window as any).requestIdleCallback(() => executeTracking());
            } else {
                setTimeout(executeTracking, 100);
            }
        };

        trackView();
    }, [product]);

    const currentPrice = Math.round(selectedVariant ? Number(selectedVariant.price) : Number(product.basePrice));
    const originalPrice = Math.round(currentPrice * 1.5);
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.variants.every((v: any) => v.stock <= 0);

    const rawImages = (product.images && product.images.length > 0) ? product.images : [{ url: '/placeholder-product.png', id: 'placeholder' }];
    const images = rawImages.filter((img: any) => img.url && !brokenImages.includes(img.url));
    const activeImage = images[currentIdx]?.url || '/placeholder-product.png';

    const nextImage = useCallback(() => {
        setCurrentIdx((prev) => (prev + 1) % images.length);
    }, [images.length]);

    const handleBuyNow = () => {
        if (isOutOfStock) return;

        addItem({
            id: selectedVariant?.id || product.id,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            variantSku: selectedVariant?.sku || 'N/A',
            price: currentPrice,
            image: product.images[0]?.url || '/placeholder-product.png',
            stock: selectedVariant?.stock || 10,
            size: selectedVariant?.size,
            quantity: quantity,
        });

        router.push('/checkout');
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        addItem({
            id: selectedVariant?.id || product.id,
            productId: product.id,
            productName: product.name,
            productSlug: product.slug,
            variantSku: selectedVariant?.sku || 'N/A',
            price: currentPrice,
            image: product.images[0]?.url || '/placeholder-product.png',
            stock: selectedVariant?.stock || 10,
            size: selectedVariant?.size,
            quantity: quantity,
        });

        toast.success('Added to cart!');
    };

    const toggleWishlist = async () => {
        if (!session) {
            router.push('/login?redirect=/product/' + product.slug);
            return;
        }

        setIsWishlisting(true);
        try {
            const res = await toggleWishlistAction(product.id);
            if (res.success) {
                setIsWishlisted(res.action === 'added');
                toast.success(res.action === 'added' ? 'Added to wishlist' : 'Removed from wishlist');
            } else {
                toast.error(res.error || 'Failed to update wishlist');
            }
        } catch (error) {
            toast.error('Failed to update wishlist');
        } finally {
            setIsWishlisting(false);
        }
    };

    const preloadImage = useCallback((url: string) => {
        if (!url) return;
        const img = new (window as any).Image();
        img.src = url;
    }, []);

    const handleMouseEnterNav = (direction: 'next' | 'prev') => {
        if (images.length <= 1) return;
        const targetIdx = direction === 'next'
            ? (currentIdx + 1) % images.length
            : (currentIdx - 1 + images.length) % images.length;
        const targetUrl = images[targetIdx]?.url;
        if (targetUrl) preloadImage(targetUrl);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left - window.scrollX) / width) * 100;
        const y = ((e.pageY - top - window.scrollY) / height) * 100;
        setMagnifierPosition({ x, y });
        setMagnifierCursor({ x: e.pageX - left - window.scrollX, y: e.pageY - top - window.scrollY });
    };

    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-6">
                <div
                    className="relative aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden group shadow-2xl shadow-gray-200 cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => setShowMagnifier(true)}
                    onMouseLeave={() => setShowMagnifier(false)}
                >
                    <Image
                        src={activeImage}
                        alt={product.name}
                        fill
                        className={`object-cover transition-transform duration-1000 ${showMagnifier ? 'scale-105 opacity-40' : 'scale-110'}`}
                        priority
                    />

                    {/* Magnifier Overlay */}
                    <AnimatePresence>
                        {showMagnifier && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="absolute pointer-events-none border-4 border-white shadow-2xl rounded-full overflow-hidden z-20"
                                style={{
                                    width: '180px',
                                    height: '180px',
                                    left: `${magnifierCursor.x - 90}px`,
                                    top: `${magnifierCursor.y - 90}px`,
                                    backgroundImage: `url(${activeImage})`,
                                    backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
                                    backgroundSize: '800%', // 8x zoom
                                    backgroundRepeat: 'no-repeat'
                                }}
                            />
                        )}
                    </AnimatePresence>

                    {/* Zoom Indicator */}
                    <div className="absolute top-8 right-8 bg-black/20 backdrop-blur-md p-3 rounded-2xl text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <Icon name="zoom-in" className="w-5 h-5" />
                    </div>

                    {images.length > 1 && (
                        <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setCurrentIdx((prev) => (prev - 1 + images.length) % images.length)}
                                onMouseEnter={() => handleMouseEnterNav('prev')}
                                className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-colors"
                            >
                                <Icon name="chevron-left" className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                onMouseEnter={() => handleMouseEnterNav('next')}
                                className="w-12 h-12 bg-white/90 backdrop-blur rounded-2xl flex items-center justify-center text-gray-900 shadow-xl hover:bg-white transition-colors"
                            >
                                <Icon name="chevron-right" className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                {images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                        {images.map((img: any, idx: number) => (
                            <button
                                key={img.id}
                                onClick={() => setCurrentIdx(idx)}
                                className={`relative w-24 aspect-[4/5] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 snap-start flex-shrink-0 ${currentIdx === idx ? 'ring-4 ring-orange-600 scale-95' : 'hover:scale-105'
                                    }`}
                            >
                                <Image src={img.url} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-8">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            {product.category?.name || 'Heritage'}
                        </span>
                        {product.isOffer && (
                            <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                Exclusive Offer
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.9]">
                        {product.name}
                    </h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="space-y-1">
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none">Starting from</p>
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-black text-gray-900 tracking-tighter truncate">₹{currentPrice.toLocaleString()}</span>
                            <span className="text-lg font-bold text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="h-10 w-px bg-gray-100" />
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100">
                        <p className="text-[10px] font-black uppercase tracking-widest">Limited Availability</p>
                        <p className="text-xs font-bold">{isOutOfStock ? 'Sold Out' : 'Ready to Ship'}</p>
                    </div>
                </div>

                {/* Sizes */}
                {
                    product.variants.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Fit</h3>
                                <button
                                    onClick={() => setIsSizeAssistantOpen(true)}
                                    className="flex items-center gap-1.5 text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline"
                                >
                                    <Ruler className="w-3.5 h-3.5" /> Find My Size
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((v: Variant) => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        disabled={v.stock <= 0}
                                        className={`px-6 py-3 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${selectedVariant?.id === v.id
                                            ? 'border-gray-900 bg-gray-900 text-white shadow-xl shadow-gray-200'
                                            : v.stock <= 0
                                                ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed opacity-50'
                                                : 'border-gray-100 text-gray-900 hover:border-gray-300'
                                            }`}
                                    >
                                        {v.size} {v.stock > 0 && v.stock < 5 && <span className="text-[8px] text-orange-500 ml-1">Low</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                }

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="flex-1 h-16 bg-white border-4 border-gray-900 text-gray-900 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-gray-900 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                    >
                        <Icon name="shopping-bag" className="w-5 h-5" />
                        Add to Cart
                    </button>
                    <button
                        onClick={handleBuyNow}
                        disabled={isOutOfStock}
                        className="flex-[1.5] h-16 bg-orange-600 text-white rounded-[2rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-orange-200 hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95 group"
                    >
                        Buy Now
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button
                        onClick={toggleWishlist}
                        disabled={isWishlisting}
                        className={`w-16 h-16 rounded-[2rem] border-4 flex items-center justify-center transition-all active:scale-90 ${isWishlisted
                            ? 'bg-rose-50 border-rose-600 text-rose-600'
                            : 'bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-300'
                            }`}
                    >
                        <Icon name="heart" className={`w-8 h-8 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Icon name="shield-check" className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Certified</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Icon name="truck" className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Fast Ship</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Icon name="rotate-ccw" className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Easy Return</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center gap-2 group">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Icon name="credit-card" className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-900">Secure</p>
                    </div>
                </div>
            </div >

            <SizeAssistant
                isOpen={isSizeAssistantOpen}
                onClose={() => setIsSizeAssistantOpen(false)}
                category={product.category?.name}
            />
        </div >
    );
}
