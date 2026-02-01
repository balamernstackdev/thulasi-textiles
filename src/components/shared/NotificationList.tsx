'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { markAsRead } from '@/lib/actions/notification';
import { useRouter } from 'next/navigation';
import { Package, CreditCard, Bell, Info, Tag, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface NotificationListProps {
    initialNotifications: any[];
    userId: string;
}

const ICONS: Record<string, any> = {
    ORDER_STATUS: Package,
    ORDER_NEW: Sparkles,
    PAYMENT: CreditCard,
    SYSTEM: Info,
    PROMOTION: Tag,
};

export default function NotificationList({ initialNotifications, userId }: NotificationListProps) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const router = useRouter();

    const handleRead = async (id: string, link?: string) => {
        // Optimistic UI update
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        await markAsRead(id);
        if (link) router.push(link);
    };

    if (notifications.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mb-6">
                    <Bell className="w-8 h-8" />
                </div>
                <p className="text-gray-900 font-black uppercase tracking-tighter italic text-xl">All Quiet on the Heritage Front</p>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">No new alerts or updates for you</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((n) => {
                const Icon = ICONS[n.type] || Bell;
                return (
                    <div
                        key={n.id}
                        onClick={() => handleRead(n.id, n.link)}
                        className={`group p-6 rounded-[2.5rem] cursor-pointer transition-all border ${n.isRead
                            ? 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-xl'
                            : 'bg-white border-orange-200 shadow-xl shadow-orange-600/5 ring-1 ring-orange-500/10'}`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${n.isRead
                                ? 'bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white'
                                : 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'}`}>
                                <Icon className="w-6 h-6" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className={`font-black uppercase tracking-tight italic transition-colors truncate ${n.isRead ? 'text-gray-900 group-hover:text-orange-600' : 'text-gray-900'}`}>
                                        {n.title}
                                    </h3>
                                    {!n.isRead && (
                                        <span className="bg-orange-600 text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">New</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-2">
                                    {n.message}
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">
                                        {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                                    </span>
                                    {n.link && (
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="h-px w-4 bg-gray-200" />
                                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">View Update</span>
                                            <ChevronRight className="w-3 h-3 text-orange-600" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
