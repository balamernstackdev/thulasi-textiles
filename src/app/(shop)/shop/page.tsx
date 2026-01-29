import { getProducts, getFilterValues } from '@/lib/actions/product';
import { getCategoriesTree } from '@/lib/actions/category';
import ProductCard from '@/components/shop/ProductCard';
import ProductFilters from '@/components/shop/ProductFilters';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { ChevronRight, Filter, ShoppingBag } from 'lucide-react';
import { getSession } from '@/lib/auth';
import ProductSort from '@/components/shop/ProductSort';
import FilterToggle from '@/components/shop/FilterToggle';
import { getBanners } from '@/lib/actions/banner';
import AnnouncementTicker from '@/components/shop/AnnouncementTicker';
import Banner from '@/components/shop/Banner';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
    searchParams
}: {
    searchParams: Promise<{
        page?: string,
        minPrice?: string,
        maxPrice?: string,
        sizes?: string,
        colors?: string,
        materials?: string,
        fabrics?: string,
        occasions?: string,
        sort?: string,
        category?: string
    }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
    const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;

    const sizes = params.sizes?.split(',').filter(Boolean);
    const colors = params.colors?.split(',').filter(Boolean);
    const materials = params.materials?.split(',').filter(Boolean);
    const fabrics = params.fabrics?.split(',').filter(Boolean);
    const occasions = params.occasions?.split(',').filter(Boolean);

    const sort = params.sort;
    const categorySlug = params.category;
    const pageSize = 15;

    const [productsResult, categoriesResult, filterAttributesResult, bannersResult, session] = await Promise.all([
        getProducts({
            search: '',
            minPrice,
            maxPrice,
            sizes,
            colors,
            materials,
            fabrics,
            occasions,
            sort,
            categorySlug,
            page,
            pageSize
        }),
        getCategoriesTree(),
        getFilterValues(),
        getBanners({ isActive: true }),
        getSession()
    ]);

    const products = productsResult.success && 'data' in productsResult ? productsResult.data : [];
    const categories = categoriesResult.success ? categoriesResult.data : [];
    const filterAttributes = filterAttributesResult.success ? filterAttributesResult.data : undefined;
    const pagination = productsResult.success && 'pagination' in productsResult ? productsResult.pagination : null;
    const allBanners = (bannersResult.data || []) as any[];

    const announcementBanners = allBanners.filter(b => b.type === 'ANNOUNCEMENT');

    // Maybe use a different banner type for Shop page or generic one
    const shopBanners = allBanners.filter(b => b.type === 'HERO').slice(0, 1);

    return (
        <div className="bg-white min-h-screen">
            {/* Announcement Bar */}
            {announcementBanners.length > 0 && <AnnouncementTicker banners={announcementBanners} />}

            {/* Shop Banner */}
            {shopBanners.length > 0 && (
                <div className="mt-4">
                    <Banner banners={shopBanners} type="section" />
                </div>
            )}

            {/* Breadcrumbs */}
            <div className="bg-[#f9f9f9]/80 backdrop-blur-md border-b border-gray-100 relative z-40 transition-all duration-300 hidden lg:block">
                <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-4">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        <span className="text-gray-900 uppercase tracking-widest">Shop All</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters (Desktop) */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-10">
                        <ProductFilters categories={categories} filterAttributes={filterAttributes} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title & Stats */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none mb-4">
                                    Shop <span className="text-orange-600">Collection</span>
                                </h1>
                                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">
                                    Explore our complete range of authentic textiles
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    {pagination?.total || 0} Products found
                                </p>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <FilterToggle categories={categories} filterAttributes={filterAttributes} />
                                <ProductSort />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products && products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
                                    {products.map((product: any) => (
                                        <ProductCard key={product.id} product={product} session={session} />
                                    ))}
                                </div>
                                {pagination && (
                                    <div className="mt-12">
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.totalPages}
                                            baseUrl={`/shop`}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">
                                    We couldn't find matches. Try adjusting your filters.
                                </p>
                                <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-100">
                                    Continue Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
