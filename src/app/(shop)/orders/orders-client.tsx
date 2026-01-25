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
        <div className="min-h-screen py-12 px-4 lg:px-8 bg-gray-50">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">My Orders</h1>
                    <p className="text-gray-500 font-bold">{orders.length} {orders.length === 1 ? 'order' : 'orders'} total</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-6 py-3 rounded-full font-black text-sm uppercase tracking-wide whitespace-nowrap transition-all ${filter === status
                                    ? 'bg-orange-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {filteredOrders.map((order) => {
                        const config = statusConfig[order.status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;
                        const firstItem = order.items[0];

                        return (
                            <div key={order.id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Order Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-black text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1 ${config.color}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {config.label}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="p-2 hover:bg-gray-50 rounded-xl transition-colors"
                                            >
                                                <Eye className="w-5 h-5 text-gray-400" />
                                            </Link>
                                        </div>

                                        {/* Items Preview */}
                                        <div className="flex gap-3 overflow-x-auto pb-2">
                                            {order.items.slice(0, 3).map((item: any, idx: number) => (
                                                <div key={idx} className="shrink-0">
                                                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative">
                                                        {item.variant?.product?.images?.[0] && (
                                                            <Image
                                                                src={item.variant.product.images[0].url}
                                                                alt={item.variant.product.name}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {order.items.length > 3 && (
                                                <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                                                    <span className="text-xs font-black text-gray-400">+{order.items.length - 3}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div>
                                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Total Amount</p>
                                                <p className="text-2xl font-black text-gray-900">₹{order.total.toLocaleString('en-IN')}</p>
                                            </div>
                                            <Link
                                                href={`/orders/${order.id}`}
                                                className="bg-black text-white px-6 py-3 rounded-full text-sm font-black uppercase tracking-wide hover:bg-orange-600 transition-all shadow-lg"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredOrders.length === 0 && (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-bold">No orders found with this status</p>
                    </div>
                )}
            </div>
        </div>
    );
}
