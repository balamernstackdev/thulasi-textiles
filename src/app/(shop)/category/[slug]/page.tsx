import { getCategoryBySlug } from '@/lib/actions/category';
import { getProducts } from '@/lib/actions/product';

export const dynamic = 'force-dynamic';
import ProductCard from '@/components/shop/ProductCard';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { ChevronRight, Filter, ChevronDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function CategoryPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { slug } = await params;
    const sParams = await searchParams;
    const page = parseInt(sParams.page || '1');
    const pageSize = 10;

    const [{ data: category }, session] = await Promise.all([
        getCategoryBySlug(slug),
        getSession()
    ]);

    if (!category) {
        notFound();
    }

    const productsResult = await getProducts({
        categorySlug: slug,
        page,
        pageSize
    });

    const products = productsResult.success && 'data' in productsResult ? productsResult.data : [];
    const pagination = productsResult.success && 'pagination' in productsResult ? productsResult.pagination : null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs - Standardized Offset for Header Alignment */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-[160px] z-40 transition-all duration-300">
                <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        {category.parent && (
                            <>
                                <Link href={`/category/${category.parent.slug}`} className="hover:text-orange-600 transition-colors">
                                    {category.parent.name}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                            </>
                        )}
                        <span className="text-gray-900 truncate">{category.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters (Desktop) */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-10">
                        {/* Subcategories or Siblings */}
                        {((category.children && category.children.length > 0) || (category.parent?.children && category.parent.children.length > 0)) && (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">
                                    {category.children && category.children.length > 0 ? "Categories" : (category.parent?.name || "Categories")}
                                </h3>
                                <ul className="space-y-1">
                                    {(category.children && category.children.length > 0 ? category.children : category.parent?.children || []).map((navItem: any) => {
                                        const isActive = navItem.slug === slug;
                                        return (
                                            <li key={navItem.id}>
                                                <Link
                                                    href={`/category/${navItem.slug}`}
                                                    className={`group text-[13px] py-3.5 px-5 rounded-2xl transition-all flex items-center justify-between border-2 border-transparent ${isActive
                                                        ? "bg-orange-50 border-orange-100/50 text-orange-600 font-black"
                                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-bold"
                                                        }`}
                                                >
                                                    <span>{navItem.name}</span>
                                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isActive ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                                                        }`} />
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Visual Filter Placeholder */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Filters</h3>
                            <div className="space-y-8">
                                <div>
                                    <p className="text-sm font-bold text-gray-900 mb-4">Price Range</p>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs text-black">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Min"
                                                className="w-full text-xs border border-gray-200 pl-7 pr-3 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none"
                                            />
                                        </div>
                                        <span className="text-gray-300">/</span>
                                        <div className="relative flex-1">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs text-black font-bold">₹</span>
                                            <input
                                                type="number"
                                                placeholder="Max"
                                                className="w-full text-xs border border-gray-200 pl-7 pr-3 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-black font-bold"
                                            />
                                        </div>
                                    </div>
                                    <button className="w-full bg-orange-600 text-white text-[10px] uppercase tracking-widest font-black py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-50">
                                        Apply Filter
                                    </button>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Title & Sorting */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-extrabold text-gray-900">{category.name}</h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {pagination?.total || 0} Products found
                                </p>
                            </div>

                            <div className="flex items-center gap-3 self-end md:self-auto">
                                <button className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium">
                                    <Filter className="w-4 h-4" /> Filters
                                </button>
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium">
                                        Sort by: Newest <ChevronDown className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {products && products.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {products.map((product: any) => (
                                        <ProductCard key={product.id} product={product} session={session} />
                                    ))}
                                </div>
                                {pagination && (
                                    <div className="mt-12">
                                        <Pagination
                                            currentPage={pagination.page}
                                            totalPages={pagination.totalPages}
                                            baseUrl={`/category/${slug}`}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
                                <h2 className="text-xl font-bold text-gray-900 mb-2">No products found</h2>
                                <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">We couldn't find any products in this category at the moment.</p>
                                <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors">
                                    Explore More
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
