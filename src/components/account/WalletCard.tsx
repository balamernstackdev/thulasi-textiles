'use client';

import { Wallet, TrendingUp, History } from 'lucide-react';

export default function WalletCard({ user }: { user: any }) {
    const balance = Number(user?.walletBalance || 0);

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-100 transition-colors" />

            <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-md transition-all">
                        <Wallet className="w-5 h-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Thulasi Wallet</span>
                </div>

                <div>
                    <span className="text-4xl font-serif text-gray-900">₹{balance.toLocaleString()}</span>
                    <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Available to use
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50">
                <button className="w-full py-3 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors hover:bg-gray-50 rounded-xl">
                    <History className="w-4 h-4" />
                    Transaction History
                </button>
            </div>
        </div>
    );
}
