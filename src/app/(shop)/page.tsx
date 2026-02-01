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
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-6 space-y-12">
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <Banner banners={sidebarBanners} type="section" />
          </div>
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

      {/* Newsletter / Footer Promo */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 mt-6">
        <section className="bg-[#E8510D] py-12 pb-16 rounded-3xl md:rounded-[5rem] overflow-hidden relative shadow-2xl">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-[-0.05em] italic leading-tight drop-shadow-sm">STAY IN THE LOOP</h2>
            <p className="text-white/95 text-sm md:text-base font-normal mb-10 max-w-2xl mx-auto leading-relaxed">Subscribe for exclusive collection drops, artisan stories, and heritage weave updates.</p>
            <div className="max-w-2xl mx-auto">
              <NewsletterForm />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-20" />
        </section>
      </div>
    </div>
  );
}
