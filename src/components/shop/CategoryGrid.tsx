'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
    categories: {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        image: string | null;
    }[];
}

import { motion } from 'framer-motion';

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (!categories || categories.length === 0) return null;

    // Signature Bento Layout configurations for up to 4 items
    const bentoConfigs = [
        "lg:col-span-2 lg:row-span-2 h-[280px] md:h-[500px] lg:h-[700px]", // Large
        "lg:col-span-2 lg:row-span-1 h-[200px] md:h-[300px] lg:h-[334px]", // Wide
        "lg:col-span-1 lg:row-span-1 h-[200px] md:h-[300px] lg:h-[334px]", // Square
        "lg:col-span-1 lg:row-span-1 h-[200px] md:h-[300px] lg:h-[334px]", // Square
    ];

    return (
        <section className="py-8 md:py-12 bg-[#F2F2F2]">
            <div className="max-w-[1700px] mx-auto px-6 sm:px-8 md:px-12 lg:px-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="space-y-4">
                        <p className="text-orange-600 font-black uppercase tracking-normal md:tracking-[0.3em] text-[10px] md:text-xs">
                            Discovery
                        </p>
                        <h2 className="text-3xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight uppercase">
                            Browse <span className="text-orange-600">The Collections</span>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:auto-rows-min">
                    {categories.slice(0, 4).map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                            className={`${bentoConfigs[index] || "lg:col-span-1"} relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] group shadow-2xl shadow-gray-200`}
                        >
                            <Link href={`/category/${category.slug}`} className="block w-full h-full">
                                <Image
                                    src={category.image || '/placeholder-product.png'}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    sizes="(max-width: 1024px) 100vw, 25vw"
                                />

                                {/* Glassmorphism Mask - Reveal on Hover */}
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-700" />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                                    <div className="space-y-2 md:space-y-4">
                                        <h3 className={`font-black text-white uppercase italic tracking-tighter leading-none
                                            ${index === 0 ? 'text-4xl md:text-8xl' : 'text-2xl md:text-4xl'}
                                        `}>
                                            {category.name}
                                        </h3>
                                        {index === 0 && category.description && (
                                            <p className="text-white/80 text-sm md:text-lg font-medium max-w-sm line-clamp-2 md:line-clamp-none uppercase tracking-widest leading-relaxed">
                                                {category.description}
                                            </p>
                                        )}
                                        <div className="pt-2">
                                            <span className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl group-hover:bg-orange-600 group-hover:text-white transition-all transform group-hover:translate-x-2">
                                                View Selection <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
