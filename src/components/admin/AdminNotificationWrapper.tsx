'use client';

import { useState, useEffect } from 'react';
import { getSessionUser } from '@/lib/actions/auth';
import NotificationBell from "@/components/shared/NotificationBell";

export default function AdminNotificationWrapper() {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await getSessionUser();
                if (user?.id) {
                    setUserId(user.id);
                }
            } catch (error) {
                console.error("Failed to fetch admin user:", error);
            }
        };
        fetchUser();
    }, []);

    if (!userId) return null;

    return <NotificationBell userId={userId} />;
}
