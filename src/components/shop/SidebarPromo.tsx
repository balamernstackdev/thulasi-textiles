'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface SidebarPromoProps {
    banner: {
        imageUrl: string;
        title: string | null;
        subtitle: string | null;
        link: string | null;
        backgroundColor: string | null;
        textColor: string | null;
    };
}

export default function SidebarPromo({ banner }: SidebarPromoProps) {
    return (
        <Link
            href={banner.link || '#'}
            className="group relative block w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl border border-white/10"
            style={{ backgroundColor: banner.backgroundColor || '#000000' }}
        >
            <Image
                src={banner.imageUrl}
                alt={banner.title || "Promotion"}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 brightness-75 group-hover:brightness-50"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                <div className="space-y-4">
                    <h3
                        className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-none"
                        style={{ color: banner.textColor || '#ffffff' }}
                    >
                        {banner.title}
                    </h3>
                    <p className="text-white/70 text-sm font-bold line-clamp-2">
                        {banner.subtitle}
                    </p>
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white border-b-2 border-orange-600 pb-1 group-hover:gap-4 transition-all">
                        Discover <ArrowRight className="w-3 h-3 text-orange-600" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
