'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { markAsRead } from '@/lib/actions/notification';
import { useRouter } from 'next/navigation';

interface NotificationListProps {
    initialNotifications: any[];
    userId: string;
}

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
            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">No notifications yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {notifications.map((n) => (
                <div
                    key={n.id}
                    onClick={() => handleRead(n.id, n.link)}
                    className={`p-6 rounded-3xl cursor-pointer transition-all border ${n.isRead ? 'bg-white border-gray-100' : 'bg-teal-50 border-teal-100 shadow-lg shadow-teal-500/5'}`}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                {!n.isRead && <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />}
                                <h3 className={`font-black uppercase tracking-wide text-sm ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>
                                    {n.title}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
                                {n.message}
                            </p>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
