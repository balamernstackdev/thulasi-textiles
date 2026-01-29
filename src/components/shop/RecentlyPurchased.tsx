'use client';

import { useState, useEffect } from 'react';
import { getRecentPublicOrders } from '@/lib/actions/order';
import { ShoppingBag, X } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';

export default function RecentlyPurchased() {
    const [orders, setOrders] = useState<any[]>([]);
    const [currentOrder, setCurrentOrder] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            const res = await getRecentPublicOrders();
            if (res.success && res.data && res.data.length > 0) {
                setOrders(res.data);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        if (orders.length === 0) return;

        let index = 0;
        const interval = setInterval(() => {
            setCurrentOrder(orders[index]);
            setVisible(true);

            // Hide after 5 seconds
            setTimeout(() => setVisible(false), 5000);

            index = (index + 1) % orders.length;
        }, 15000); // Show every 15 seconds

        return () => clearInterval(interval);
    }, [orders]);

    if (!currentOrder || !visible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[100] animate-in slide-in-from-left-full duration-500">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 pr-8 flex items-center gap-4 max-w-sm relative group overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-orange-600 animate-progress w-full" style={{ animationDuration: '5000ms' }} />

                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 border border-gray-100">
                    <Image
                        src={currentOrder.productImage || 'https://images.unsplash.com/photo-1560780552-ba54683cb963?auto=format&fit=crop&w=200&q=80'}
                        alt={currentOrder.productName}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">
                        Recently Purchased
                    </p>
                    <p className="text-xs font-black text-gray-900 line-clamp-1 leading-tight mt-0.5">
                        {currentOrder.productName}
                    </p>
                    <p className="text-[9px] font-bold text-gray-500 mt-1 uppercase">
                        From <span className="text-orange-600">{currentOrder.city}</span> • {formatDistanceToNow(new Date(currentOrder.createdAt))} ago
                    </p>
                </div>

                <button
                    onClick={() => setVisible(false)}
                    className="absolute top-2 right-2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>

            <style jsx>{`
                @keyframes progress {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-progress {
                    animation-name: progress;
                    animation-timing-function: linear;
                }
            `}</style>
        </div>
    );
}
