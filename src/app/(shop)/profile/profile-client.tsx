'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, MapPin, Heart, LogOut, Settings, ChevronRight, Star } from 'lucide-react';
import { logout } from '@/lib/actions/auth';
import { useRouter } from 'next/navigation';
import AddressesClient from './addresses/addresses-client';
import WishlistClient from '../wishlist/wishlist-client';
import SettingsClient from './settings-client';
import { format } from 'date-fns';

type Tab = 'overview' | 'orders' | 'addresses' | 'wishlist' | 'settings';

export default function ProfileClient({
    session,
    initialOrders = [],
    initialAddresses = [],
    initialWishlist = []
}: {
    session: any,
    initialOrders?: any[],
    initialAddresses?: any[],
    initialWishlist?: any[]
}) {
    const { user } = session;
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Pagination state for Orders tab
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(initialOrders.length / itemsPerPage);

    const paginatedOrders = initialOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleLogout = async () => {
        await logout();
        router.push('/');
        router.refresh();
    };

    const menuItems = [
        { id: 'overview', icon: User, label: 'Overview', description: 'Account summary' },
        { id: 'orders', icon: Package, label: 'My Orders', description: 'Track ongoing orders' },
        { id: 'addresses', icon: MapPin, label: 'Addresses', description: 'Manage delivery locations' },
        { id: 'wishlist', icon: Heart, label: 'Wishlist', description: 'Your saved items' },
        { id: 'settings', icon: Settings, label: 'Settings', description: 'Password & Security' },
    ];

    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 md:mb-12">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tighter uppercase italic mb-1">My Profile</h1>
                        <p className="text-xs sm:text-sm text-gray-500 font-bold">Manage your account and orders</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-white border-2 border-gray-100 text-red-500 px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest hover:bg-red-50 hover:border-red-100 transition-all flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Navigation Menu */}
                        <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-lg h-full flex flex-col">
                            <h3 className="text-[10px] sm:text-sm font-black text-gray-400 uppercase tracking-widest mb-4 sm:mb-6 px-2">Account Menu</h3>
                            <div className="space-y-3 flex-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id as Tab);
                                            setCurrentPage(1); // Reset pagination on tab switch
                                        }}
                                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98] group relative overflow-hidden text-left ${activeTab === item.id
                                            ? 'bg-orange-600 border-orange-600 shadow-lg'
                                            : 'bg-white border-transparent hover:border-gray-100 hover:bg-white hover:shadow-lg'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${activeTab === item.id
                                            ? 'bg-white/20 text-white'
                                            : 'bg-gray-50 text-gray-400 group-hover:bg-orange-600 group-hover:text-white'
                                            }`}>
                                            <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-black text-sm transition-colors ${activeTab === item.id ? 'text-white' : 'text-gray-900 group-hover:text-orange-600'
                                                }`}>{item.label}</h4>
                                            <p className={`text-xs font-bold mt-0.5 ${activeTab === item.id ? 'text-white/80' : 'text-gray-500'
                                                }`}>{item.description}</p>
                                        </div>
                                        {activeTab === item.id && (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center">
                                                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Dynamic Content */}
                    <div className="lg:col-span-2 h-full">
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Recent Orders Preview (Showing 5) */}
                                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-xl">
                                    <div className="flex items-center justify-between mb-6 sm:mb-8">
                                        <h3 className="text-lg sm:text-xl font-black text-gray-900 uppercase tracking-tight italic">Recent Orders</h3>
                                        <button onClick={() => setActiveTab('orders')} className="text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">
                                            View All
                                        </button>
                                    </div>

                                    {initialOrders.length > 0 ? (
                                        <div className="space-y-4">
                                            {initialOrders.slice(0, 5).map((order) => (
                                                <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                                                    <div className="border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-xl hover:border-orange-100 transition-all bg-white relative overflow-hidden">
                                                        <div className="flex items-center justify-between mb-4">
                                                            <div>
                                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Order #{order.id.slice(0, 8)}</span>
                                                                <p className="text-xs sm:text-sm font-bold text-gray-900 mt-1">
                                                                    {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                        order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' :
                                                                            'bg-blue-100 text-blue-700'
                                                                    }`}>
                                                                    {order.status}
                                                                </span>
                                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-600 transition-colors" />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-end justify-between">
                                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                                {order.items.slice(0, 4).map((item: any, idx: number) => (
                                                                    <div key={idx} className="w-16 h-16 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 border border-gray-100 shadow-inner">
                                                                        {item.variant?.product?.images?.[0] && (
                                                                            <Image
                                                                                src={item.variant.product.images[0].url}
                                                                                alt="Product"
                                                                                fill
                                                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                            />
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity">View Info</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-24 bg-gray-50/50 rounded-3xl border border-gray-100 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-gray-300">
                                                <Package className="w-8 h-8" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-8">No recent orders found</p>
                                            <Link href="/" className="inline-block text-[11px] font-black text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-1 hover:text-orange-600 hover:border-orange-600 transition-colors">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ADDRESSES TAB */}
                        {activeTab === 'addresses' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-xl min-h-[500px] md:min-h-[600px]">
                                    <AddressesClient addresses={initialAddresses} />
                                </div>
                            </div>
                        )}

                        {/* WISHLIST TAB */}
                        {activeTab === 'wishlist' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-xl min-h-[500px] md:min-h-[600px]">
                                    <WishlistClient wishlist={initialWishlist} />
                                </div>
                            </div>
                        )}

                        {/* ORDERS TAB (Paginated) */}
                        {activeTab === 'orders' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-xl min-h-[500px] md:min-h-[600px]">
                                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight italic mb-6 sm:mb-8">All Orders</h3>

                                    <div className="space-y-4">
                                        {paginatedOrders.map((order) => (
                                            <Link key={order.id} href={`/orders/${order.id}`} className="block group">
                                                <div className="border border-gray-100 rounded-3xl p-6 hover:shadow-xl hover:border-orange-100 transition-all bg-white relative overflow-hidden">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div>
                                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order #{order.id.slice(0, 8)}</span>
                                                            <p className="text-sm font-bold text-gray-900 mt-1">
                                                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                                order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                                    order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700' :
                                                                        'bg-blue-100 text-blue-700'
                                                                }`}>
                                                                {order.status}
                                                            </span>
                                                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-600 transition-colors" />
                                                        </div>
                                                    </div>
                                                    <div className="flex items-end justify-between">
                                                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                                            {order.items.map((item: any, idx: number) => (
                                                                <div key={idx} className="w-16 h-16 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 border border-gray-100 shadow-inner">
                                                                    {item.variant?.product?.images?.[0] && (
                                                                        <Image
                                                                            src={item.variant.product.images[0].url}
                                                                            alt="Product"
                                                                            fill
                                                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                                        />
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-black text-orange-600 uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Details</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                        {initialOrders.length === 0 && (
                                            <p className="text-gray-500 font-medium text-center py-10">No orders found.</p>
                                        )}
                                    </div>

                                    {/* Pagination Controls */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-8">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Prev
                                            </button>
                                            <span className="px-4 py-2 text-xs font-bold text-gray-500 flex items-center">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-black uppercase disabled:opacity-50 hover:bg-gray-50"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* SETTINGS TAB */}
                        {activeTab === 'settings' && (
                            <div className="animate-in fade-in zoom-in-95 duration-300">
                                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 sm:p-8 shadow-xl min-h-[500px] md:min-h-[600px]">
                                    <SettingsClient session={session} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
