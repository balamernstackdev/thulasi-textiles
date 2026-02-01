'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

interface ViewedProduct {
    id: string;
    name: string;
    slug: string;
    image: string;
    price: number;
}

export default function RecentlyViewed() {
    const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);

    useEffect(() => {
        const loadHistory = () => {
            const stored = localStorage.getItem('thulasi_recently_viewed');
            if (stored) {
                try {
                    setViewedProducts(JSON.parse(stored).slice(0, 10));
                } catch (e) {
                    console.error('Failed to parse recently viewed', e);
                }
            }
        };

        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(() => loadHistory());
        } else {
            setTimeout(loadHistory, 200);
        }
    }, []);

    if (viewedProducts.length === 0) return null;

    return (
        <section className="bg-white py-8 md:py-12 overflow-hidden border-t border-gray-100">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <History className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                            Picked for <span className="text-orange-600">You</span>
                        </h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Based on your browsing history</p>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
                    {viewedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="group flex-shrink-0 w-32 md:w-48 snap-start"
                        >
                            <div className="relative aspect-[10/14] rounded-3xl overflow-hidden bg-gray-100 mb-3 shadow-sm border border-gray-50">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                            </div>
                            <h3 className="font-black text-gray-900 text-[10px] md:text-sm truncate uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="font-mono text-[9px] md:text-xs font-bold text-gray-400 mt-1">
                                ₹{product.price.toLocaleString()}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
