'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { login } from '@/lib/actions/auth';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                    Welcome <br /><span className="text-orange-600">Back</span>
                </h1>
                <p className="text-gray-400 font-medium">Continue your heritage journey.</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border border-red-100 animate-in shake duration-500">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
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
                        <div className="flex justify-between items-center mb-2 px-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block group-focus-within:text-orange-600 transition-colors">Password</label>
                            <Link href="#" className="text-[9px] font-black text-gray-300 uppercase tracking-widest hover:text-orange-600 transition-colors">Forgot Password?</Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-orange-600 transition-colors" />
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-orange-600 rounded-2xl pl-14 pr-6 py-5 outline-none transition-all font-bold text-gray-900"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-black hover:bg-orange-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-2xl group"
                >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                            Login
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                    )}
                </button>
            </form>

            <p className="text-center font-bold text-gray-400">
                New to Thulasi? <Link href="/register" className="text-orange-600 hover:text-black transition-colors underline decoration-thickness-2">Create Account</Link>
            </p>
        </div>
    );
}
