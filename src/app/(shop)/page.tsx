import Banner from '@/components/shop/Banner';
import ProductSection from '@/components/shop/ProductSection';
import LatestProducts from '@/components/shop/LatestProducts';
import { getBanners } from '@/lib/actions/banner';
import { getProducts } from '@/lib/actions/product';
import { getCategoriesTree } from '@/lib/actions/category';
import { getSession } from '@/lib/auth';

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
  // 1. Fetch Categories first to determine what sections to show
  const { data: categories } = await getCategoriesTree();
  const topCategories = (categories || []).slice(0, 4); // Display top 4 categories

  // 2. Prepare promises for all data
  const dataPromises = [
    getBanners({ isActive: true, pageSize: 50 }),           // 0: Banners
    getProducts({ limit: 8 }),                              // 1: Latest (fallback)
    getProducts({ isFeatured: true, limit: 5 }),            // 2: Featured
    getProducts({ isBestSeller: true, limit: 5 }),          // 3: Best Sellers
    getProducts({ isOffer: true, limit: 5 }),               // 4: Offers
    getSession(),                                           // 5: Session
    ...topCategories.map(cat => getProducts({ categorySlug: cat.slug, limit: 5 })) // 6+: Category Products
  ];

  const results = await Promise.all(dataPromises);

  // 3. Extract Data
  const allBanners = (results[0] as any).data || [];
  const latestProducts = (results[1] as any).data || [];
  const featuredProducts = (results[2] as any).data || [];
  const bestSellers = (results[3] as any).data || [];
  const offerProducts = (results[4] as any).data || [];
  const session = results[5] as any;

  // Extract Category Products
  const categorySections = topCategories.map((cat, index) => ({
    category: cat,
    products: (results[6 + index] as any).data || []
  }));

  const typedBanners = allBanners as BannerItem[];
  const mainBanners = typedBanners.filter(b => b.type === 'HOME_MAIN');
  const offerBanners = typedBanners.filter(b => b.type === 'OFFER_SECTION');
  const bestSellerBanners = typedBanners.filter(b => b.type === 'BEST_SELLER_SECTION');

  return (
    <div className="flex flex-col min-h-screen pb-10 bg-[#F2F2F2]">
      {/* Main Home Banners */}
      <div className="relative z-10">
        <Banner banners={mainBanners} type="main" />
      </div>


      {/* 1. Latest Products (Global) */}
      {latestProducts.length > 0 && (
        <div className="bg-white py-12">
          {/* <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-8 px-6 max-w-[1700px] mx-auto">Fresh Drops</h2> */}
          <LatestProducts products={latestProducts} session={session} />
        </div>
      )}

      {/* 2. Dynamic Category Sections */}
      {categorySections.map(({ category, products }, index) => {
        if (!products || products.length === 0) return null;

        // Alternate background variations
        const isGray = index % 2 === 0;

        return (
          <div key={category.id}>
            {/* Inject Banners in between sections */}
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

      {/* 3. Featured / Offers (If distinct from categories) */}
      {offerProducts.length > 0 && (
        <ProductSection
          title="Limited Time Offers"
          subtitle="Grab these deals before they are gone"
          products={offerProducts}
          bgVariant="white"
          viewAllLink="/collections/offers"
          session={session}
        />
      )}

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
