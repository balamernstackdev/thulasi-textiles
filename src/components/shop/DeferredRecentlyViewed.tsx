'use client';

import dynamic from 'next/dynamic';

const RecentlyViewed = dynamic(() => import('@/components/shop/RecentlyViewed'), { ssr: false });

export default function DeferredRecentlyViewed() {
    return <RecentlyViewed />;
}
