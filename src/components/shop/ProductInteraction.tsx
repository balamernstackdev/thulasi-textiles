'use client'
import { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle2, XCircle, AlertCircle, ShieldCheck, Truck, RotateCcw, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';
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

    const currentPrice = selectedVariant ? Number(selectedVariant.price) : Number(product.basePrice);
    const originalPrice = currentPrice * 1.5;
    const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : product.variants.every((v: any) => v.stock <= 0);

    const rawImages = product.images.length > 0 ? product.images : [{ url: '/placeholder-product.png', id: 'placeholder' }];
    const images = rawImages.filter((img: any) => !brokenImages.includes(img.url));
    const activeImage = images[currentIdx]?.url || images[0]?.url;

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[4.5fr_4fr_3.5fr] gap-x-6 xl:gap-x-12 gap-y-6 mb-8 items-start">
            {/* COLUMN 1: AMAZON-STYLE GALLERY */}
            <div className="flex flex-col-reverse lg:flex-row gap-4 items-start lg:sticky lg:top-[230px]">
                {/* Vertical Thumbnail Strip - Desktop Only */}
                {images.length > 1 && (
                    <div className="hidden lg:flex lg:flex-col gap-4 overflow-y-auto lg:max-h-[700px] py-1 shrink-0">
                        {images.map((img: any, idx: number) => {
                            const isPrimary = idx === currentIdx;
                            return (
                                <div
                                    key={img.id}
                                    onMouseEnter={() => {
                                        setCurrentIdx(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    onClick={() => {
                                        setCurrentIdx(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`relative shrink-0 w-16 h-20 lg:w-20 lg:h-28 rounded-md overflow-hidden border-2 cursor-pointer transition-all duration-300 ${isPrimary
                                        ? 'border-orange-600 shadow-xl ring-4 ring-orange-50'
                                        : 'border-gray-100 opacity-60 hover:opacity-100 hover:border-orange-200'
                                        }`}
                                >
                                    <Image
                                        src={img.url}
                                        alt={`View ${idx}`}
                                        fill
                                        className="object-cover"
                                        onError={() => setBrokenImages(prev => [...prev, img.url])}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Primary Image View */}
                <div
                    className="relative flex-1 w-full aspect-[4/5] lg:aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-2xl group cursor-zoom-in group p-0"
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className="relative w-full h-full">
                        <Image
                            src={activeImage}
                            alt={product.name}
                            fill
                            className="object-cover transition-all duration-[2000ms] group-hover:scale-110"
                            priority
                            onError={() => setBrokenImages(prev => [...prev, activeImage])}
                        />
                    </div>

                    {/* Floating Interaction (Best Seller) */}
                    {product.isBestSeller && (
                        <div className="absolute top-6 left-6 z-10">
                            <span className="bg-[#E47911] text-white text-[9px] font-black px-4 py-1.5 rounded-sm uppercase tracking-widest shadow-md">
                                Best Seller
                            </span>
                        </div>
                    )}

                    {/* Mobile Dots Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:hidden z-20">
                            {images.map((_: any, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentIdx(idx);
                                        setIsAutoPlaying(false);
                                    }}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIdx ? 'bg-orange-600 w-4' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* COLUMN 2: INFORMATION */}
            <div className="flex flex-col">
                <div className="mb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-gray-100 text-gray-900 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{product.category.name}</span>
                        <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm shadow-orange-500/5">Thulasi Choice</span>
                    </div>

                    <h1 className="text-2xl lg:text-3xl font-black text-gray-900 mb-2 leading-none tracking-tighter uppercase italic">
                        {product.name}
                    </h1>

                    {/* Mobile Price Display */}
                    <div className="lg:hidden flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-bold text-gray-900">₹{currentPrice.toLocaleString()}</span>
                        <span className="text-sm text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                        <span className="text-sm text-[#007600] font-bold">-{Math.round((1 - currentPrice / originalPrice) * 100)}%</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-1 text-[#FFA41C]">
                            {[1, 2, 3, 4, 5].map(s => (
                                <Star key={s} className={`w-3 h-3 ${s <= 4 ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                            <span className="ml-1 text-xs font-medium text-[#007185] hover:text-[#C7511F] cursor-pointer">4.0</span>
                        </div>
                        <span className="text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer">128 reviews</span>
                    </div>

                    <div className="mb-2 p-3 bg-gray-50 rounded-sm border border-gray-100">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                            <CreditCard className="w-3.5 h-3.5" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest">Offers</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="p-2 bg-white rounded-sm border border-gray-200 shadow-sm">
                                <p className="text-[9px] font-black text-gray-900 uppercase">Bank Offer</p>
                                <p className="text-[10px] text-gray-500 font-medium">₹500 off SBI</p>
                            </div>
                            <div className="p-2 bg-white rounded-sm border border-gray-200 shadow-sm">
                                <p className="text-[9px] font-black text-gray-900 uppercase">Cashback</p>
                                <p className="text-[10px] text-gray-500 font-medium">5% Amazon Pay</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest border-l-4 border-orange-600 pl-4 py-1 italic">Product Discovery</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {product.variants.length > 0 && (
                        <div className="space-y-3 pt-6 border-t border-gray-100">
                            <div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-5">Choose Your Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_SIZES.map(size => {
                                        const variant = product.variants.find((v: Variant) => v.size === size);
                                        const isAvailable = variant && variant.stock > 0;
                                        const isSelected = selectedVariant?.size === size;

                                        return (
                                            <button
                                                key={size}
                                                disabled={!isAvailable}
                                                onClick={() => variant && setSelectedVariant(variant)}
                                                className={`min-w-[50px] h-10 flex items-center justify-center rounded-sm text-xs font-bold transition-all border ${isAvailable
                                                    ? isSelected
                                                        ? "border-[#E47911] bg-[#FEF8F2] text-[#E47911] shadow-sm"
                                                        : "border-gray-300 text-gray-900 hover:bg-gray-50"
                                                    : "border-gray-100 text-gray-300 cursor-not-allowed opacity-50 bg-gray-50"
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100">
                        {[
                            { icon: Truck, label: 'Free Delivery' },
                            { icon: ShieldCheck, label: 'Quality' },
                            { icon: RotateCcw, label: '7 Day Return' },
                            { icon: CreditCard, label: 'Secure' },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center gap-2">
                                <item.icon className="w-5 h-5 text-gray-400" />
                                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter text-center">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* COLUMN 3: BUY BOX */}
            <div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-gray-900 tracking-tight">₹{currentPrice.toLocaleString()}</span>
                            <span className="text-lg text-gray-400 line-through font-medium">₹{originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-rose-100 shadow-sm shadow-rose-500/5">
                                Limited time deal
                            </span>
                        </div>
                        <div className="text-sm text-gray-400 font-medium">
                            Inclusive of all taxes
                        </div>
                    </div>

                    <div className="space-y-5 py-6 border-y border-gray-100">
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-gray-900 font-black uppercase tracking-tighter italic">Stock Status:</span>
                            {selectedVariant && selectedVariant.stock > 0 ? (
                                <span className="text-emerald-600 font-extrabold px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm">In Stock.</span>
                            ) : (
                                <span className="text-rose-600 font-extrabold px-3 py-1 bg-rose-50 rounded-lg border border-rose-100 shadow-sm">Unavailable.</span>
                            )}
                        </div>

                        {selectedVariant && selectedVariant.stock > 0 && (
                            <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100/50">
                                <p className="text-[#B12704] text-sm font-black uppercase tracking-tight">
                                    <AlertCircle className="w-4 h-4 inline-block mr-2 -mt-1" />
                                    Only {selectedVariant.stock} left in stock - order soon.
                                </p>
                            </div>
                        )}

                        <div className="text-[12px] text-gray-900 bg-white p-4 rounded-2xl shadow-sm border border-gray-50 flex items-center gap-3">
                            <Truck className="w-5 h-5 text-orange-600 shrink-0" />
                            <p className="font-bold leading-tight uppercase tracking-tight">
                                <span className="text-orange-600 font-black italic">FREE delivery</span> by <span className="text-gray-950 font-black italic">Tomorrow, Jan 27.</span>
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="flex items-center gap-6">
                            <span className="text-xs font-black text-gray-900 uppercase tracking-widest">QTY:</span>
                            <div className="relative">
                                <select
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    className="bg-[#F0F2F2] border border-[#D5D9D9] rounded-xl px-4 py-2 text-sm font-bold text-gray-900 appearance-none outline-none focus:border-[#007185] transition-all cursor-pointer shadow-sm min-w-[60px]"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                        <option key={n} value={n}>{n}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <AddToCartButton product={product} selectedVariant={selectedVariant} quantity={quantity} session={session} />

                            <button
                                onClick={handleBuyNow}
                                disabled={isOutOfStock}
                                className={`w-full py-4 rounded-3xl font-black text-sm md:text-[12px] uppercase tracking-[0.25em] transition-all active:scale-[0.98] shadow-lg ${isOutOfStock
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-b from-[#FFD814] to-[#F7CA00] text-black hover:from-[#F7CA00] hover:to-[#E1B800] border border-[#F2C200]'
                                    }`}
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <WishlistButton productId={product.id} initialState={isWishlisted} />
                    </div>

                    <div className="text-[11px] space-y-2 text-gray-500 font-bold">
                        <div className="flex justify-between">
                            <span>Ships from:</span>
                            <span className="text-[#007185] hover:text-[#C45500] cursor-pointer">Thulasi Textiles</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Sold by:</span>
                            <span className="text-[#007185] hover:text-[#C45500] cursor-pointer">Thulasi Retail Ltd</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
