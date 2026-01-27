'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, ChevronRight, Sparkles } from 'lucide-react';

interface ComplementaryProductsProps {
    products: any[];
}

export default function ComplementaryProducts({ products }: ComplementaryProductsProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-orange-600 font-black uppercase tracking-[0.4em] text-[10px]">
                        <Sparkles className="w-3.5 h-3.5" />
                        Complete The Look
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">
                        Style With <span className="text-orange-600">This Piece</span>
                    </h2>
                    <p className="text-sm text-gray-400 font-medium max-w-xl">
                        Our master stylists suggest these handcrafted accessories and garments to perfectly complement your selection.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.slug}`}
                        className="group space-y-4"
                    >
                        <div className="aspect-[3/4] overflow-hidden rounded-sm bg-gray-50 relative">
                            {product.images?.[0] && (
                                <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            )}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div className="bg-white text-black p-4 rounded-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-xs font-bold text-gray-400">
                                ₹{product.basePrice.toLocaleString()}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
