'use server';

import prismadb from "@/lib/prisma";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

// 1. Fetch Notifications for a User
export async function getNotifications(userId: string) {
    try {
        const notifications = await prismadb?.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20, // Limit to recent 20
        });

        // Count unread
        const unreadCount = await prismadb?.notification.count({
            where: { userId, isRead: false }
        });

        return { success: true, notifications, unreadCount };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

// 2. Mark Single as Read
export async function markAsRead(notificationId: string) {
    try {
        await prismadb?.notification.update({
            where: { id: notificationId },
            data: { isRead: true }
        });
        revalidatePath('/profile');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update status" };
    }
}

// 3. Mark All as Read
export async function markAllAsRead(userId: string) {
    try {
        await prismadb?.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
        revalidatePath('/profile');
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to update all" };
    }
}

// 4. Internal: Create Notification
export async function createNotification({
    userId,
    title,
    message,
    type,
    link
}: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
}) {
    try {
        await prismadb.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
                isRead: false
            }
        });
        return { success: true };
    } catch (error) {
        console.error("Notification creation failed:", error);
        return { success: false };
    }
}

// 5. Broadcast to Admins
export async function notifyAdmins({
    title,
    message,
    type,
    link
}: {
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
}) {
    try {
        const admins = await prismadb.user.findMany({
            where: { role: 'ADMIN' },
            select: { id: true }
        });

        if (admins.length === 0) return;

        await prismadb.notification.createMany({
            data: admins.map(admin => ({
                userId: admin.id,
                title,
                message,
                type,
                link,
                isRead: false,
            }))
        });

        return { success: true };
    } catch (error) {
        console.error("Admin broadcast failed:", error);
        return { success: false };
    }
}
