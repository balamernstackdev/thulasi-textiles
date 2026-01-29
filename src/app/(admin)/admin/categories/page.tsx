import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Package, Search, Filter } from 'lucide-react';
import { getCategories } from '@/lib/actions/category';
import Pagination from '@/components/shared/Pagination';
import RefreshCacheButton from '@/components/admin/RefreshCacheButton';
import DeleteCategoryButton from '@/components/admin/DeleteCategoryButton';

export const dynamic = 'force-dynamic';

export default async function CategoriesPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const pageSize = 10;

    const { data: categories, pagination } = await getCategories({ page, pageSize });

    return (
        <div className="p-4 md:p-8 w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Categories</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Organize your products</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <RefreshCacheButton />
                    <Link href="/admin/categories/new" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 sm:py-2.5 rounded-xl flex items-center justify-center transition-colors font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 border-none">
                            <Plus className="w-4 h-4 mr-2" /> Add Category
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="space-y-6">
                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                                placeholder="Search categories..."
                                className="pl-12 pr-4 h-12 w-full border-2 border-gray-50 bg-gray-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-bold text-gray-900"
                            />
                        </div>
                        <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 border-transparent">
                            <Filter className="w-4 h-4 mr-2" /> Filter catalog
                        </Button>
                    </div>

                    {/* Table */}
                    {(!categories || categories.length === 0) ? (
                        <div className="p-12 text-center">
                            <div className="max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                                <p className="text-gray-500 text-sm mb-6">Start organizing your products by creating categories</p>
                                <Link href="/admin/categories/new">
                                    <Button className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-xs">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create First Category
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
                                        <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Parent</th>
                                        <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {categories.map((cat: any) => (
                                        <tr key={cat.id} className="hover:bg-gray-50/30 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black text-xl shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                                        {cat.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{cat.name}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{cat.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {cat.parent ? (
                                                    <span className="text-[10px] font-black text-gray-600 bg-gray-100/50 px-3 py-1.5 rounded-lg uppercase tracking-wider">
                                                        {cat.parent.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-300 font-bold uppercase italic tracking-widest">Top Level</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/categories/${cat.id}`}>
                                                        <div className="text-gray-300 hover:text-orange-600 p-3 hover:bg-orange-50 rounded-xl transition-all active:scale-90 cursor-pointer">
                                                            <Edit2 className="w-5 h-5" />
                                                        </div>
                                                    </Link>
                                                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    baseUrl="/admin/categories"
                />
            )}
        </div>
    );
}
