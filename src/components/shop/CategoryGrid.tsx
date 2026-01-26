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

export default function CategoryGrid({ categories }: CategoryGridProps) {
    if (!categories || categories.length === 0) return null;

    // We take the first 3 for the signature grid layout
    const mainCategories = categories.slice(0, 3);
    const featured = mainCategories[0];
    const others = mainCategories.slice(1);

    return (
        <section className="py-8 md:py-20 bg-[#F2F2F2]">
            <div className="max-w-[1700px] mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:h-[600px]">
                    {/* Featured Category */}
                    <Link
                        href={`/category/${featured.slug}`}
                        className="group relative overflow-hidden rounded-[3rem] md:rounded-[2.5rem] bg-white shadow-xl aspect-[4/5] md:aspect-auto lg:h-full"
                    >
                        <Image
                            src={featured.image || '/placeholder-product.png'}
                            alt={featured.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-90 md:brightness-100 group-hover:brightness-75"
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent md:from-black/80" />
                        <div className="absolute bottom-6 left-6 right-6 md:bottom-12 md:left-12 md:right-12 space-y-3 md:space-y-6">
                            <h2 className="text-3xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.85]">{featured.name}</h2>
                            {featured.description && <p className="text-white/90 text-base md:text-lg font-medium max-w-md">{featured.description}</p>}
                            <span className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 md:px-10 md:py-5 rounded-full font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl">
                                Explore Now <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                            </span>
                        </div>
                    </Link>

                    {/* Secondary Categories */}
                    {others.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 md:gap-8">
                            {others.map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/category/${category.slug}`}
                                    className="group relative overflow-hidden rounded-[3rem] md:rounded-[2.5rem] bg-white shadow-xl aspect-[16/9] md:aspect-auto"
                                >
                                    <Image
                                        src={category.image || '/placeholder-product.png'}
                                        alt={category.name}
                                        fill
                                        className="object-cover object-top group-hover:scale-110 transition-transform duration-1000 brightness-90"
                                        sizes="(max-width: 1024px) 100vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                                        <h3 className="text-xl md:text-4xl font-black text-white uppercase italic tracking-tighter mb-1 md:mb-2 leading-none">{category.name}</h3>
                                        {category.description && <p className="text-white/80 text-[10px] md:text-sm font-medium mb-3 md:mb-4 line-clamp-1">{category.description}</p>}
                                        <span className="inline-flex items-center gap-1.5 text-white font-black uppercase text-[8px] md:text-[10px] tracking-widest bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 group-hover:bg-orange-600 group-hover:border-orange-600 transition-all">
                                            Shop Selection <ArrowRight className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
