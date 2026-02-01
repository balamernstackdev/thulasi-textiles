
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import AnnouncementTicker from '@/components/shop/AnnouncementTicker';
import CountdownBanner from '@/components/shop/CountdownBanner';
import { getSession } from '@/lib/auth';
import { getCategoriesTree } from '@/lib/actions/category';
import { getBanners } from '@/lib/actions/banner';
import ScrollToTop from '@/components/ui/ScrollToTop';
import GlobalClientWidgets from '@/components/shop/GlobalClientWidgets';
import DeferredRecentlyViewed from '@/components/shop/DeferredRecentlyViewed';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: categories } = await getCategoriesTree();
    const { data: banners = [] } = await getBanners({ isActive: true });
    const session = await getSession();

    // Filter banners
    const announcementBanners = (banners as any[]).filter(b => b.type === 'ANNOUNCEMENT');
    const countdownBanner = (banners as any[]).find(b => b.type === 'COUNTDOWN'); // Assuming logic for countdown

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <ScrollToTop />
            {countdownBanner && <CountdownBanner banner={countdownBanner} />}
            <Navbar categories={categories || []} session={session} announcements={announcementBanners} />
            <main className="flex-grow">
                {children}
                <DeferredRecentlyViewed />
            </main>
            <Footer categories={categories || []} />
            <GlobalClientWidgets session={session} />
        </div>
    );
}
