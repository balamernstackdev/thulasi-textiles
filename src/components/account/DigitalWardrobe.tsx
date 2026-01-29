'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Shirt } from 'lucide-react';
import Link from 'next/link';

export default function DigitalWardrobe({ orders }: { orders: any[] }) {
    // Flatten all order items into a single list of purchased "Wardrobe Items"
    const wardrobeItems = orders?.flatMap(order =>
        order.items.map((item: any) => ({
            ...item,
            purchaseDate: order.createdAt,
            orderId: order.id
        }))
    ) || [];

    if (wardrobeItems.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                    <Shirt className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Your Wardrobe is Empty</h3>
                    <p className="text-gray-500 text-sm mt-1">Start your collection of authentic handlooms.</p>
                </div>
                <Link
                    href="/shop"
                    className="inline-flex h-10 items-center justify-center rounded-xl bg-black px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-gray-800 transition-colors"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-serif text-gray-900">Digital Wardrobe</h2>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {wardrobeItems.length} Authentic Pieces
                    </p>
                </div>
                <Shirt className="w-6 h-6 text-orange-200" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 p-1 bg-gray-50">
                {wardrobeItems.map((item, idx) => (
                    <div key={`${item.orderId}-${idx}`} className="group relative aspect-[3/4] bg-white overflow-hidden">
                        <Image
                            src={item.variant?.product?.images?.[0]?.url || item.image || '/placeholder-product.png'}
                            alt={item.variant?.product?.name || 'Product'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-4 text-center">
                            <span className="text-white text-xs font-serif italic mb-2">
                                {new Date(item.purchaseDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                            </span>
                            <p className="text-white text-[10px] font-black uppercase tracking-widest line-clamp-2">
                                {item.variant?.product?.name}
                            </p>
                            <Link
                                href={`/product/${item.variant?.product?.slug}`}
                                className="mt-4 px-4 py-2 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-orange-50 transition-colors"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
