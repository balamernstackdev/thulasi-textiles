
import Navbar from '@/components/shop/Navbar';
import Footer from '@/components/shop/Footer';
import AnnouncementTicker from '@/components/shop/AnnouncementTicker';
import CountdownBanner from '@/components/shop/CountdownBanner';
import QuickViewModal from '@/components/shop/QuickViewModal';
import { getSession } from '@/lib/auth';
import { getCategoriesTree } from '@/lib/actions/category';
import { getBanners } from '@/lib/actions/banner';
import AIHeritageAssistant from '@/components/shop/AIHeritageAssistant';
import ScrollToTop from '@/components/ui/ScrollToTop';
import MobileBottomNav from '@/components/shop/MobileBottomNav';
import RecentlyPurchased from '@/components/shop/RecentlyPurchased';

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
            <AnnouncementTicker banners={announcementBanners} />
            {countdownBanner && <CountdownBanner banner={countdownBanner} />}
            <Navbar categories={categories || []} session={session} announcements={announcementBanners} />
            <main className="flex-grow">
                {children}
            </main>
            <Footer categories={categories || []} />
            <QuickViewModal />
            <AIHeritageAssistant />
            <RecentlyPurchased />
            <MobileBottomNav session={session} />
        </div>
    );
}
