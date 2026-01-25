'use client';

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
    products: any[];
    title?: string;
    session?: any;
}

export default function ProductCarousel({ products, title, session }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 10);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScroll);
            checkScroll(); // Initial check

            // Re-check on window resize
            window.addEventListener('resize', checkScroll);
        }
        return () => {
            if (container) container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, [products]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8;

        container.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    if (!products.length) return null;

    return (
        <div className="relative group/carousel py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                        {title || "Products related to this item"}
                    </h2>
                    <p className="text-[11px] text-gray-500 uppercase tracking-widest font-black mt-1">
                        Page 1 of {Math.ceil(products.length / 4)}
                    </p>
                </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 z-20">
                {showLeftArrow && (
                    <button
                        onClick={() => scroll('left')}
                        className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.15)] border border-gray-200 -ml-4 hover:scale-110 transition-all flex items-center justify-center"
                        aria-label="Scroll Left"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-0 z-20">
                {showRightArrow && (
                    <button
                        onClick={() => scroll('right')}
                        className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-md shadow-[0_2px_5px_rgba(0,0,0,0.15)] border border-gray-200 -mr-4 hover:scale-110 transition-all flex items-center justify-center"
                        aria-label="Scroll Right"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="min-w-[180px] md:min-w-[210px] lg:min-w-[230px] snap-start"
                    >
                        <ProductCard product={product} session={session} />
                    </div>
                ))}
            </div>

            {/* Subtle bottom gradient/line */}
            <div className="mt-8 border-b border-gray-100" />
        </div>
    );
}
