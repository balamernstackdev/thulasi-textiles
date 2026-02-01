import { Suspense } from 'react';
import { Metadata } from 'next';
import Banner from '@/components/shop/Banner';
import ProductSection from '@/components/shop/ProductSection';
import LatestProducts from '@/components/shop/LatestProducts';
import TrustBar from '@/components/shop/TrustBar';
import CategoryGrid from '@/components/shop/CategoryGrid';
import NewsletterForm from '@/components/shop/NewsletterForm';
import { ProductSectionSkeleton } from '@/components/shop/HomeSkeleton';
import { getBanners } from '@/lib/actions/banner';
import { getProducts } from '@/lib/actions/product';
import { getCategoriesTree } from '@/lib/actions/category';
import { getSession } from '@/lib/auth';
import AnnouncementTicker from '@/components/shop/AnnouncementTicker';
import CountdownBanner from '@/components/shop/CountdownBanner';
import HeritageQuiz from '@/components/shop/HeritageQuiz';
import HeritageChronicles from '@/components/shop/HeritageChronicles';
import ThulasiWomenGallery from '@/components/shop/ThulasiWomenGallery';
import ShoppingErrorBoundary from '@/components/shop/ErrorBoundary';

// export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Thulasi Textiles | Authentic Indian Handlooms & Heritage Weaves',
  description: 'Explore the finest collection of authentic Indian sarees, men\'s heritage wear, and luxury home linens. Directly from master artisans to your doorstep.',
  openGraph: {
    title: 'Thulasi Textiles | Heritage in Every Weave',
    description: 'Direct-from-artisan Indian handlooms including Sarees, Kurtas, and Home Decor.',
    images: ['/og-image.jpg'],
  },
};

interface BannerItem {
  id: string;
  imageUrl: string;
  mobileImageUrl: string | null;
  videoUrl: string | null;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
  type: string;
  isActive: boolean;
  order: number;
  alignment: 'LEFT' | 'CENTER' | 'RIGHT' | null;
  backgroundColor: string | null;
  textColor: string | null;
  countdownEndDate: Date | null;
}

// Separate component for streaming category sections
async function CategoryProductSections({ topCategories, session, bestSellerBanners, offerBanners }: any) {
  const categorySections = await Promise.all(
    topCategories.map(async (cat: any) => {
      const { data: products } = await getProducts({ categorySlug: cat.slug, limit: 6 });
      return { category: cat, products: products || [] };
    })
  );

  return (
    <>
      {categorySections.map(({ category, products }, index) => {
        if (!products || products.length === 0) return null;
        const isGray = index % 2 === 0;

        return (
          <div key={category.id}>
            {index === 1 && bestSellerBanners.length > 0 && <Banner banners={bestSellerBanners} type="section" />}
            {index === 2 && offerBanners.length > 0 && <Banner banners={offerBanners} type="section" />}

            <ProductSection
              title={category.name}
              subtitle={`Explore our exclusive collection of ${category.name}`}
              products={products}
              bgVariant={isGray ? "gray" : "white"}
              viewAllLink={`/category/${category.slug}`}
              session={session}
            />
          </div>
        );
      })}
    </>
  );
}

// Separate component for streaming offers
async function OfferSection({ session }: { session: any }) {
  const { data: offerProducts } = await getProducts({ isOffer: true, limit: 6 });

  if (!offerProducts || offerProducts.length === 0) return null;

  return (
    <ProductSection
      title="Limited Time Offers"
      subtitle="Grab these deals before they are gone"
      products={offerProducts}
      bgVariant="white"
      viewAllLink="/collections/offers"
      session={session}
    />
  );
}

import SidebarPromo from '@/components/shop/SidebarPromo';

export default async function ShopHome() {
  const { data: categories } = await getCategoriesTree();
  const topCategories = (categories || []).slice(0, 4);

  const { data: allBanners = [] } = await getBanners({ isActive: true, pageSize: 50 });
  const { data: latestProducts = [] } = await getProducts({ isNew: true, limit: 12 });
  const session = await getSession();

  const typedBanners = (allBanners as any[]) as BannerItem[];

  // Categorize Banners
  const mainBanners = typedBanners.filter(b => b.type === 'HOME_MAIN' || b.type === 'VIDEO_HERO');
  const announcementBanners = typedBanners.filter(b => b.type === 'ANNOUNCEMENT');
  const countdownBanners = typedBanners.filter(b => b.type === 'COUNTDOWN');
  const sidebarBanners = typedBanners.filter(b => b.type === 'SIDEBAR_PROMO');
  const offerBanners = typedBanners.filter(b => b.type === 'OFFER_SECTION');
  const bestSellerBanners = typedBanners.filter(b => b.type === 'BEST_SELLER_SECTION');

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#F2F2F2]">

      {/* Announcement Bar moved to Navbar/Layout */}

      {/* Main Home Banners - High Priority */}
      <div className="w-full">
        <Banner banners={mainBanners} />
      </div>

      {/* Marketing Trust Bar - REMOVED */}
      {/* <TrustBar /> */}

      {/* Flash Sale / Countdown - Dynamic Positioning */}
      {countdownBanners.length > 0 && <CountdownBanner banner={countdownBanners[0]} />}

      {/* Visual Category Grid - Unified Gap */}
      <div className="relative z-20">
        <CategoryGrid categories={topCategories} />
      </div>

      {/* Modern Style Quiz - Find Your Weave (Hidden for later) */}
      {/* <HeritageQuiz /> */}

      {/* Featured Section with Sidebar Promos */}
      {/* Featured Section - Full Width */}
      {/* Featured Section with Sidebar Promos */}
      {sidebarBanners.length > 0 && (
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <Banner banners={sidebarBanners} type="section" />
        </div>
      )}

      {/* Latest Products - Unified Gap */}
      {latestProducts.length > 0 && (
        <div className="relative z-20 mb-8">
          <LatestProducts products={latestProducts} session={session} />
        </div>
      )}


      {/* Streaming Category Sections */}
      <Suspense fallback={<><ProductSectionSkeleton /><ProductSectionSkeleton /></>}>
        <ShoppingErrorBoundary fallbackTitle="Collection Temporarily Unavailable">
          <CategoryProductSections
            topCategories={topCategories}
            session={session}
            bestSellerBanners={bestSellerBanners}
            offerBanners={offerBanners}
          />
        </ShoppingErrorBoundary>
      </Suspense>

      {/* Streaming Offers */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <ShoppingErrorBoundary fallbackTitle="Exclusive Offers Currently Unavailable">
          <OfferSection session={session} />
        </ShoppingErrorBoundary>
      </Suspense>

      {/* Social Proof Gallery */}
      <ThulasiWomenGallery />

      {/* Heritage Stories Blog Preview */}
      <HeritageChronicles />
    </div>
  );
}
