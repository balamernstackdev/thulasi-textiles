'use client';

import { useState } from 'react';
import { Copy, Gift, Share2 } from 'lucide-react';

export default function ReferralCard({ user }: { user: any }) {
    const [copied, setCopied] = useState(false);

    // If no code exists (for old users), we might show a "Generate" button,
    // but for now let's assume we pass a default or handle null.
    // In a real app, we'd fire an action to create one if missing.
    // Use deterministic fallback to prevent hydration mismatch
    const referralCode = user?.referralCode || `THULASI-${(user?.id || 'GIFT').slice(-4).toUpperCase()}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(`Use my code ${referralCode} to get ₹500 off at Thulasi Textiles!`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <div className="space-y-4 max-w-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
                            <Gift className="w-5 h-5 text-indigo-300" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Refer & Earn</span>
                    </div>
                    <h3 className="text-2xl font-serif">Gift ₹500, Get ₹500</h3>
                    <p className="text-sm text-indigo-200/80 leading-relaxed">
                        Share the heritage of Thulasi Textiles. When a friend uses your code, they get ₹500 off their first order, and you earn ₹500 in credits.
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl flex items-center gap-2 border border-white/10">
                    <div className="px-6 py-3 rounded-xl bg-indigo-950/50 border border-white/5">
                        <span className="font-mono text-lg font-bold tracking-wider text-indigo-200">{referralCode}</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-3.5 hover:bg-white text-indigo-200 hover:text-indigo-900 rounded-xl transition-all active:scale-95"
                    >
                        {copied ? <span className="font-black text-xs uppercase">Copied</span> : <Copy className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
