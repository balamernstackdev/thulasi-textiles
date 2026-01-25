import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden antialiased">
            {/* Left: Form Side */}
            <div className="flex-1 flex flex-col p-8 lg:p-24 justify-center animate-in fade-in slide-in-from-left duration-1000">
                <div className="max-w-md w-full mx-auto space-y-12">
                    <Link href="/" className="flex flex-col items-center gap-6 group text-center transition-all">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl overflow-hidden p-3 ring-8 ring-gray-50/50 animate-bounce [animation-duration:3s] [animation-iteration-count:infinite] [animation-timing-function:ease-in-out]">
                            <Image
                                src="/logo.png"
                                alt="Thulasi Textiles Logo"
                                width={100}
                                height={100}
                                className="object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <span className="font-black text-4xl tracking-tighter italic uppercase block leading-none">
                                <span className="text-gray-300">Thulasi</span> <span className="text-orange-600">Textiles</span>
                            </span>
                            <span className="text-[11px] font-black text-orange-600 uppercase tracking-[0.6em] block">Women's World</span>
                        </div>
                    </Link>

                    {children}

                    <div className="pt-10 border-t border-gray-100">
                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] leading-relaxed">
                            © 2026 Thulasi Textiles. <br />
                            Handcrafted Heritage. Modern Elegance.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right: Visual Side */}
            <div className="hidden lg:block relative flex-1 animate-in fade-in duration-1000">
                <Image
                    src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000"
                    alt="Premium Textures"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-24 text-white">
                    <div className="max-w-xl space-y-6">
                        <span className="text-orange-500 font-black uppercase tracking-[0.5em] text-xs">Curated Collections</span>
                        <h2 className="text-6xl font-black leading-none tracking-tighter uppercase italic">
                            The Soul of <br /> <span className="text-orange-500 text-shadow-lg">Indian</span> Weaving
                        </h2>
                        <p className="text-white/80 text-lg font-medium leading-relaxed">
                            Join Thulasi Textiles and gain exclusive access to our handcrafted collections, artisan stories, and heritage patterns that define timeless elegance.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
