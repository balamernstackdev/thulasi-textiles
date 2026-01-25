import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import { getProducts } from '@/lib/actions/product';
import Pagination from '@/components/shared/Pagination';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const pageSize = 10;

    const { data: products, pagination } = await getProducts({
        page,
        pageSize
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                    <p className="text-gray-500">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-[#2dd4bf] text-[#1e293b] hover:bg-[#2dd4bf]/90 font-medium">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            placeholder="Search products..."
                            className="pl-9 pr-4 py-2 w-full border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 border-gray-200"
                        />
                    </div>
                    <Button variant="outline" className="text-gray-600 border-gray-200">
                        <Filter className="w-4 h-4 mr-2" /> Filter
                    </Button>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#f8fafc] border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-900 text-sm">Product</th>
                            <th className="p-4 font-semibold text-gray-900 text-sm">Category</th>
                            <th className="p-4 font-semibold text-gray-900 text-sm">Price</th>
                            <th className="p-4 font-semibold text-gray-900 text-sm">Stock</th>
                            <th className="p-4 font-semibold text-gray-900 text-sm">Status</th>
                            <th className="p-4 font-semibold text-gray-900 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {products?.map((product: any) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                            {product.images?.[0] ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs uppercase bg-gray-100">
                                                    Img
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{product.name}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">{product.category?.name || 'Uncategorized'}</td>
                                <td className="p-4 text-sm font-bold text-gray-900">₹{parseFloat(product.basePrice).toLocaleString()}</td>
                                <td className="p-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-700">
                                            {product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Units In Stock</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.isActive
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-rose-100 text-rose-700'
                                        }`}>
                                        {product.isActive ? 'Active' : 'Private'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-gray-400">
                                        <Link
                                            href={`/admin/products/${product.id}/edit`}
                                            className="hover:text-emerald-500 p-2 transition-colors cursor-pointer block"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <DeleteProductButton id={product.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!products || products.length === 0) && (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <Search className="w-8 h-8 text-gray-300 mb-2" />
                                        <p className="font-bold">No products found matching your criteria</p>
                                        <Link href="/admin/products/new">
                                            <Button variant="link" className="text-[#2dd4bf] mt-2 font-black uppercase tracking-widest text-xs">Create New Product</Button>
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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
