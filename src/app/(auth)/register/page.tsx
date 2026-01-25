'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { register } from '@/lib/actions/auth';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await register(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Start Your <br /><span className="text-orange-600">Legacy</span>
                </h1>
                <p className="text-gray-400 font-medium">Join the exclusive world of Thulasi Textiles.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 animate-in shake duration-500">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div className="relative group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-orange-600 transition-colors">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-orange-600 rounded-2xl pl-14 pr-6 py-5 outline-none transition-all font-bold text-gray-900"
                                placeholder="Your full name"
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-orange-600 transition-colors">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-orange-600 rounded-2xl pl-14 pr-6 py-5 outline-none transition-all font-bold text-gray-900"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block group-focus-within:text-orange-600 transition-colors">Secure Password</label>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-orange-600 rounded-2xl pl-14 pr-6 py-5 outline-none transition-all font-bold text-gray-900"
                                placeholder="Min. 8 characters"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-relaxed">
                        By registering, you agree to our Terms of Service and Privacy Policy regarding your heritage data.
                    </p>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-black hover:bg-orange-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-2xl group"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                            Create Collection Account
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center font-bold text-gray-400">
                Already part of the family? <Link href="/login" className="text-orange-600 hover:text-black transition-colors underline decoration-thickness-2">Secure Entry</Link>
            </p>
        </div>
    );
}
