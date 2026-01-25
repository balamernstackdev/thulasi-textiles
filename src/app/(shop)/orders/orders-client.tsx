'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from 'lucide-react';

type Order = {
    id: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: Date;
    items: any[];
};

const STATUSES = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersClient({ orders }: { orders: Order[] }) {
    const [filter, setFilter] = useState('ALL');

    const statusConfig = {
        PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
        SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
        DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const filteredOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter);

    if (orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="text-center space-y-8 max-w-md">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">No Orders Yet</h2>
                        <p className="text-gray-500 font-medium">Start shopping to see your orders here</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8 md:py-16 px-4 lg:px-8 bg-gray-50/50">
            <div className="max-w-5xl mx-auto">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-3">
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">
                            My <span className="text-orange-600">Orders</span>
                        </h1>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse" />
                            {orders.length} {orders.length === 1 ? 'Legacy Piece' : 'Heritage Collection'}
                        </p>
                    </div>
                </div>

                {/* Refined Filter Container */}
                <div className="sticky top-20 z-20 -mx-4 px-4 bg-gray-50/80 backdrop-blur-md py-4 border-b border-gray-100 mb-10 overflow-hidden">
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                        {STATUSES.map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-2 ${filter === status
                                    ? 'bg-black border-black text-white shadow-[0_10px_20px_-10px_rgba(0,0,0,0.5)] scale-105'
                                    : 'bg-white border-white text-gray-400 hover:border-gray-200 hover:text-gray-900 shadow-sm'
                                    }`}
                            >
                                {status.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Modern Orders List */}
                <div className="space-y-8">
                    {filteredOrders.map((order) => {
                        const config = statusConfig[order.status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;

                        return (
                            <div key={order.id} className="group bg-white rounded-[2.5rem] p-6 md:p-8 shadow-xl shadow-gray-200/40 border border-gray-50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-200/20 hover:-translate-y-1 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-gray-50/50 rounded-full translate-x-12 -translate-y-12 blur-3xl group-hover:bg-orange-50/50 transition-colors" />

                                <div className="relative space-y-8">
                                    {/* Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight leading-none group-hover:text-orange-600 transition-colors">
                                                    #{order.id.slice(0, 8).toUpperCase()}
                                                </h3>
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border shadow-sm ${config.color.replace('bg-', 'border-').replace('text-', 'bg-').split(' ')[0] + '/10'} ${config.color}`}>
                                                    <StatusIcon className="w-3 h-3" />
                                                    {config.label}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                Placed {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/orders/${order.id}`}
                                            className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-orange-600 transition-all group/link"
                                        >
                                            View Snapshot
                                            <Eye className="w-4 h-4 group-hover/link:scale-110" />
                                        </Link>
                                    </div>

                                    {/* Items Preview - Modern Layout */}
                                    <div className="flex items-center gap-6 group/items">
                                        <div className="flex -space-x-4 md:-space-x-6 overflow-hidden">
                                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="relative w-24 h-32 md:w-32 md:h-40 rounded-2xl md:rounded-3xl border-4 border-white shadow-xl bg-gray-100 overflow-hidden hover:z-10 hover:scale-110 hover:-translate-y-2 transition-all duration-500 first:ml-0"
                                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                                >
                                                    {item.variant?.product?.images?.[0] && (
                                                        <Image
                                                            src={item.variant.product.images[0].url}
                                                            alt={item.variant.product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="relative w-24 h-32 md:w-32 md:h-40 rounded-2xl md:rounded-3xl border-4 border-white shadow-xl bg-black text-white flex flex-col items-center justify-center hover:z-10 hover:scale-110 transition-all duration-500">
                                                    <span className="text-xl md:text-2xl font-black">+{order.items.length - 3}</span>
                                                    <span className="text-[8px] font-black uppercase tracking-widest">More</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="hidden lg:block space-y-1">
                                            <p className="text-sm font-black text-gray-900 line-clamp-1 italic uppercase">
                                                {order.items[0]?.variant?.product?.name}
                                            </p>
                                            {order.items.length > 1 && (
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    & {order.items.length - 1} other pieces
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Footer Section - Optimized for Mobile */}
                                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between pt-8 border-t border-dashed border-gray-100 gap-6">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Vault Total</span>
                                            <p className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter leading-none italic">
                                                ₹{order.total.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                        <div className="flex w-full sm:w-auto gap-3">
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="flex-1 sm:flex-none bg-orange-600 text-white px-10 py-5 rounded-[2rem] text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-orange-200 active:scale-95 text-center"
                                            >
                                                View Order details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                    <div className="text-center py-32 space-y-6">
                        <div className="w-24 h-24 mx-auto bg-gray-100 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200 group-hover:border-orange-200 transition-colors">
                            <Package className="w-10 h-10 text-gray-300" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-gray-900 uppercase tracking-tight italic">No archives found</p>
                            <p className="text-sm text-gray-400 font-medium max-w-xs mx-auto">There are no orders matching the refined status criteria in your vault.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
