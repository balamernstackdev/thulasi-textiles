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
        <div className={`relative w-full overflow-hidden ${isSection ? 'my-12' : 'bg-white pb-6 pt-4'}`}>
            <div className="max-w-[1700px] mx-auto px-6">
                <div className={`relative w-full overflow-hidden rounded-[2.5rem] shadow-lg group/banner ${isSection ? 'aspect-[21/6] md:aspect-[32/8] lg:h-[300px]' : 'aspect-[21/9] md:aspect-[32/10] lg:h-[500px]'}`}>
                    {banners.map((banner, index) => (
                        <div
                            key={banner.id}
                            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                                }`}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={banner.imageUrl}
                                    alt={banner.title || "Promotional Banner"}
                                    fill
                                    className={`object-cover ${banner.title ? 'brightness-75' : 'brightness-100'} transition-transform duration-[2000ms] group-hover:scale-105 will-change-transform gpu`}
                                    priority={index === 0}
                                    sizes="100vw"
                                />

                                {/* Dynamic Text Overlay from Database */}
                                {banner.title && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-20">
                                        <div className={`transition-all duration-1000 transform delay-300 ${index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                            <h1 className={`${isSection ? 'text-xl md:text-3xl' : 'text-2xl md:text-5xl lg:text-7xl'} font-black text-white mb-4 drop-shadow-2xl tracking-tighter uppercase italic`}>
                                                {banner.title}
                                            </h1>
                                            {banner.subtitle && (
                                                <p className={`${isSection ? 'text-xs md:text-lg' : 'text-sm md:text-xl'} text-white/90 font-medium mb-8 max-w-2xl mx-auto drop-shadow-md`}>
                                                    {banner.subtitle}
                                                </p>
                                            )}
                                            <Link
                                                href={banner.link || '#'}
                                                className={`${isSection ? 'px-6 py-2 text-xs' : 'px-10 py-4 text-sm'} bg-white text-gray-900 rounded-full font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-2xl active:scale-95 inline-block`}
                                            >
                                                {banner.buttonText || "Discover More"}
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
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/banner:opacity-100 bg-white/20 hover:bg-white/40 p-4 rounded-full backdrop-blur-md transition-all border border-white/30"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover/banner:opacity-100 bg-white/20 hover:bg-white/40 p-4 rounded-full backdrop-blur-md transition-all border border-white/30"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    {/* Progress Indicators */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'bg-orange-600 w-12' : 'bg-white/30 w-4'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Gradient for Smooth Transition to Hero */}
                {!isSection && (
                    <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-100 to-transparent z-20" />
                )}
            </div>
        </div>
    );
}
