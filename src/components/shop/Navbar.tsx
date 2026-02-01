'use client'
import Link from 'next/link';
import NextImage from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, MapPin, ChevronRight, Package, Loader2 } from 'lucide-react';
import Icon from '@/components/ui/Icon';
import { motion, AnimatePresence } from 'framer-motion';
import { Category } from '@prisma/client';
import UserMenu from './UserMenu';
import MegaMenu from './MegaMenu';
import SearchDropdown from './SearchDropdown';
import { getQuickSearch } from '@/lib/actions/product';
import { getWishlist } from '@/lib/actions/wishlist';
import { useWishlistStore } from '@/lib/store/wishlist';
import AnnouncementTicker from './AnnouncementTicker';
import NotificationBell from '@/components/shared/NotificationBell';



type CategoryWithChildren = Category & { children: Category[] };

export default function Navbar({ categories, session, announcements = [] }: { categories: CategoryWithChildren[], session?: any, announcements?: any[] }) {
    console.log('[Navbar] Received categories:', categories?.length || 0);
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeMobileCategory, setActiveMobileCategory] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Search Suggestions State
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const setWishlist = useWishlistStore(state => state.setWishlist);
    const isSynced = useWishlistStore(state => state.isSynced);
    const isHydrated = useWishlistStore(state => state.isHydrated);
    const syncInProgress = useRef(false);

    // Sync Wishlist on mount/session change
    useEffect(() => {
        if (session && !isSynced && isHydrated && !syncInProgress.current) {
            const syncWishlist = async () => {
                syncInProgress.current = true;
                try {
                    const result = await getWishlist();
                    if (result.success && result.data) {
                        const ids = result.data.map((item: any) => item.productId);
                        setWishlist(ids);
                    }
                } finally {
                    syncInProgress.current = false;
                }
            };
            syncWishlist();
        } else if (!session) {
            setWishlist([]);
        }
    }, [session, setWishlist, isSynced, isHydrated]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search suggestions logic for Mobile Menu
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length >= 2) {
                setIsLoadingSuggestions(true);
                const result = await getQuickSearch(searchQuery);
                if (result.success) {
                    setSuggestions(result.data);
                    setShowSuggestions(true);
                }
                setIsLoadingSuggestions(false);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Close menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);


    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 w-full">
            {/* Dynamic Announcement Bar - Absolute Top */}
            {announcements.length > 0 && <AnnouncementTicker banners={announcements} />}

            <div className="max-w-[1700px] mx-auto px-5 md:px-12 lg:px-16">
                {/* Top Row: Logo, Search, Actions */}
                <div className="flex items-center justify-between py-3 md:py-8 gap-3 md:gap-10 min-h-[56px] md:min-h-[80px]">

                    {/* Logo & Mobile Menu Button */}
                    <div className="flex items-center gap-2 md:gap-5 shrink-0">
                        <button
                            className="lg:hidden p-2 -ml-1 text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2 md:gap-4 group transition-all">
                            <div className="w-8 h-8 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md md:shadow-lg overflow-hidden p-1 md:p-1.5 ring-2 md:ring-4 ring-gray-50 group-hover:ring-orange-100 transition-all">
                                <NextImage
                                    src="/logo.png"
                                    alt="Thulasi Textiles Logo"
                                    width={32}
                                    height={32}
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <div className="flex items-baseline gap-1 md:gap-2">
                                    <span className="text-xs xs:text-sm md:text-2xl font-black tracking-tighter uppercase">
                                        <span className="text-gray-900">Thulasi</span> <span className="text-orange-600">Textiles</span>
                                    </span>
                                </div>
                                <span className="text-[5px] md:text-[9px] font-black text-orange-600 tracking-[0.2em] md:tracking-[0.5em] uppercase mt-0.5 md:mt-1 whitespace-nowrap hidden xs:block">Women's World</span>
                            </div>
                        </Link>
                    </div>

                    <div className="hidden lg:flex flex-1 justify-center px-4 md:px-12 relative">
                        <div className="relative w-full max-w-2xl group" ref={searchRef as any}>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => setIsSearchOpen(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchQuery.trim()) {
                                        // Save to recent
                                        const recent = JSON.parse(localStorage.getItem('thulasi_recent_searches') || '[]');
                                        if (!recent.includes(searchQuery.trim())) {
                                            const updated = [searchQuery.trim(), ...recent].slice(0, 5);
                                            localStorage.setItem('thulasi_recent_searches', JSON.stringify(updated));
                                        }
                                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        setIsSearchOpen(false);
                                    }
                                }}
                                placeholder="Search Thulasi Textiles..."
                                className="w-full bg-gray-50 text-gray-900 border-2 border-gray-100 rounded-full py-4 pl-8 pr-16 text-sm font-semibold shadow-xl shadow-gray-200/20 outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-400"
                            />
                            <button
                                onClick={() => {
                                    if (searchQuery.trim()) {
                                        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                        setIsSearchOpen(false);
                                    }
                                }}
                                className="absolute right-2 top-2 bottom-2 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-full transition-all flex items-center justify-center shadow-xl shadow-orange-600/20 active:scale-95"
                            >
                                <Icon name="search" className="w-5 h-5" />
                            </button>

                            <SearchDropdown
                                isOpen={isSearchOpen}
                                query={searchQuery}
                                onClose={() => setIsSearchOpen(false)}
                            />
                        </div>
                    </div>

                    {/* Right Actions - Compact for mobile */}
                    <div className="flex items-center gap-0.5 sm:gap-2 shrink-0">
                        {session?.user?.id && <NotificationBell userId={session.user.id} />}
                        <UserMenu session={session} />
                    </div>

                </div>


                {/* Bottom Row: Navigation Menu */}
                <div className="hidden lg:flex justify-center pb-4">
                    <nav className="flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">
                        <Link href="/" className="hover:text-black hover:bg-gray-50 px-5 py-3 rounded-xl transition-all">Home</Link>
                        {categories.slice(0, 7).map(cat => (
                            <div
                                key={cat.id}
                                className="relative group/menu"
                            >
                                <Link
                                    href={`/category/${cat.slug}`}
                                    className="px-6 py-3.5 rounded-full transition-all flex items-center gap-2 font-black uppercase tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 group-hover/menu:bg-gray-950 group-hover/menu:text-white"
                                >
                                    {cat.name}
                                    {cat.children && cat.children.length > 0 && (
                                        <Icon name="chevron-down" className="w-3 h-3 transition-transform duration-300 group-hover/menu:rotate-180" />
                                    )}
                                </Link>

                                {cat.children && cat.children.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 invisible opacity-0 translate-y-2 group-hover/menu:visible group-hover/menu:opacity-100 group-hover/menu:translate-y-0 transition-all duration-300 z-50 ease-out">
                                        <MegaMenu category={cat} onClick={() => setIsMenuOpen(false)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Side Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="fixed inset-0 z-[60]">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[70] overflow-y-auto shadow-2xl"
                        >
                            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                                <span className="font-black text-xl text-gray-900 italic tracking-tighter uppercase">Menu</span>
                                <button onClick={() => setIsMenuOpen(false)} className="bg-gray-50 p-2 rounded-xl"><Icon name="x" className="w-6 h-6 text-gray-500" /></button>
                            </div>

                            <div className="p-8 space-y-8">
                                {/* Mobile Search */}
                                <div className="relative">
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search products..."
                                            className="w-full bg-gray-50 text-gray-900 border border-gray-100 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-orange-600 transition-all font-bold placeholder:text-gray-400 uppercase tracking-widest text-[10px]"
                                        />
                                        <button
                                            onClick={() => {
                                                if (searchQuery.trim()) {
                                                    setIsMenuOpen(false);
                                                    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                                                }
                                            }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                                        >
                                            <Icon name="search" className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Mobile Suggestions */}
                                    {showSuggestions && searchQuery.length >= 2 && (suggestions.length > 0 || isLoadingSuggestions) && (
                                        <div className="absolute top-[calc(100%+4px)] left-0 right-0 bg-white shadow-xl rounded-2xl border border-gray-50 overflow-hidden z-[80] animate-in fade-in slide-in-from-top-2 duration-200">
                                            {suggestions.length > 0 ? (
                                                <div className="max-h-[300px] overflow-y-auto">
                                                    {suggestions.map((product) => (
                                                        <Link
                                                            key={product.id}
                                                            href={`/product/${product.slug}`}
                                                            onClick={() => {
                                                                setIsMenuOpen(false);
                                                                setSearchQuery('');
                                                            }}
                                                            className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 border-b border-gray-50 last:border-0"
                                                        >
                                                            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                                <NextImage src={product.images[0]?.url || ''} alt={product.name} width={40} height={40} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="text-[10px] font-black uppercase tracking-tight truncate flex-1">{product.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center">
                                                    <Loader2 className="w-4 h-4 animate-spin mx-auto text-orange-600" />
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

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
                                                            <Icon name="chevron-down" className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-orange-600' : 'text-gray-300'}`} />
                                                        )}
                                                    </div>

                                                    {hasChildren && isOpen && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="ml-4 pl-4 border-l border-orange-100 space-y-1 overflow-hidden"
                                                        >
                                                            <Link
                                                                href={`/category/${cat.slug}`}
                                                                className="block py-3 px-4 text-xs text-orange-600 font-black uppercase tracking-widest hover:bg-orange-50 rounded-xl transition-all"
                                                                onClick={() => {
                                                                    setIsMenuOpen(false);
                                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                                    }}
                                                                >
                                                                    {sub.name}
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header >
    );
}
