
import React from 'react';
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import { getCategoriesTree } from '@/lib/actions/category';
import { getSession } from '@/lib/auth';
import { getBanners } from '@/lib/actions/banner';
import AIHeritageAssistant from '@/components/shop/AIHeritageAssistant';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: categories } = await getCategoriesTree();
    const { data: banners = [] } = await getBanners({ isActive: true });

    // Filter announcements
    const announcementBanners = (banners as any[]).filter(b => b.type === 'ANNOUNCEMENT');

    console.log('[ShopLayout] Fetched categories:', categories?.length || 0);
    if (categories?.length === 0) {
        console.warn('[ShopLayout] WARNING: No categories found!');
    }
    const session = await getSession();

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar
                categories={categories || []}
                session={session}
                announcements={announcementBanners}
            />
            <main className="flex-grow">
                {children}
            </main>
            <Footer categories={categories || []} />
            <AIHeritageAssistant />
        </div>
    );
}
