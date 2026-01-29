'use client';
import { useState, useRef, MouseEvent } from 'react';
import Image from 'next/image';

interface ProductImageZoomProps {
    src: string;
    alt: string;
}

export default function ProductImageZoom({ src, alt }: ProductImageZoomProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [backgroundPosition, setBackgroundPosition] = useState('0% 0%');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setBackgroundPosition(`${x}% ${y}%`);
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden cursor-crosshair bg-gray-50"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            {/* Base Image */}
            <Image
                src={src}
                alt={alt}
                fill
                className={`object-cover transition-opacity duration-300 ${isHovering ? 'opacity-0' : 'opacity-100'}`}
                priority
            />

            {/* Zoomed Image (Background) */}
            <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    backgroundImage: `url(${src})`,
                    backgroundPosition: backgroundPosition,
                    backgroundSize: '200%', // 2x Zoom
                    backgroundRepeat: 'no-repeat',
                }}
            />
        </div>
    );
}
