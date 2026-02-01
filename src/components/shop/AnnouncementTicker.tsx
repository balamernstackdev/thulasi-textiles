'use client';

import { useState, useEffect } from 'react';

interface AnnouncementTickerProps {
    banners: {
        title: string | null;
        backgroundColor: string | null;
        textColor: string | null;
    }[];
}

export default function AnnouncementTicker({ banners }: AnnouncementTickerProps) {
    if (!banners || banners.length === 0) return null;

    const banner = banners[0]; // For simplicity, we use the first active announcement

    return (
        <div
            className="w-full h-10 flex items-center justify-center overflow-hidden relative z-[60]"
            style={{
                backgroundColor: banner.backgroundColor || '#000000',
                color: banner.textColor || '#ffffff'
            }}
        >
            <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-4 font-black uppercase tracking-normal md:tracking-[0.2em] text-[10px] md:text-xs w-max">
                {/* Original Set */}
                <div className="flex items-center gap-12">
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                </div>
                {/* Duplicated for seamless loop */}
                <div className="flex items-center gap-12">
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                    <span>{banner.title}</span>
                    <span className="w-1 h-1 rounded-full bg-current opacity-30" />
                </div>
            </div>
        </div>
    );
}
