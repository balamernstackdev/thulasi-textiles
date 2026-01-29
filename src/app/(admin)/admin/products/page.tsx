import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { getProducts, getFilterValues } from '@/lib/actions/product';
import Pagination from '@/components/shared/Pagination';
import AdminProductFilters from '@/components/admin/AdminProductFilters';
import AdminProductTable from '@/components/admin/AdminProductTable';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{
        page?: string,
        q?: string,
        sizes?: string,
        colors?: string,
        fabrics?: string
    }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const query = params.q || '';
    const sizes = params.sizes?.split(',').filter(Boolean);
    const colors = params.colors?.split(',').filter(Boolean);
    const fabrics = params.fabrics?.split(',').filter(Boolean);

    const pageSize = 10;

    const [productsResult, filterAttributesResult] = await Promise.all([
        getProducts({
            page,
            pageSize,
            search: query,
            sizes,
            colors,
            fabrics,
        }),
        getFilterValues()
    ]);

    const products = productsResult.success && 'data' in productsResult ? productsResult.data : [];
    const pagination = productsResult.success && 'pagination' in productsResult ? productsResult.pagination : null;
    const filterAttributes = filterAttributesResult.success ? filterAttributesResult.data : undefined;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Products</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage your product catalog</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <Link href="/admin/products/bulk">
                        <Button variant="outline" className="w-full sm:w-auto border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-black font-black text-[10px] uppercase tracking-widest px-6 py-6 sm:py-2.5 rounded-xl">
                            Bulk Edit
                        </Button>
                    </Link>
                    <Link href="/admin/products/new">
                        <Button className="w-full sm:w-auto bg-[#2dd4bf] text-[#1e293b] hover:bg-[#2dd4bf]/90 font-black text-[10px] uppercase tracking-widest px-8 py-6 sm:py-2.5 rounded-xl shadow-lg shadow-teal-500/20">
                            <Plus className="w-4 h-4 mr-2" /> Add Product
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <AdminProductFilters filterAttributes={filterAttributes} />

                <AdminProductTable products={products} />
            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    baseUrl="/admin/products"
                />
            )}
        </div>
    );
}
