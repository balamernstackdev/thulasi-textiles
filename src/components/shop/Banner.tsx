'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerProps {
    banners: {
        mobileImageUrl?: string | null;
        id: string;
        imageUrl: string;
        videoUrl?: string | null;
        title: string | null;
        subtitle: string | null;
        buttonText: string | null;
        link: string | null;
        type: string;
        isActive: boolean;
        order: number;
        alignment?: 'LEFT' | 'CENTER' | 'RIGHT' | null;
        backgroundColor?: string | null;
        textColor?: string | null;
    }[];
    type?: 'main' | 'section';
}

export default function Banner({ banners, type = 'main' }: BannerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovering, setIsHovering] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const isSection = type === 'section';
    const autoPlayDelay = 5000;

    useEffect(() => {
        if (banners.length <= 1 || isHovering) return;
        const interval = setInterval(() => {
            nextSlide();
        }, autoPlayDelay);
        return () => clearInterval(interval);
    }, [banners.length, isHovering, currentIndex]);

    if (!banners || banners.length === 0) return null;

    const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) nextSlide();
        if (touchEndX.current - touchStartX.current > 50) prevSlide();
    };

    return (
        <div
            className={`relative w-full overflow-hidden group/banner ${isSection ? 'my-6' : 'bg-gray-100'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className={`${isSection ? 'container mx-auto px-4 md:px-0' : 'w-full'}`}>
                {/* Carousel Container - Compact Height */}
                <div
                    className={`relative w-full overflow-hidden ${isSection ? 'rounded-xl shadow-lg h-[250px] md:h-[300px]' : 'h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px]'}`}
                >
                    <div
                        className="flex w-full h-full transition-transform duration-500 ease-out will-change-transform"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {banners.map((banner, index) => {
                            return (
                                <div
                                    key={index}
                                    className="relative min-w-full h-full flex-shrink-0 bg-gray-200"
                                >
                                    {/* Image Layer - Clean, No Overlays */}
                                    {banner.videoUrl ? (
                                        <video
                                            src={banner.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <>
                                            {/* Responsive Image support */}
                                            <div className="absolute inset-0 block md:hidden">
                                                <Image
                                                    src={banner.mobileImageUrl || banner.imageUrl}
                                                    alt={banner.title || "Promotional Banner"}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                    sizes="100vw"
                                                />
                                            </div>
                                            <div className="absolute inset-0 hidden md:block">
                                                <Image
                                                    src={banner.imageUrl}
                                                    alt={banner.title || "Promotional Banner"}
                                                    fill
                                                    className="object-cover"
                                                    priority={index === 0}
                                                    sizes="100vw"
                                                />
                                            </div>
                                        </>
                                    )}

                                    {/* Minimal Text Overlay - Transparent Style */}
                                    {banner.title && (
                                        <div className={`absolute inset-0 flex flex-col justify-center p-6 md:p-16 z-20 pointer-events-none
                                            ${banner.alignment === 'CENTER' ? 'items-center text-center bg-gradient-to-b from-black/40 via-transparent to-black/40' :
                                                banner.alignment === 'RIGHT' ? 'items-end text-right bg-gradient-to-l from-black/60 via-transparent to-transparent' :
                                                    'items-start text-left bg-gradient-to-r from-black/60 via-transparent to-transparent'}
                                        `}>
                                            <div className="pointer-events-auto max-w-2xl bg-black/10 backdrop-blur-[1px] p-4 rounded-lg md:bg-transparent md:backdrop-blur-none md:p-0">
                                                <h2 className="text-2xl md:text-5xl font-black text-white mb-2 tracking-tight uppercase drop-shadow-lg leading-tight">
                                                    {banner.title}
                                                </h2>
                                                {banner.subtitle && (
                                                    <p className="text-sm md:text-xl font-bold text-white/90 mb-6 drop-shadow-md">
                                                        {banner.subtitle}
                                                    </p>
                                                )}
                                                <Link
                                                    href={banner.link || '#'}
                                                    className="inline-block bg-white text-black px-5 py-2 md:px-8 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-wider rounded-sm shadow-lg hover:bg-gray-100 transition-transform hover:scale-105"
                                                >
                                                    {banner.buttonText || "Shop Now"}
                                                </Link>
                                            </div>
                                        </div>
                                    )}

                                    {/* Clickable Area for Link */}
                                    <Link href={banner.link || '#'} className="absolute inset-0 z-10" aria-label={banner.title || 'Banner Link'} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Arrows - Auto Hidden */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="absolute left-0 top-0 bottom-0 z-30 w-12 md:w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/10 focus:outline-none"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="absolute right-0 top-0 bottom-0 z-30 w-12 md:w-16 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/10 focus:outline-none"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-8 h-8 md:w-10 md:h-10 text-white drop-shadow-lg" />
                            </button>
                        </>
                    )}

                    {/* Simple Dots - Adjusted bottom position to avoid overlap */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                    className={`h-1 rounded-full transition-all shadow-sm ${index === currentIndex ? 'bg-white w-6 md:w-8' : 'bg-white/50 w-1.5 md:w-2 hover:bg-white'}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
