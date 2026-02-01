import { getCategoryBySlug, getCategoriesTree } from '@/lib/actions/category';
import { getProducts, getFilterValues } from '@/lib/actions/product';

import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;

    if (slug === 'new-arrivals') {
        return {
            title: 'New Arrivals | Thulasi Textiles',
            description: 'Explore our latest collection of authentic handloom sarees and dhotis.',
        };
    }

    if (slug === 'all') {
        return {
            title: 'All Products | Thulasi Textiles',
            description: 'Browse our complete catalog of heritage textiles.',
        }
    }

    const { data: category } = await getCategoryBySlug(slug);
    if (!category) return { title: 'Category Not Found' };

    return {
        title: `${category.name} Collection | Thulasi Textiles`,
        description: category.description || `Shop authentic ${category.name} at Thulasi Textiles. Handcrafted tradition.`,
        openGraph: {
            title: `${category.name} - Thulasi Textiles`,
            description: category.description || `Shop authentic ${category.name}.`,
            images: [category.image || '/logo.png']
        }
    };
}
import ProductCard from '@/components/shop/ProductCard';
import InfiniteProductGrid from '@/components/shop/InfiniteProductGrid';
import Link from 'next/link';
import { ChevronRight, Filter, ChevronDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';
import ProductFilters from '@/components/shop/ProductFilters';
import ProductSort from '@/components/shop/ProductSort';
import FilterToggle from '@/components/shop/FilterToggle';

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{
        page?: string,
        minPrice?: string,
        maxPrice?: string,
        sizes?: string,
        colors?: string,
        materials?: string,
        fabrics?: string,
        occasions?: string,
        sort?: string
    }>
}) {
    const { slug } = await params;
    const isNewPage = slug === 'new-arrivals';
    const isAllPage = slug === 'all';
    const sParams = await searchParams;
    const page = parseInt(sParams.page || '1');
    const minPrice = sParams.minPrice ? parseFloat(sParams.minPrice) : undefined;
    const maxPrice = sParams.maxPrice ? parseFloat(sParams.maxPrice) : undefined;

    const sizes = sParams.sizes?.split(',').filter(Boolean);
    const colors = sParams.colors?.split(',').filter(Boolean);
    const materials = sParams.materials?.split(',').filter(Boolean);
    const fabrics = sParams.fabrics?.split(',').filter(Boolean);
    const occasions = sParams.occasions?.split(',').filter(Boolean);
    const sort = sParams.sort;

    const pageSize = 15;

    const [{ data: categoryData }, session, filterAttributesResult, categoriesTree] = await Promise.all([
        (isNewPage || isAllPage)
            ? Promise.resolve({ success: true, data: { name: isNewPage ? 'New Arrivals' : 'All Products', slug, parent: null, description: 'Explore our entire collection of heritage textiles' } })
            : getCategoryBySlug(slug),
        getSession(),
        getFilterValues(slug !== 'all' && slug !== 'new-arrivals' ? slug : undefined),
        getCategoriesTree()
    ]);

    const category = categoryData;

    if (!category && !isNewPage && !isAllPage) {
        notFound();
    }

    const productsResult = await getProducts({
        categorySlug: isNewPage ? undefined : slug,
        isNew: isNewPage ? true : undefined,
        page,
        pageSize,
        minPrice,
        maxPrice,
        sizes,
        colors,
        materials,
        fabrics,
        occasions,
        sort
    });

    const products = productsResult.success && 'data' in productsResult ? productsResult.data : [];
    const filterAttributes = filterAttributesResult.success ? filterAttributesResult.data : undefined;
    const pagination = productsResult.success && 'pagination' in productsResult ? productsResult.pagination : null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 relative z-40 transition-all duration-300 hidden lg:block">
                <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        {category?.parent && (
                            <>
                                <Link href={`/category/${category.parent.slug}`} className="hover:text-orange-600 transition-colors">
                                    {category.parent.name}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                            </>
                        )}
                        <span className="text-gray-900 truncate uppercase tracking-widest">{category?.name || 'New Arrivals'}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 py-6 md:py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters (Desktop) */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-10">
                        <ProductFilters filterAttributes={filterAttributes} />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title & Sorting */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
                            <div>
                                <h1 className="text-2xl md:text-5xl font-black text-gray-900 tracking-tight uppercase leading-tight mb-3 md:mb-4">
                                    {category?.name || 'Category'}
                                </h1>
                                {(category && 'description' in category && category.description) && (
                                    <p className="text-gray-500 font-bold uppercase tracking-[0.1em] md:tracking-[0.3em] text-[10px] mb-2">
                                        {category.description as string}
                                    </p>
                                )}
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    {pagination?.total || 0} Products found
                                </p>
                            </div>

                            <div className="flex items-center gap-2 md:gap-3 self-end md:self-auto mt-4 md:mt-0">
                                <FilterToggle categories={categoriesTree?.data || []} filterAttributes={filterAttributes} />
                                <ProductSort />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products && products.length > 0 ? (
                            <InfiniteProductGrid
                                initialProducts={products}
                                categorySlug={isNewPage ? undefined : slug}
                                isNew={isNewPage}
                                initialPagination={pagination as any}
                                searchParams={{
                                    minPrice,
                                    maxPrice,
                                    sizes,
                                    colors,
                                    materials,
                                    fabrics,
                                    occasions,
                                    sort
                                }}
                                session={session}
                            />
                        ) : (
                            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No products match these filters</h2>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Try adjusting your filters to find what you're looking for.</p>
                                <Link href={`/category/${slug}`} className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-50">
                                    Reset Filters
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
