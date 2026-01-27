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
      const { data: products } = await getProducts({ categorySlug: cat.slug, limit: 5 });
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
  const { data: offerProducts } = await getProducts({ isOffer: true, limit: 5 });

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
  const { data: latestProducts = [] } = await getProducts({ isNew: true, limit: 10 });
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
      <div className="relative z-10 w-full px-4 sm:px-8 md:px-12 lg:px-20 pt-4">
        <div className="max-w-[1700px] mx-auto">
          <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-lg md:shadow-2xl">
            <Banner banners={mainBanners} />
          </div>
        </div>
      </div>

      {/* Marketing Trust Bar */}
      <TrustBar />

      {/* Flash Sale / Countdown - Dynamic Positioning */}
      {countdownBanners.length > 0 && <CountdownBanner banner={countdownBanners[0]} />}

      {/* Visual Category Grid - Dynamic */}
      <CategoryGrid categories={topCategories} />

      {/* Modern Style Quiz - Find Your Weave */}
      <HeritageQuiz />

      {/* Featured Section with Sidebar Promos */}
      <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {latestProducts.length > 0 && (
              <div className="bg-white rounded-[2.5rem] p-4 md:p-10 shadow-sm border border-gray-100 h-full">
                <LatestProducts products={latestProducts} session={session} />
              </div>
            )}
          </div>
          <div className="space-y-8">
            {sidebarBanners.slice(0, 2).map((banner, i) => (
              <SidebarPromo key={i} banner={banner} />
            ))}
          </div>
        </div>
      </div>

      {/* Streaming Category Sections */}
      <Suspense fallback={<><ProductSectionSkeleton /><ProductSectionSkeleton /></>}>
        <CategoryProductSections
          topCategories={topCategories}
          session={session}
          bestSellerBanners={bestSellerBanners}
          offerBanners={offerBanners}
        />
      </Suspense>

      {/* Streaming Offers */}
      <Suspense fallback={<ProductSectionSkeleton />}>
        <OfferSection session={session} />
      </Suspense>

      {/* Heritage Stories Blog Preview */}
      <HeritageChronicles />

      {/* Newsletter / Footer Promo */}
      <section className="bg-orange-600 py-24 mt-12 overflow-hidden relative">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">Stay in the Loop</h2>
          <p className="text-white/80 font-medium mb-12 max-w-xl mx-auto">Subscribe for exclusive collection drops, artisan stories, and heritage weave updates.</p>
          <NewsletterForm />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-20" />
      </section>
    </div>
  );
}
