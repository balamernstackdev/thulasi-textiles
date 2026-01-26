'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerProps {
    banners: {
        id: string;
        imageUrl: string;
        title: string | null;
        subtitle: string | null;
        buttonText: string | null;
        link: string | null;
        type: string;
        isActive: boolean;
        order: number;
    }[];
    type?: 'main' | 'section';
}

const BANNER_TEXT = [
    { title: "EXQUISITE SAREE COLLECTION", subtitle: "Traditional Elegance, Modern Charm", cta: "Shop Sarees" },
    { title: "PREMIUM MEN'S CASUALS", subtitle: "Comfort Meets Sophistication", cta: "Explore Collection" },
    { title: "LUXURY HOME LINEN", subtitle: "Transform Your Living Spaces", cta: "View Linens" }
];

export default function Banner({ banners, type = 'main' }: BannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (!banners || banners.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    const isSection = type === 'section';

    return (
        <div className={`relative w-full overflow-hidden ${isSection ? 'my-12 px-4 lg:px-6' : 'bg-white'}`}>
            <div className={`${isSection ? 'max-w-[1700px] mx-auto' : 'w-full'}`}>
                <div className={`relative w-full overflow-hidden group/banner transition-all duration-500
                    ${isSection
                        ? 'rounded-[2.5rem] shadow-lg aspect-[21/6] md:aspect-[32/8] lg:h-[300px]'
                        : 'aspect-[16/9] md:aspect-[32/9] lg:h-[380px] w-full'
                    }`}
                >
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                }`}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title || "Promotional Banner"}
                                    fill
                                    className={`object-cover object-top ${banner.title ? 'brightness-75' : 'brightness-100'} transition-transform duration-[2000ms] group-hover:scale-105 will-change-transform gpu`}
                                    priority={index === 0}
                                    sizes="100vw"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = '/placeholder-product.png';
                                    }}
                                />

                                {/* Dynamic Text Overlay from Database */}
                                {banner.title && (
                                    <div className="absolute inset-0 flex flex-col items-start justify-center text-left p-8 md:p-16 z-20 max-w-[1700px] mx-auto">
                                        <div className={`transition-all duration-1000 transform delay-300 ${index === currentIndex ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                                            <h1 className={`${isSection ? 'text-xl md:text-3xl' : 'text-2xl md:text-5xl lg:text-6xl'} font-black text-white mb-2 drop-shadow-2xl tracking-tighter uppercase italic leading-none max-w-3xl`}>
                                                {banner.title}
                                            </h1>
                                            {banner.subtitle && (
                                                <p className={`${isSection ? 'text-xs md:text-lg' : 'text-sm md:text-xl'} text-white/90 font-medium mb-6 max-w-xl drop-shadow-md`}>
                                                    {banner.subtitle}
                                                </p>
                                            )}
                                            <Link
                                                href={banner.link || '#'}
                                                className={`${isSection ? 'px-6 py-2 text-xs' : 'px-8 py-3 text-sm'} bg-white text-gray-900 rounded-sm font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-95 inline-block`}
                                            >
                                                {banner.buttonText || "Shop Now"}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Navigation Arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/4 -translate-y-1/2 z-30 opacity-0 md:group-hover/banner:opacity-100 focus:opacity-100 transition-opacity"
                            >
                                <ChevronLeft className="w-10 h-10 text-white drop-shadow-lg" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/4 -translate-y-1/2 z-30 opacity-0 md:group-hover/banner:opacity-100 focus:opacity-100 transition-opacity"
                            >
                                <ChevronRight className="w-10 h-10 text-white drop-shadow-lg" />
                            </button>
                        </>
                    )}

                    {/* Simple Dots */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-16 md:bottom-24 left-1/2 -translate-x-1/2 z-30 hidden md:flex space-x-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-orange-600 scale-125' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Gradient for Smooth Transition to Content (Amazon Style) */}
                {!isSection && (
                    <div className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-[#F2F2F2] to-transparent z-20 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
