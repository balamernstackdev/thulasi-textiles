'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Timer } from 'lucide-react';

interface CountdownBannerProps {
    banner: {
        imageUrl: string;
        title: string | null;
        subtitle: string | null;
        buttonText: string | null;
        link: string | null;
        countdownEndDate: Date | null;
        backgroundColor: string | null;
        textColor: string | null;
    };
}

export default function CountdownBanner({ banner }: CountdownBannerProps) {
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        if (!banner.countdownEndDate) return;

        const targetDate = new Date(banner.countdownEndDate).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [banner.countdownEndDate]);

    if (!timeLeft) return null;

    return (
        <section className="my-16 px-4 sm:px-8 md:px-12 lg:px-20 space-y-12">
            <div
                className="max-w-[1700px] mx-auto rounded-[3rem] overflow-hidden relative shadow-2xl border border-white/10"
                style={{ backgroundColor: banner.backgroundColor || '#000000' }}
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-[450px]">
                    {/* Visual Side */}
                    <div className="relative aspect-[21/9] md:aspect-[16/9] lg:aspect-auto">
                        <Image
                            src={banner.imageUrl}
                            alt={banner.title || "Sale Event"}
                            fill
                            className="object-cover brightness-75"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden" />
                    </div>

                    {/* Content Side */}
                    <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
                                <Timer className="w-3 h-3" /> Ends Soon
                            </div>
                            <h2
                                className="text-2xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.9]"
                                style={{ color: banner.textColor || '#ffffff' }}
                            >
                                {banner.title}
                            </h2>
                            <p className="text-white/70 font-medium max-w-md text-xs md:text-base">
                                {banner.subtitle}
                            </p>
                        </div>

                        {/* Timer Grid */}
                        <div className="flex gap-4 md:gap-6">
                            {[
                                { label: 'Days', value: timeLeft.days },
                                { label: 'Hrs', value: timeLeft.hours },
                                { label: 'Min', value: timeLeft.minutes },
                                { label: 'Sec', value: timeLeft.seconds }
                            ].map((unit, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className="w-12 h-12 md:w-20 md:h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
                                        <span className="text-lg md:text-3xl font-black text-white">{String(unit.value).padStart(2, '0')}</span>
                                    </div>
                                    <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-widest mt-2">{unit.label}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={banner.link || '#'}
                            className="px-8 py-3.5 md:px-10 md:py-5 bg-white text-black rounded-full font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all shadow-xl active:scale-95 text-[10px] md:text-xs inline-block"
                        >
                            {banner.buttonText || 'Grab Offer'}
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
