'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/lib/actions/order';
import { toast } from 'sonner';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OrderStatusSelector({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleStatusChange = async (newStatus: string) => {
        setIsLoading(true);
        try {
            const result = await updateOrderStatus(orderId, newStatus);
            if (result.success) {
                toast.success(`Order updated to ${newStatus}`);
                router.refresh();
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    return (
        <div className="relative inline-block">
            <select
                disabled={isLoading}
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="appearance-none bg-white border border-gray-200 text-gray-900 text-xs font-black uppercase tracking-widest pl-4 pr-10 py-2.5 rounded-xl cursor-pointer hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
            >
                {statuses.map((status) => (
                    <option key={status} value={status}>
                        {status}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                )}
            </div>
        </div>
    );
}
