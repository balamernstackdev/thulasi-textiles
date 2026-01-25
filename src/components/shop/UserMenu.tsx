'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Heart, LogOut, ChevronDown, Settings } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';

export default function UserMenu({ session }: { session: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    if (!session) {
        return (
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
                    <ShoppingBag className="w-6 h-6 text-gray-700" />
                </Link>
                <Link
                    href="/login"
                    className="hidden sm:block text-[11px] font-black text-gray-700 hover:text-orange-600 transition-colors uppercase tracking-[0.2em] px-4 py-2"
                >
                    Login
                </Link>
                <Link
                    href="/register"
                    className="bg-black hover:bg-orange-600 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95"
                >
                    Register
                </Link>
            </div>
        );
    }

    const { user } = session;

    const handleLogout = async () => {
        await logout();
        router.refresh();
        router.push('/');
    };

    return (
        <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors group">
                <ShoppingBag className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors group">
                <Heart className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" />
            </Link>

            {/* User Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-white border border-gray-100 rounded-2xl transition-all group"
                >
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xs">
                        {user.name?.[0].toUpperCase()}
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">{user.name}</p>
                        <p className="text-[8px] font-bold text-gray-400 leading-none mt-1">Member</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] border border-gray-50 py-4 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="px-6 py-4 border-b border-gray-50 mb-2">
                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Authenticated Account</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                            </div>

                            <Link
                                href="/profile"
                                className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-bold text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <User className="w-5 h-5" />
                                My Profile
                            </Link>

                            <Link
                                href="/orders"
                                className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-bold text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <ShoppingBag className="w-5 h-5" />
                                My Orders
                            </Link>

                            <Link
                                href="/wishlist"
                                className="flex items-center gap-4 px-6 py-3 text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors font-bold text-sm"
                                onClick={() => setIsOpen(false)}
                            >
                                <Heart className="w-5 h-5" />
                                Wishlist
                            </Link>

                            {user.role === 'ADMIN' && (
                                <Link
                                    href="/admin"
                                    className="flex items-center gap-4 px-6 py-3 text-emerald-600 hover:bg-emerald-50 transition-colors font-bold text-sm"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Settings className="w-5 h-5" />
                                    Admin Dashboard
                                </Link>
                            )}

                            <div className="mt-2 pt-2 border-t border-gray-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-6 py-3 text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
