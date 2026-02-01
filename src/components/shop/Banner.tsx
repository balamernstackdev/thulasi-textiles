'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

const BLUR_DATA_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

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

    const slideRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: slideRef,
        offset: ["start start", "end start"]
    });

    const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const yTextRange = typeof window !== 'undefined' && window.innerWidth < 768 ? ["0%", "-15%"] : ["0%", "-40%"];
    const yText = useTransform(scrollYProgress, [0, 1], yTextRange);
    const opacityVeil = useTransform(scrollYProgress, [0, 0.8], [0, 0.6]);

    return (
        <div
            ref={slideRef}
            className={`relative w-full overflow-hidden group/banner ${isSection ? 'my-6' : 'bg-[#111]'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className={`${isSection ? 'container mx-auto px-4 md:px-0' : 'w-full'}`}>
                {/* Carousel Container */}
                <div
                    className={`relative w-full overflow-hidden ${isSection ? 'rounded-xl shadow-lg h-[250px] md:h-[350px]' : 'h-[350px] md:h-[500px] lg:h-[600px]'}`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <label className="sr-only">Slide {currentIndex + 1}</label>
                            <div className="relative w-full h-full">
                                {/* Layer 1: Media (Parallaxed) */}
                                <motion.div
                                    className="absolute inset-0 w-full h-full"
                                    style={{ y: yImg, scale: 1.1 }}
                                >
                                    {banners[currentIndex].videoUrl ? (
                                        <video
                                            src={banners[currentIndex].videoUrl}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Image
                                            src={banners[currentIndex].imageUrl}
                                            alt={banners[currentIndex].title || "Promotional Banner"}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="100vw"
                                        />
                                    )}
                                    {/* Subtle Veil Layer - Increased base opacity for contrast */}
                                    <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000
                                        ${banners[currentIndex].alignment === 'CENTER' ? 'bg-black/30' :
                                            banners[currentIndex].alignment === 'RIGHT' ? 'bg-gradient-to-l from-black/70 via-black/20 to-transparent' :
                                                'bg-gradient-to-r from-black/70 via-black/20 to-transparent'}
                                    `} />
                                    <motion.div
                                        style={{ opacity: opacityVeil }}
                                        className="absolute inset-0 bg-black pointer-events-none"
                                    />
                                </motion.div>

                                {/* Layer 2: Text Overlay (Parallaxed) */}
                                {banners[currentIndex].title && (
                                    <motion.div
                                        style={{ y: yText }}
                                        className={`absolute inset-0 flex flex-col justify-center p-4 xs:p-6 md:p-24 z-20 pointer-events-none
                                            ${banners[currentIndex].alignment === 'CENTER' ? 'items-center text-center' :
                                                banners[currentIndex].alignment === 'RIGHT' ? 'items-end text-right' :
                                                    'items-start text-left'}
                                        `}
                                    >
                                        <div className={`pointer-events-auto max-w-4xl ${isSection ? 'space-y-1' : 'space-y-2 md:space-y-4'}`}>
                                            <motion.p
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.2, duration: 0.8 }}
                                                className="text-white/60 font-black uppercase tracking-[0.5em] text-[10px] md:text-xs mb-4"
                                            >
                                                Heritage Excellence
                                            </motion.p>
                                            <motion.h2
                                                initial={{ y: 30, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.4, duration: 0.8 }}
                                                className={`${isSection ? 'text-2xl xs:text-3xl' : 'text-3xl xs:text-4xl'} md:text-8xl lg:text-[8rem] font-serif italic text-white mb-2 leading-[0.85]`}
                                            >
                                                {banners[currentIndex].title}
                                            </motion.h2>
                                            {banners[currentIndex].subtitle && (
                                                <motion.p
                                                    initial={{ y: 20, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: 0.6, duration: 0.8 }}
                                                    className="text-[10px] xs:text-xs md:text-2xl font-black text-white/80 uppercase tracking-widest max-w-2xl"
                                                >
                                                    {banners[currentIndex].subtitle}
                                                </motion.p>
                                            )}
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: 0.8, duration: 0.8 }}
                                                className="pt-8"
                                            >
                                                <Link
                                                    href={banners[currentIndex].link || '#'}
                                                    className="group/btn relative inline-flex items-center gap-4 bg-white text-black px-6 py-3 md:px-12 md:py-5 text-[9px] md:text-xs font-black uppercase tracking-[0.3em] overflow-hidden"
                                                >
                                                    <span className="relative z-10 transition-colors group-hover/btn:text-white">{banners[currentIndex].buttonText || "Explore Collection"}</span>
                                                    <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.19,1,0.22,1]" />
                                                    <ChevronRight className="relative z-10 w-4 h-4 transition-colors group-hover/btn:text-white" />
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

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
