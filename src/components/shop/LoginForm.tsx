'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Github, Chrome, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            router.push('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
            {/* Visual Side - Hidden on mobile */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative p-12 lg:p-20 flex-col justify-between overflow-hidden">
                {/* Background Image with Overlay */}
                <Image
                    src="/auth_textile_bg.png"
                    alt="Premium Textiles"
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-orange-900/40" />

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="bg-white p-2 rounded-2xl">
                            <Image src="/logo.png" alt="Logo" width={100} height={40} className="h-8 w-auto grayscale" />
                        </div>
                    </Link>
                </div>

                <div className="relative z-10 space-y-8">
                    <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
                        Welcome <br /> <span className="text-orange-500">Back</span> to <br /> Heritage
                    </h1>
                    <p className="text-white/70 text-lg font-medium max-w-md">
                        Sign in to access your curated collections, track orders, and experience the finest in textile craftsmanship.
                    </p>
                    <div className="flex items-center gap-4 py-4">
                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl flex flex-col gap-1 items-center">
                            <ShieldCheck className="w-8 h-8 text-orange-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Secure Entry</span>
                        </div>
                        <div className="text-white/60 text-xs font-bold leading-tight">
                            Your data is encrypted <br /> with industry standard <br /> security protocols.
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">
                    <span>Thulasi Textiles Est. 1998</span>
                    <span className="w-12 h-px bg-white/20" />
                    <span>Pure Heritage</span>
                </div>
            </div>

            {/* Form Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-white relative">
                {/* Mobile Logo Only */}
                <div className="md:hidden absolute top-8 left-1/2 -translate-x-1/2">
                    <Image src="/logo.png" alt="Logo" width={120} height={50} className="h-10 w-auto" />
                </div>

                <div className="w-full max-w-[420px] pt-12 md:pt-0">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-3 italic">Sign In</h2>
                        <p className="text-gray-500 font-medium">Please enter your details to continue</p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 text-rose-600 text-sm p-4 rounded-2xl mb-8 border border-rose-100 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all shadow-sm focus:ring-4 focus:ring-orange-500/5 placeholder:text-gray-400"
                                    placeholder="name@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Password</label>
                                <Link href="#" className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline">Forgot Password?</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-orange-500/20 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-gray-900 outline-none transition-all shadow-sm focus:ring-4 focus:ring-orange-500/5 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group w-full bg-gray-900 hover:bg-black text-white py-5 rounded-[2rem] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? 'Authenticating...' : (
                                <>
                                    Log In
                                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="my-10 flex items-center gap-4">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Or sign in with</span>
                        <div className="h-px flex-1 bg-gray-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-sm text-gray-700">
                            <Chrome className="w-5 h-5 text-gray-400" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-sm text-gray-700">
                            <Github className="w-5 h-5 text-gray-400" />
                            Github
                        </button>
                    </div>

                    <p className="text-center mt-12 text-sm font-bold text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-orange-600 hover:underline">
                            Create one now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
