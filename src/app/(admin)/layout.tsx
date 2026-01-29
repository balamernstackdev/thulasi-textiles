'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { logout } from '@/lib/actions/auth';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    LogOut,
    Menu,
    X,
    Image as ImageIcon,
    Ticket,
    Box,
    Star,
    Truck,
    Settings
} from 'lucide-react';
import PageTransition from '@/components/admin/PageTransition';
import AdminNotificationWrapper from '@/components/admin/AdminNotificationWrapper';



const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-teal-400' },
    { href: '/admin/categories', label: 'Categories', icon: Menu, color: 'text-[#2dd4bf]' },
    { href: '/admin/products', label: 'Products', icon: Package, color: 'text-purple-400' },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag, color: 'text-orange-400' },
    { href: '/admin/inventory/fulfillment', label: 'Fulfillment', icon: Truck, color: 'text-emerald-500' },
    { href: '/admin/customers', label: 'Customers', icon: Users, color: 'text-blue-400' },
    { href: '/admin/banners', label: 'Banners', icon: ImageIcon, color: 'text-pink-400' },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket, color: 'text-orange-500' },
    { href: '/admin/artisans', label: 'Artisans', icon: Users, color: 'text-emerald-400' },
    { href: '/admin/inventory', label: 'Inventory', icon: Box, color: 'text-teal-500' },
    { href: '/admin/reviews', label: 'Reviews', icon: Star, color: 'text-yellow-500' },
    { href: '/admin/settings', label: 'Settings', icon: Settings, color: 'text-gray-400' },
];

const NavLink = React.memo(({ item, isActive, onClick }: { item: any, isActive: boolean, onClick: () => void }) => {
    const Icon = item.icon;
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${isActive
                ? 'bg-[#2dd4bf] text-[#1e293b] font-black shadow-xl shadow-teal-500/30'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
        >
            <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-[#1e293b]' : `group-hover:${item.color}`}`} />
            <span className={isActive ? 'font-black' : 'font-bold'}>{item.label}</span>
        </Link>
    );
});

NavLink.displayName = 'NavLink';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const isInvoicePage = pathname.endsWith('/invoice');

    if (isInvoicePage) {
        return <div className="min-h-screen bg-white">{children}</div>;
    }

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex font-sans overflow-x-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[30] lg:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-72 bg-[#1e293b] text-white flex flex-col z-[40] transition-transform duration-300 shadow-2xl lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="p-8 flex flex-col items-center gap-4 border-b border-gray-700/50 relative">
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Official Logo */}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 ring-4 ring-white/10">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center">
                        <span className="font-black text-xl tracking-tighter italic uppercase block">
                            <span className="text-gray-400">Thulasi</span> <span className="text-orange-600">Textiles</span>
                        </span>
                        <span className="text-[8px] font-black text-orange-600 uppercase tracking-[0.3em] mt-1 block">Women's World</span>
                    </div>
                </div>

                <div className="p-4 flex-1 overflow-y-auto space-y-1 custom-scrollbar-sidebar">
                    <p className="px-5 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 mt-6 opacity-50">Operations Hub</p>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            item={item}
                            isActive={pathname === item.href}
                            onClick={() => setIsSidebarOpen(false)}
                        />
                    ))}
                </div>

                <div className="p-6 border-t border-gray-700/50">
                    <button
                        onClick={() => logout()}
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold group text-left"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 bg-gray-50/50 lg:ml-72">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md h-20 shadow-sm border-b px-6 md:px-10 lg:px-12 flex items-center justify-between sticky top-0 z-20 antialiased gpu">
                    <div className="flex items-center gap-4">
                        <button
                            className="lg:hidden p-2 text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter italic shrink-0">
                            Admin <span className="text-[#2dd4bf] sm:inline">Panel</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        <AdminNotificationWrapper />
                        <div className="text-right hidden sm:block">
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 md:p-10 lg:p-12 gpu overflow-x-hidden">
                    <PageTransition>
                        {children}
                    </PageTransition>
                </main>
            </div>
        </div>
    );
}
