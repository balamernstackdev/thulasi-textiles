'use client';

import dynamic from 'next/dynamic';

const QuickViewModal = dynamic(() => import('@/components/shop/QuickViewModal'), { ssr: false });
const AIHeritageAssistant = dynamic(() => import('@/components/shop/AIHeritageAssistant'), { ssr: false });
const RecentlyPurchased = dynamic(() => import('@/components/shop/RecentlyPurchased'), { ssr: false });
const HeritageSupport = dynamic(() => import('@/components/shop/HeritageSupport'), { ssr: false });
const MobileBottomNav = dynamic(() => import('@/components/shop/MobileBottomNav'), { ssr: false });

export default function GlobalClientWidgets({ session }: { session: any }) {
    return (
        <>
            <QuickViewModal />
            <AIHeritageAssistant />
            <RecentlyPurchased />
            <HeritageSupport />
            <MobileBottomNav session={session} />
        </>
    );
}
