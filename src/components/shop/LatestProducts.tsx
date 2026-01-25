'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight } from 'lucide-react';

export default function LatestProducts({ products, session }: { products: any[], session?: any }) {
    if (!products || products.length === 0) return null;

    // We'll use the first 5 products for this special layout
    const mainProduct = products[0];
    const sideProducts = products.slice(1, 4);

    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="flex flex-col md:flex-row items-baseline justify-between mb-12 gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            New <span className="text-orange-600">Arrivals</span>
                        </h2>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">
                            Discover our latest textile Products
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-900 hover:text-orange-600 transition-colors"
                    >

                        Explore All New <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Big Feature Product */}
                    <Link
                        href={`/product/${mainProduct.slug}`}
                        className="lg:col-span-7 group relative h-[500px] lg:h-[700px] rounded-[2.5rem] overflow-hidden shadow-2xl block"
                    >
                        <Image
                            src={mainProduct.images[0]?.url || '/placeholder.png'}
                            alt={mainProduct.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                            <div className="absolute bottom-10 left-10 right-10 flex items-end justify-between">
                                <div className="space-y-2">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                                        Edition 2024
                                    </span>
                                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none group-hover:translate-x-2 transition-transform duration-500 uppercase italic">
                                        {mainProduct.name}
                                    </h3>
                                    <p className="text-white/70 font-medium text-lg lg:max-w-md line-clamp-2">
                                        {mainProduct.description}
                                    </p>
                                </div>
                                <div className="hidden md:flex bg-white text-gray-900 w-16 h-16 rounded-full items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all group-hover:scale-110 active:scale-95 shadow-xl">
                                    <ChevronRight className="w-8 h-8" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Staggered Side Items */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {sideProducts.map((product, i) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.slug}`}
                                className={`flex gap-6 p-4 rounded-3xl bg-gray-50 border border-transparent hover:border-orange-100 hover:bg-orange-50/30 transition-all group ${i === 1 ? 'lg:translate-x-6' : ''}`}
                            >
                                <div className="relative w-32 h-32 md:w-36 md:h-36 shrink-0 rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src={product.images[0]?.url || '/placeholder.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest leading-none">
                                        {product.category.name}
                                    </p>
                                    <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-orange-600 transition-colors">
                                        {product.name}
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-black text-gray-900">₹{Number(product.basePrice).toLocaleString()}</span>
                                        <span className="text-xs font-bold text-gray-400 group-hover:text-orange-600 transition-colors uppercase tracking-widest underline underline-offset-4 decoration-current/20">
                                            Shop Now
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* View All CTA for dynamic feel */}
                        <div className="relative h-24 lg:h-32 rounded-3xl bg-gray-900 p-6 flex items-center justify-between group cursor-pointer overflow-hidden lg:-translate-x-4">
                            <div className="relative z-10">
                                <h4 className="text-white text-xl font-black uppercase tracking-tight">View Full <br /> Drop</h4>
                            </div>
                            <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-all group-hover:scale-110">
                                <ArrowRight className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-orange-600/30 transition-all duration-700" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
