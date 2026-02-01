'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { getProductBySlug } from '@/lib/actions/product';
import Price from '@/components/store/Price';

interface ChatProductCardProps {
    slug: string;
}

export default function ChatProductCard({ slug }: ChatProductCardProps) {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            setLoading(true);
            try {
                const result = await getProductBySlug(slug);
                if (result.success) {
                    setProduct(result.data);
                }
            } catch (err) {
                console.error('Failed to fetch product for chat card:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [slug]);

    if (loading) {
        return (
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-16 h-20 bg-gray-100 rounded-xl" />
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                </div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all group overflow-hidden relative mt-2">
            <div className="flex gap-4">
                <div className="w-20 h-24 relative rounded-2xl overflow-hidden shrink-0">
                    <Image
                        src={product.images?.[0]?.url || '/placeholder-product.png'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1">{product.category?.name}</h4>
                        <h3 className="text-xs font-black text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors uppercase">{product.name}</h3>
                        <div className="mt-1">
                            <span className="text-sm font-black text-gray-900">
                                <Price amount={product.basePrice} />
                            </span>
                        </div>
                    </div>
                    <Link
                        href={`/product/${product.slug}`}
                        className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 group-hover:text-gray-900 transition-colors"
                    >
                        View Details <ArrowRight className="w-3 h-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
            {/* Quick Add Button - Floating */}
            <Link
                href={`/product/${product.slug}`}
                className="absolute right-4 bottom-4 w-9 h-9 bg-black text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
                <ShoppingBag className="w-4 h-4" />
            </Link>
        </div>
    );
}
