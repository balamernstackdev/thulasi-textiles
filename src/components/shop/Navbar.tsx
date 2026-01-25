'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, ShoppingCart, Menu, User, MapPin, X, ChevronRight, ChevronDown, Package } from 'lucide-react';
import { Category } from '@prisma/client';
import UserMenu from './UserMenu';

type CategoryWithChildren = Category & { children: Category[] };

export default function Navbar({ categories, session }: { categories: CategoryWithChildren[], session?: any }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
            {/* Top Bar */}
            <div className="bg-black text-[8px] md:text-[9px] font-black text-center py-2.5 px-4 text-white uppercase tracking-[0.2em] md:tracking-[0.3em] leading-tight">
                Discover Handcrafted Heritage | Free Shipping on Orders Over ₹2999
            </div>

            <div className="max-w-[1700px] mx-auto px-4 md:px-6">
                {/* Top Row: Logo, Search, Actions */}
                <div className="flex items-center justify-between py-4 lg:py-5 gap-4 md:gap-8">

                    {/* Logo & Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:gap-6 shrink-0">
                        <button
                            className="lg:hidden p-1.5 -ml-1 text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link href="/" className="flex flex-col items-center gap-1 group transition-all">
                            <div className="w-8 h-8 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md overflow-hidden p-1 ring-2 ring-gray-50 group-hover:ring-orange-50 transition-all">
                                <Image
                                    src="/logo.png"
                                    alt="Thulasi Textiles Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-none text-center">
                                <span className="text-[10px] md:text-sm font-black tracking-tighter uppercase italic">
                                    <span className="text-gray-400">Thulasi</span> <span className="text-orange-600">Textiles</span>
                                </span>
                                <span className="text-[6px] md:text-[7px] font-black text-orange-600 tracking-[0.2em] md:tracking-[0.3em] uppercase mt-0.5 whitespace-nowrap">Women's World</span>
                            </div>
                        </Link>
                    </div>

                    {/* Center: Search Bar */}
                    <div className="hidden lg:flex flex-1 justify-center px-10">
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const query = (e.currentTarget.elements.namedItem('q') as HTMLInputElement).value;
                            if (query.trim()) {
                                router.push(`/search?q=${encodeURIComponent(query)}`);
                            }
                        }} className="relative flex items-center w-full group max-w-4xl">
                            <input
                                type="text"
                                name="q"
                                placeholder="Search Thulasi Textiles..."
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-sm py-2.5 pl-4 pr-16 text-sm focus:outline-none focus:border-orange-600 transition-all font-medium placeholder:text-gray-400 shadow-sm"
                            />
                            <button type="submit" className="absolute right-0 top-0 bottom-0 bg-[#febd69] hover:bg-[#f3a847] text-black px-5 rounded-r-sm transition-all flex items-center justify-center">
                                <Search className="w-6 h-6" />
                            </button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <UserMenu session={session} />
                </div>

                {/* Bottom Row: Navigation Menu */}
                <div className="hidden lg:flex justify-center pb-2">
                    <nav className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <Link href="/" className="hover:text-black hover:bg-gray-50 px-5 py-3 rounded-xl transition-all">Home</Link>
                        {categories.slice(0, 7).map(cat => (
                            <div
                                key={cat.id}
                                className="relative group/menu"
                            >
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="px-5 py-3 rounded-xl transition-all flex items-center gap-2 font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 group-hover/menu:bg-black group-hover/menu:text-white"
                                >
                                    {cat.name}
                                    {cat.children && cat.children.length > 0 && (
                                        <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover/menu:rotate-180" />
                                    )}
                                </Link>

                                {cat.children && cat.children.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 invisible opacity-0 translate-y-2 group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 transition-all duration-300 z-50">
                                        <div className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] rounded-3xl border border-gray-50 p-3">
                                            <div className="flex flex-col">
                                                {cat.children.map((sub: Category) => (
                                                    <Link
                                                        key={sub.id}
                                                        href={`/category/${sub.slug}`}
                                                        className="px-5 py-3 hover:bg-orange-50 rounded-2xl text-gray-500 hover:text-orange-600 transition-all font-bold text-xs"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Side Menu */}
            {isMenuOpen && (
                <>
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setIsMenuOpen(false)} />
                    <div className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[70] overflow-y-auto shadow-2xl transition-all duration-500 animate-in slide-in-from-left">
                        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                            <span className="font-black text-xl text-gray-900 italic tracking-tighter uppercase">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="bg-gray-50 p-2 rounded-xl"><X className="w-6 h-6 text-gray-500" /></button>
                        </div>

                        <div className="p-8 space-y-8">
                            {!session ? (
                                <div className="grid grid-cols-2 gap-3">
                                    <Link
                                        href="/login"
                                        className="bg-gray-50 text-black py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-center"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Join
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="p-5 bg-orange-50 rounded-3xl space-y-2">
                                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Signed In As</p>
                                        <p className="text-lg font-black text-gray-900 truncate">{session.user.name}</p>
                                    </div>
                                    <Link
                                        href="/orders"
                                        className="flex items-center justify-between p-5 bg-white border border-gray-100 rounded-3xl group active:scale-95 transition-all shadow-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white">
                                                <Package className="w-5 h-5" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">My Archives</p>
                                                <p className="font-black text-gray-900 uppercase italic">My Orders</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-600 transition-colors" />
                                    </Link>
                                </div>
                            )}

                            <div>
                                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-6">Collections</h3>
                                <div className="space-y-2">
                                    {categories.map((cat) => {
                                        const hasChildren = cat.children && cat.children.length > 0;
                                        const isOpen = activeMobileCategory === cat.id;

                                        return (
                                            <div key={cat.id} className="space-y-1">
                                                <div
                                                    className={`flex justify-between items-center py-4 px-3 rounded-2xl cursor-pointer transition-all ${isOpen ? 'bg-orange-50 border border-orange-100' : 'hover:bg-gray-50'}`}
                                                    onClick={() => {
                                                        if (hasChildren) {
                                                            setActiveMobileCategory(isOpen ? null : cat.id);
                                                        } else {
                                                            setIsMenuOpen(false);
                                                            router.push(`/category/${cat.slug}`);
                                                            window.scrollTo(0, 0);
                                                        }
                                                    }}
                                                >
                                                    <span className={`font-bold transition-colors ${isOpen ? 'text-orange-600' : 'text-gray-900'}`}>
                                                        {cat.name}
                                                    </span>
                                                    {hasChildren && (
                                                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : 'text-gray-300'}`} />
                                                    )}
                                                </div>

                                                {hasChildren && isOpen && (
                                                    <div className="ml-4 pl-4 border-l border-orange-100 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <Link
                                                            href={`/category/${cat.slug}`}
                                                            className="block py-3 px-4 text-xs text-orange-600 font-black uppercase tracking-widest hover:bg-orange-50 rounded-xl transition-all"
                                                            onClick={() => {
                                                                setIsMenuOpen(false);
                                                                window.scrollTo(0, 0);
                                                            }}
                                                        >
                                                            View All {cat.name}
                                                        </Link>
                                                        {cat.children.map((sub: Category) => (
                                                            <Link
                                                                key={sub.id}
                                                                href={`/category/${sub.slug}`}
                                                                className="block py-3 px-4 text-sm text-gray-500 font-bold hover:text-orange-600 transition-colors"
                                                                onClick={() => {
                                                                    setIsMenuOpen(false);
                                                                    window.scrollTo(0, 0);
                                                                }}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
}
