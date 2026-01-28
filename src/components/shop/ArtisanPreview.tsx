'use client';

import { MapPin, Award, History, ShieldCheck, User } from 'lucide-react';
import Image from 'next/image';

interface Artisan {
    name: string;
    bio: string | null;
    village: string | null;
    experienceYears: number | null;
    imageUrl: string | null;
    specialty: string | null;
}

export default function ArtisanPreview({ artisan }: { artisan: Artisan | null }) {
    if (!artisan) return null;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/40 relative overflow-hidden group">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:bg-orange-100/50 transition-colors" />

            <div className="relative">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                        <Award className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] italic">The Weaver's Mark</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative shrink-0">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-2xl bg-gray-50">
                            {artisan.imageUrl ? (
                                <Image
                                    src={artisan.imageUrl}
                                    alt={artisan.name}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <User className="w-12 h-12" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <div>
                            <h4 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">
                                {artisan.name}
                            </h4>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <MapPin className="w-3 h-3 text-orange-600" />
                                    {artisan.village || 'Heritage Hub'}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    <History className="w-3 h-3 text-orange-600" />
                                    {artisan.experienceYears}+ Years Crafting
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-3">
                            {artisan.bio || "A dedicated master of traditional weaving, preserving centuries of heritage through every meticulously hand-crafted piece."}
                        </p>

                        <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Specialty:</span>
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full">
                                {artisan.specialty || 'Fine Silk Weaving'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
