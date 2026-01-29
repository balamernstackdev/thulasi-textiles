import { getSession } from "@/lib/auth";
import { getNotifications } from "@/lib/actions/notification";
import { redirect } from "next/navigation";
import NotificationList from "@/components/shared/NotificationList";
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notifications | Thulasi Textiles',
    description: 'View your order updates and alerts.',
};

export default async function NotificationsPage() {
    const session = await getSession();
    if (!session) redirect('/auth/login');

    const result = await getNotifications(session.user.id);
    const notifications = (result.success && result.notifications) ? result.notifications : [];

    return (
        <div className="max-w-4xl mx-auto space-y-8 min-h-[60vh]">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Alerts & Updates</h1>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2">
                    Stay informed about your heritage collection
                </p>
            </div>

            <NotificationList initialNotifications={notifications} userId={session.user.id} />
        </div>
    );
}
