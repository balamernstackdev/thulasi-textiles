'use client'
import { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle2, ShieldCheck, Truck, RotateCcw, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/store/cart';

interface Variant {
    id: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
}

interface ProductInteractionProps {
    product: any;
    isWishlisted: boolean;
}

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductInteraction({ product, isWishlisted, session }: { product: any; isWishlisted: boolean; session?: any }) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
        product.variants.find((v: Variant) => v.stock > 0) || product.variants[0] || null
    );
    const [quantity, setQuantity] = useState(1);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [brokenImages, setBrokenImages] = useState<string[]>([]);

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
            price: selectedVariant ? Number(selectedVariant.price) : Number(product.basePrice),
            image: product.images[0]?.url || '/placeholder-product.png',
            stock: selectedVariant?.stock || 10,
            size: selectedVariant?.size,
            quantity: quantity,
        });

        router.push('/cart');
    };

    useEffect(() => {
        if (!isAutoPlaying || images.length <= 1) return;
        const interval = setInterval(nextImage, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, images.length, nextImage]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[4.5fr_4fr_3.5fr] gap-x-8 xl:gap-x-16 gap-y-12 items-start relative">
            {/* COLUMN 1: VISUAL GALLERY */}
            <div className="flex flex-col-reverse lg:flex-row gap-6 items-start lg:sticky lg:top-24">
                {/* Thumbnails */}
                {images.length > 1 && (
                    <div className="hidden lg:flex lg:flex-col gap-4 py-1 shrink-0">
                        {images.map((img: any, idx: number) => {
                            const isPrimary = idx === currentIdx;
                            return (
                                <button
                                    key={img.id}
                                    onMouseEnter={() => {
                                        setCurrentIdx(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    onClick={() => {
                                        setCurrentIdx(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`relative w-20 h-24 rounded-lg overflow-hidden transition-all duration-500 ${isPrimary
                                        ? 'ring-2 ring-orange-900 shadow-xl scale-105 opacity-100'
                                        : 'opacity-50 hover:opacity-100 hover:scale-105'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`View ${idx}`}
                                        fill
                                        className="object-cover"
                                        onError={() => setBrokenImages(prev => [...prev, img.url])}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Main View */}
                <div
                    className="relative flex-1 w-full aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 shadow-2xl group cursor-zoom-in"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <Image
                        src={activeImage.startsWith('http') || activeImage.startsWith('/') ? activeImage : 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80'}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                        priority
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src !== 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80') {
                                target.src = 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=800&q=80';
                            }
                        }}
                    />

                    {/* Floating Indicators */}
                    <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
                        {product.isBestSeller && (
                            <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                Best Seller
                            </span>
                        )}
                        {product.isNew && (
                            <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                                New Arrival
                            </span>
                        )}
                    </div>

                    {/* Mobile Dots */}
                    {images.length > 1 && (
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 lg:hidden z-20">
                            {images.map((_: any, idx: number) => (
                                <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${idx === currentIdx ? 'bg-white w-8' : 'bg-white/40 w-2'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMN 2: STORY & DETAILS */}
            <div className="flex flex-col space-y-8 pt-2">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-orange-600 text-[10px] font-black uppercase tracking-[0.25em]">
                            {product.category.name}
                        </span>
                        <div className="h-px w-8 bg-orange-200"></div>
                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.25em]">
                            Thulasi Heritage
                        </span>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-serif font-medium text-gray-900 mb-6 leading-[1.1]">
                        {product.name}
                    </h1>

                    <div className="flex items-center gap-6 mb-8">
                        <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                            <span className="text-sm font-bold text-gray-900">4.8</span>
                            <span className="text-sm text-gray-400 font-medium">(128 Reviews)</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300" />
                        <span className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            Verified Quality
                        </span>
                    </div>

                    <p className="text-gray-600 text-base leading-relaxed font-light">
                        {product.description}
                    </p>
                </div>

                {/* Modernized Offers */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100 flex flex-col justify-center transition-all hover:bg-orange-50 group">
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 group-hover:text-orange-600 mb-1">Bank Offer</span>
                        <span className="text-xs font-bold text-gray-900">₹500 Instant Discount</span>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50/50 border border-gray-100 flex flex-col justify-center transition-all hover:bg-gray-100 group">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 mb-1">Payment</span>
                        <span className="text-xs font-bold text-gray-900">No Cost EMI Available</span>
                    </div>
                </div>

                {/* Minimalist Size Selector */}
                {product.variants.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Select Size</span>
                            <button className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline">Size Guide</button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {ALL_SIZES.map(size => {
                                const variant = product.variants.find((v: Variant) => v.size === size);
                                const isAvailable = variant && variant.stock > 0;
                                const isSelected = selectedVariant?.size === size;

                                return (
                                    <button
                                        key={size}
                                        disabled={!isAvailable}
                                        onClick={() => variant && setSelectedVariant(variant)}
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isSelected
                                            ? 'bg-gray-900 text-white shadow-lg scale-110'
                                            : isAvailable
                                                ? 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'
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

                {/* Assurance Icons */}
                <div className="grid grid-cols-4 gap-4 pt-6 mt-2 border-t border-gray-100 opacity-60">
                    {[
                        { icon: Truck, label: 'Free Shipping' },
                        { icon: ShieldCheck, label: 'Authentic' },
                        { icon: RotateCcw, label: '7 Day Return' },
                        { icon: CreditCard, label: 'Secure Pay' },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 text-center">
                            <item.icon className="w-4 h-4 text-gray-900" />
                            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLUMN 3: FLOATING BUY CARD */}
            <div className="lg:sticky lg:top-24 md:col-start-2 lg:col-start-auto">
                <div className="relative bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-gray-100 p-8 space-y-8 overflow-hidden z-10 transition-all duration-300">

                    {/* Decorative Gradient Blob */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="space-y-1 relative z-10">
                        <span className="text-gray-400 font-medium text-sm line-through">₹{originalPrice.toLocaleString()}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-4xl font-serif text-gray-900">₹{currentPrice.toLocaleString()}</span>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                                Save {Math.round((1 - currentPrice / originalPrice) * 100)}%
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 font-medium pt-1">Inclusive of all taxes</p>
                    </div>

                    <div className="space-y-6">
                        {/* Stock Status */}
                        <div className="flex items-center gap-3 bg-gray-50/50 p-3 rounded-xl border border-gray-100/50">
                            {selectedVariant && selectedVariant.stock > 0 ? (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] animate-pulse" />
                                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">In Stock</span>
                                    {selectedVariant.stock < 10 && (
                                        <span className="ml-auto text-[10px] font-black text-orange-600 uppercase tracking-widest">
                                            Only {selectedVariant.stock} left
                                        </span>
                                    )}
                                </>
                            ) : (
                                <>
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wide">OutOf Stock</span>
                                </>
                            )}
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">Quantity</span>
                                <div className="flex items-center gap-4 bg-gray-50 rounded-full px-4 py-2 border border-gray-100">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all"
                                    >
                                        -
                                    </button>
                                    <span className="text-base font-black w-6 text-center text-gray-900">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-full transition-all"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <AddToCartButton
                                    product={product}
                                    selectedVariant={selectedVariant}
                                    quantity={quantity}
                                    session={session}
                                // Passing custom class for this redesigned component if needed, 
                                // or ensuring the button component itself is styling-agnostic enough
                                />

                                <button
                                    onClick={handleBuyNow}
                                    disabled={isOutOfStock}
                                    className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] ${isOutOfStock
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-gray-900 text-white hover:bg-black'
                                        }`}
                                >
                                    <span>Buy Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-center">
                        <WishlistButton productId={product.id} initialState={isWishlisted} />
                    </div>
                </div>
            </div>
        </div>
    );
}
