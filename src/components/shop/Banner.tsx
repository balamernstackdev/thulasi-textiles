'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerProps {
    banners: {
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

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % banners.length);
        }, 8000); // Increased time for better readability
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
                        ? 'rounded-[2.5rem] shadow-lg aspect-[21/9] md:aspect-[32/8] lg:h-[350px]'
                        : 'h-[300px] md:h-[400px] lg:h-[500px] w-full'
                    }`}
                >
                    {banners.map((banner, index) => {
                        const isCenter = banner.alignment === 'CENTER';
                        const isRight = banner.alignment === 'RIGHT';
                        const bannerTextColor = banner.textColor || '#ffffff';

                        return (
                            <div
                                key={index}
                                className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                            >
                                <div className="relative w-full h-full overflow-hidden">
                                    {/* Video Background Support */}
                                    {banner.videoUrl ? (
                                        <video
                                            src={banner.videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className={`absolute inset-0 w-full h-full object-cover brightness-75 transition-transform duration-[10000ms] ${index === currentIndex ? 'scale-110' : 'scale-100'}`}
                                        />
                                    ) : (
                                        <Image
                                            src={banner.imageUrl}
                                            alt={banner.title || "Promotional Banner"}
                                            fill
                                            className={`object-cover object-top md:object-top ${banner.title ? 'brightness-75 md:brightness-90' : 'brightness-100'} transition-transform duration-[8000ms] ${index === currentIndex ? 'scale-110' : 'scale-100'} will-change-transform`}
                                            priority={index === 0}
                                            sizes="100vw"
                                        />
                                    )}

                                    {/* Glassmorphic Gradient Overlays */}
                                    <div className={`absolute inset-0 z-10 
                                        ${isCenter
                                            ? 'bg-black/30 backdrop-blur-[1px]'
                                            : isRight
                                                ? 'bg-gradient-to-l from-black/70 via-black/30 to-transparent'
                                                : 'bg-gradient-to-r from-black/70 via-black/30 to-transparent'
                                        }`}
                                    />

                                    {/* Dynamic Text Overlay */}
                                    {banner.title && (
                                        <div className={`absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-24 z-20 max-w-[1700px] mx-auto
                                            ${isCenter ? 'items-center text-center' : isRight ? 'items-end text-right' : 'items-start text-left'}`}
                                        >
                                            <div className={`transition-all duration-1000 transform delay-300 
                                                ${index === currentIndex
                                                    ? 'translate-y-0 opacity-100'
                                                    : 'translate-y-12 opacity-0'}`}
                                            >
                                                <h1
                                                    className={`${isSection ? 'text-xl md:text-4xl' : 'text-3xl md:text-6xl lg:text-8xl'} font-black mb-3 md:mb-4 drop-shadow-2xl tracking-tighter uppercase italic leading-[0.85] max-w-4xl`}
                                                    style={{ color: bannerTextColor }}
                                                >
                                                    {banner.title}
                                                </h1>
                                                {banner.subtitle && (
                                                    <p
                                                        className={`${isSection ? 'text-[10px] md:text-lg' : 'text-xs md:text-2xl'} font-medium mb-6 md:mb-10 max-w-2xl drop-shadow-lg tracking-tight opacity-90`}
                                                        style={{ color: bannerTextColor }}
                                                    >
                                                        {banner.subtitle}
                                                    </p>
                                                )}
                                                <Link
                                                    href={banner.link || '#'}
                                                    className={`${isSection ? 'px-6 py-2.5 text-[10px]' : 'px-8 py-3.5 md:px-12 md:py-5 text-[10px] md:text-sm'} bg-white text-gray-900 rounded-full font-black uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] active:scale-95 inline-block hover:-translate-y-1`}
                                                >
                                                    {banner.buttonText || "Discover Collection"}
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* Navigation Arrows */}
                    {banners.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="absolute left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-xl text-white border border-white/20 opacity-0 md:group-hover/banner:opacity-100 hover:bg-orange-600 transition-all duration-500"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 flex items-center justify-center rounded-full bg-black/10 backdrop-blur-xl text-white border border-white/20 opacity-0 md:group-hover/banner:opacity-100 hover:bg-orange-600 transition-all duration-500"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    {/* Elegant Progress Indicators */}
                    {banners.length > 1 && (
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 hidden md:flex space-x-4">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1.5 rounded-full transition-all duration-700 ${index === currentIndex ? 'bg-orange-600 w-12' : 'bg-white/30 w-6 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Aesthetic Gradient for Page Transition */}
                {!isSection && (
                    <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#F2F2F2] via-[#F2F2F2]/60 to-transparent z-20 pointer-events-none" />
                )}
            </div>
        </div>
    );
}
