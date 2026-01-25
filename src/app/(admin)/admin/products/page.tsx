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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Products</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-[#2dd4bf] text-[#1e293b] hover:bg-[#2dd4bf]/90 font-black text-[10px] uppercase tracking-widest px-8 py-6 sm:py-2.5 rounded-xl shadow-lg shadow-teal-500/20">
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            placeholder="Search products..."
                            className="pl-12 pr-4 h-12 w-full border-2 border-gray-50 bg-gray-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] focus:bg-white transition-all font-bold text-gray-900"
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 border-gray-100 hover:bg-gray-50">
                        <Filter className="w-4 h-4 mr-2" /> Filter catalog
                    </Button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Stock</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.map((product: any) => (
                                <tr key={product.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex-shrink-0 relative overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-110">
                                                {product.images?.[0] ? (
                                                    <img
                                                        src={product.images[0].url}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[8px] font-black uppercase bg-gray-50">
                                                        No Img
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors">{product.name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{product.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-wider">{product.category?.name || 'Uncategorized'}</td>
                                    <td className="px-6 py-5 text-sm font-black text-gray-900 italic">₹{parseFloat(product.basePrice).toLocaleString()}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900">
                                                {product.variants?.reduce((sum: number, v: any) => sum + v.stock, 0) || 0}
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">Units In Box</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${product.isActive
                                            ? 'bg-emerald-50 text-emerald-600'
                                            : 'bg-rose-50 text-rose-600'
                                            }`}>
                                            {product.isActive ? 'Active' : 'Private'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/products/${product.id}/edit`}
                                                className="text-gray-300 hover:text-emerald-500 p-3 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
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
