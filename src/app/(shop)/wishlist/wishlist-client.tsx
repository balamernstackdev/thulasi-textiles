'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, X, ArrowRight, Star } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions/wishlist';
import { useRouter } from 'next/navigation';

export default function WishlistClient({ wishlist }: { wishlist: any[] }) {
    const router = useRouter();
    const [removingId, setRemovingId] = useState<string | null>(null);

    const handleRemove = async (productId: string) => {
        setRemovingId(productId);
        await toggleWishlist(productId);
        setRemovingId(null);
        router.refresh();
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="text-center space-y-8 max-w-md">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Heart className="w-16 h-16 text-gray-300" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Your Wishlist is Empty</h2>
                        <p className="text-gray-500 font-medium">Save items you love to buy them later</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                    >
                        Start Exploring
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl">
                <div className="mb-8">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-2">My Wishlist</h3>
                    <p className="text-gray-500 font-medium">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                        <div key={item.id} className="group border border-gray-100 rounded-3xl p-4 hover:shadow-lg transition-all relative">
                            {/* Remove Button */}
                            <button
                                onClick={() => handleRemove(item.product.id)}
                                disabled={removingId === item.product.id}
                                className="absolute top-6 right-6 z-10 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shadow-sm"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Image */}
                            <Link href={`/product/${item.product.slug}`} className="block relative aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-4">
                                {item.product.images?.[0] ? (
                                    <Image
                                        src={item.product.images[0].url}
                                        alt={item.product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        No Image
                                    </div>
                                )}
                                {item.product.isNew && (
                                    <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                                        New
                                    </span>
                                )}
                            </Link>

                            {/* Details */}
                            <div className="space-y-3">
                                <Link href={`/product/${item.product.slug}`}>
                                    <h3 className="font-black text-gray-900 truncate hover:text-orange-600 transition-colors text-lg">
                                        {item.product.name}
                                    </h3>
                                </Link>

                                <div className="flex items-center gap-2">
                                    <span className="font-black text-gray-900 text-lg">₹{item.product.basePrice.toLocaleString('en-IN')}</span>
                                    {item.product.variants?.[0] && (
                                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wide bg-gray-100 px-2 py-0.5 rounded-full">
                                            {item.product.variants.length} Variants
                                        </span>
                                    )}
                                </div>

                                <Link
                                    href={`/product/${item.product.slug}`}
                                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-gray-200 group-hover:shadow-orange-200"
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    View Product
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
