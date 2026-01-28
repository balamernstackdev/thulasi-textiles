'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';

import ProductCard from './ProductCard';

export default function LatestProducts({ products, session }: { products: any[], session?: any }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-10 md:py-16 bg-[#F2F2F2]">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                New <span className="text-orange-600">Arrivals</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                                Discover our latest textile Products
                            </p>
                        </div>
                        <Link
                            href="/category/new-arrivals"
                            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-orange-600 transition-colors"
                        >
                            Explore All New <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-6">
                        {products.slice(0, 6).map((product, index) => (
                            <ProductCard key={product.id} product={product} session={session} priority={index < 6} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
