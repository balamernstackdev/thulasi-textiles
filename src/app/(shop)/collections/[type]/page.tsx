import { getProducts } from '@/lib/actions/product';
import ProductCard from '@/components/shop/ProductCard';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { ChevronRight, Filter, ChevronDown } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

const COLLECTION_CONFIG: Record<string, { title: string; filter: any; breadcrumb: string }> = {
    'new-arrivals': {
        title: 'New Arrivals',
        filter: {}, // Default is newest first anyway
        breadcrumb: 'New Arrivals'
    },
    'best-sellers': {
        title: 'Best Sellers',
        filter: { isBestSeller: true },
        breadcrumb: 'Best Sellers'
    },
    'featured': {
        title: 'Featured Collection',
        filter: { isFeatured: true },
        breadcrumb: 'Featured'
    },
    'offers': {
        title: 'Special Offers',
        filter: { isOffer: true },
        breadcrumb: 'Offers'
    }
};

export default async function CollectionPage({
    params,
    searchParams
}: {
    params: Promise<{ type: string }>,
    searchParams: Promise<{ page?: string }>
}) {
    const { type } = await params;
    const config = COLLECTION_CONFIG[type];

    if (!config) {
        notFound();
    }

    const sParams = await searchParams;
    const page = parseInt(sParams.page || '1');
    const pageSize = 12;

    const [productsResult, session] = await Promise.all([
        getProducts({
            ...config.filter,
            page,
            pageSize
        }),
        getSession()
    ]);

    const products = productsResult.success && 'data' in productsResult ? productsResult.data : [];
    const pagination = productsResult.success && 'pagination' in productsResult ? productsResult.pagination : null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-[160px] z-40 transition-all duration-300 hidden lg:block">
                <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        <span className="text-gray-900 uppercase tracking-widest">{config.breadcrumb}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-4 lg:px-6 py-8">
                <div className="flex flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-tighter italic">{config.title}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {pagination?.total || 0} Products in this collection
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                Sorting by Newest
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
                                        baseUrl={`/collections/${type}`}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Collection is currently empty</h2>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">We're curating new items for this collection. Please check back soon!</p>
                            <Link href="/" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition-colors">
                                Explore Store
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
