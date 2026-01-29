'use client';

import { Star, History, TrendingUp, Gift, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function RewardsClient({ loyaltyData }: { loyaltyData: any }) {
    const { points = 0, history = [] } = loyaltyData || {};

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Points Hero Card */}
            <div className="relative overflow-hidden bg-black rounded-[3rem] p-8 md:p-12 text-white shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl" />

                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-orange-400">Patron Rewards</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                            {points.toLocaleString()} <span className="text-orange-600">Points</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-medium max-w-sm">
                            You're a valued member of the Thulasi Collective. Earn more points with every purchase to unlock exclusive heritage rewards.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full md:w-auto">
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 flex items-center gap-6">
                            <TrendingUp className="w-8 h-8 text-orange-500" />
                            <div>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Exchange Rate</p>
                                <p className="text-lg font-black italic uppercase tracking-tight text-white">₹100 = 1 Point</p>
                            </div>
                        </div>
                        <button className="h-16 px-8 rounded-3xl bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-orange-600/20 flex items-center justify-center gap-2 group">
                            <Gift className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            Redeem Rewards
                        </button>
                    </div>
                </div>
            </div>

            {/* History Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <History className="w-5 h-5 text-gray-900" />
                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Transaction History</h3>
                </div>

                {history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((tx: any) => (
                            <div key={tx.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-xl hover:border-orange-100 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {tx.amount > 0 ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight group-hover:text-orange-600 transition-colors">{tx.description}</h4>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
                                            {format(new Date(tx.createdAt), 'MMM d, yyyy • p')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-black italic ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                                    </span>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Points</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 mx-auto text-gray-300">
                            <Star className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No transaction history found</p>
                        <p className="text-xs text-gray-300 font-bold mt-2 uppercase tracking-widest">Your first weave will earn you points</p>
                    </div>
                )}
            </div>
        </div>
    );
}
