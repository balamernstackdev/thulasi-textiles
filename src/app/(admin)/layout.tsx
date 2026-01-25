
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    Settings,
    LogOut,
    Menu,
    Image as ImageIcon
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Determine active route logic would go here if client component, 
    // for server layout we can simplisticly render.

    return (
        <div className="min-h-screen bg-[#f3f4f6] flex font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-[#1e293b] text-white flex flex-col fixed h-full z-20 transition-all duration-300 shadow-2xl">
                <div className="p-8 flex flex-col items-center gap-4 border-b border-gray-700/50 group cursor-pointer transition-all">
                    {/* Official Logo */}
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl p-2 ring-4 ring-white/10 animate-bounce [animation-duration:4s]">
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

                <div className="p-4 flex-1 overflow-y-auto space-y-1 custom-scrollbar-thin gpu">
                    <p className="px-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 mt-6">Main Menu</p>

                    <Link href="/admin" className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#2dd4bf] text-[#1e293b] font-black shadow-xl shadow-teal-500/30 transition-all hover:scale-[1.02] active:scale-95 group">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>

                    <p className="px-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 mt-10">Inventory Management</p>

                    <Link href="/admin/categories" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <Menu className="w-5 h-5 group-hover:text-[#2dd4bf] transition-colors" />
                        <span className="font-bold">Categories</span>
                    </Link>

                    <Link href="/admin/products" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <Package className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        <span className="font-bold">Products</span>
                    </Link>

                    <Link href="/admin/orders" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <ShoppingBag className="w-5 h-5 group-hover:text-orange-400 transition-colors" />
                        <span className="font-bold">Orders</span>
                    </Link>

                    <Link href="/admin/customers" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <Users className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
                        <span className="font-bold">Customers</span>
                    </Link>

                    <p className="px-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-3 mt-10">Marketing</p>

                    <Link href="/admin/banners" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-gray-400 hover:bg-white/5 hover:text-white transition-all group">
                        <ImageIcon className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
                        <span className="font-bold">Banners</span>
                    </Link>
                </div>

                <div className="p-6 border-t border-gray-700/50">
                    <button className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold group">
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-72 min-h-screen transition-all duration-300 bg-gray-50/50">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md h-20 shadow-sm border-b px-10 flex items-center justify-between sticky top-0 z-10 antialiased gpu">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Admin <span className="text-[#2dd4bf]">Panel</span></h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-black text-gray-900 leading-none mb-1">Deepak Srinivasan</p>
                            <p className="text-[10px] font-black text-[#2dd4bf] uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded">Owner / Admin</p>
                        </div>
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl border-2 border-white shadow-xl flex items-center justify-center text-gray-400 group cursor-pointer hover:border-[#2dd4bf] transition-all overflow-hidden">
                            <Users className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-10 lg:p-12 animate-in fade-in slide-in-from-bottom-5 duration-700 gpu overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
