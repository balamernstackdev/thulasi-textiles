'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCarousel from './ProductCarousel';

export default function LatestProducts({ products, session }: { products: any[], session?: any }) {
    if (!products || products.length === 0) return null;

    return (
        <section className="py-2 md:py-8 bg-[#F2F2F2]">
            <div className="max-w-[1700px] mx-auto px-0 md:px-12 lg:px-20">
                <div className="bg-transparent md:bg-white md:rounded-[2.5rem] p-4 md:p-6 md:shadow-sm md:border md:border-gray-100">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                New <span className="text-orange-600">Arrivals</span>
                            </h2>
                            <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-[8px] md:text-[10px]">
                                Discover our latest textile Products
                            </p>
                        </div>
                        <Link
                            href="/category/new-arrivals"
                            className="group flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 hover:text-orange-600 transition-colors"
                        >
                            Explore All New <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <ProductCarousel products={products.slice(0, 12)} session={session} />
                </div>
            </div>
        </section>
    );
}
