import Banner from '@/components/shop/Banner';
import ProductSection from '@/components/shop/ProductSection';
import LatestProducts from '@/components/shop/LatestProducts';
import GatewayGrid from '@/components/shop/GatewayGrid';
import QuadCard from '@/components/shop/QuadCard';
import { getBanners } from '@/lib/actions/banner';
import { getProducts } from '@/lib/actions/product';
import { getCategoriesTree } from '@/lib/actions/category';

export const dynamic = 'force-dynamic';

interface BannerItem {
  id: string;
  imageUrl: string;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  link: string | null;
  type: string;
  isActive: boolean;
  order: number;
}

export default async function ShopHome() {
  const [
    { data: allBanners },
    { data: latestProducts },
    { data: featuredProducts },
    { data: bestSellers },
    { data: offerProducts },
    { data: categoriesTree }
  ] = await Promise.all([
    getBanners({ isActive: true, pageSize: 50 }),
    getProducts({ limit: 5 }),
    getProducts({ isFeatured: true, limit: 4 }),
    getProducts({ isBestSeller: true, limit: 4 }),
    getProducts({ isOffer: true, limit: 4 }),
    getCategoriesTree()
  ]);

  const typedBanners = (allBanners || []) as unknown as BannerItem[];
  const mainBanners = typedBanners.filter(b => b.type === 'HOME_MAIN');
  const offerBanners = typedBanners.filter(b => b.type === 'OFFER_SECTION');
  const bestSellerBanners = typedBanners.filter(b => b.type === 'BEST_SELLER_SECTION');


  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#F2F2F2]">
      {/* Main Home Banners */}
      <div className="relative z-10">
        <Banner banners={mainBanners} type="main" />
      </div>

      {/* Advanced Latest Product Listing */}
      {latestProducts && latestProducts.length > 0 && (
        <div className="bg-white py-12">
          <LatestProducts products={latestProducts} />
        </div>
      )}

      {/* Featured Products */}
      <ProductSection
        title="Heritage Masterpieces"
        subtitle="Handpicked premium pieces for your wardrobe"
        products={featuredProducts || []}
        bgVariant="white"
      />

      {/* Best Sellers Section with its own Banner */}
      {bestSellerBanners.length > 0 && <Banner banners={bestSellerBanners} type="section" />}
      <ProductSection
        title="Crowd Favorites"
        subtitle="Most loved and trending styles right now"
        products={bestSellers || []}
        bgVariant="gray"
      />

      {/* Special Offers Section with its own Banner */}
      {offerBanners.length > 0 && <Banner banners={offerBanners} type="section" />}
      <ProductSection
        title="Flash Deals"
        subtitle="Limited time seasonal discounts"
        products={offerProducts || []}
        bgVariant="white"
      />

      {/* Newsletter / Footer Promo */}
      <section className="bg-orange-600 py-24 mt-12 overflow-hidden relative">
        <div className="max-w-[1700px] mx-auto px-4 lg:px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter italic">Join the Thulasi Textiles Journey</h2>
          <p className="text-white/80 font-medium mb-12 max-w-xl mx-auto">Subscribe to get early access to exclusive collection drops and master artisan stories.</p>
          <div className="flex flex-col sm:row gap-4 max-w-lg mx-auto bg-white/10 p-2 rounded-[3rem] backdrop-blur-md">
            <input type="email" placeholder="Your best email..." className="flex-1 px-8 py-5 rounded-full font-bold bg-white text-gray-900 focus:outline-none shadow-xl" />
            <button className="bg-black text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-2xl active:scale-95">Subscribe</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
      </section>
    </div>
  );
}
