'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function MobileBottomNav({ session }: { session: any }) {
    const pathname = usePathname();
    const { items } = useCartStore();
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const navItems = [
        { label: 'Home', icon: Home, href: '/' },
        { label: 'Shop', icon: Grid, href: '/category/all' },
        { label: 'Cart', icon: ShoppingBag, href: '/cart', badge: cartCount },
        { label: 'Wishlist', icon: Heart, href: '/wishlist' },
        { label: 'Profile', icon: User, href: session ? '/profile' : '/login' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-gray-100 pb-safe-area-inset-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-16 px-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex flex-col items-center justify-center gap-1 relative group flex-1"
                        >
                            <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 -translate-y-1' : 'text-gray-400 group-hover:text-gray-900 group-hover:bg-gray-50'}`}>
                                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                            </div>

                            {item.badge !== undefined && item.badge > 0 && (
                                <span className="absolute top-1 right-1/2 translate-x-4 bg-orange-600 border-2 border-white text-white text-[8px] font-black w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                    {item.badge}
                                </span>
                            )}

                            <span className={`text-[9px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute -bottom-1 w-1 h-1 bg-orange-600 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
