'use client';

import { Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/actions/notification';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotificationBell({ userId }: { userId: string }) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    // Poll for notifications every 30 seconds
    useEffect(() => {
        const fetch = async () => {
            const res = await getNotifications(userId);
            if (res.success && res.notifications) {
                setNotifications(res.notifications);
                setUnreadCount(res.unreadCount || 0);
            }
        };

        fetch();
        const interval = setInterval(fetch, 30000);
        return () => clearInterval(interval);
    }, [userId]);

    const handleMarkRead = async (id: string, link?: string) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));

        if (link) {
            setIsOpen(false);
            router.push(link);
        }
    };

    const handleMarkAll = async () => {
        await markAllAsRead(userId);
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="relative w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 rounded-2xl shadow-xl border-gray-100 bg-white">
                <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-sm uppercase tracking-wider">Notifications</h3>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAll}
                            className="text-[10px] font-bold text-teal-600 hover:underline uppercase tracking-wide"
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                    {notifications.length > 0 ? (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleMarkRead(n.id, n.link)}
                                className={`p-3 rounded-xl cursor-pointer transition-colors group ${n.isRead ? 'bg-white hover:bg-gray-50' : 'bg-teal-50/50 hover:bg-teal-50'}`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${n.isRead ? 'bg-gray-200' : 'bg-teal-500'}`} />
                                    <div className="flex-1">
                                        <p className={`text-xs ${n.isRead ? 'font-medium text-gray-600' : 'font-bold text-gray-900'}`}>
                                            {n.title}
                                        </p>
                                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                                            {n.message}
                                        </p>
                                        <p className="text-[9px] text-gray-400 mt-2 font-medium">
                                            {format(new Date(n.createdAt), 'MMM d, h:mm a')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-400">
                            <p className="text-xs">No notifications yet</p>
                        </div>
                    )}
                </div>
                <div className="p-2 border-t border-gray-50 bg-gray-50/50 rounded-b-2xl">
                    <Link
                        href="/profile/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block text-center text-[10px] font-black text-gray-500 hover:text-gray-900 uppercase tracking-widest py-2"
                    >
                        View History
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}
