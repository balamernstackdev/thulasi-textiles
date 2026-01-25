import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { getCategories } from '@/lib/actions/category';
import Pagination from '@/components/shared/Pagination';

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
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-500 mt-1">Organize your products into categories and subcategories</p>
                </div>
                <Link href="/admin/categories/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Category
                    </Button>
                </Link>
            </div>

            {/* Categories Table */}
            {(!categories || categories.length === 0) ? (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
                    <div className="max-w-sm mx-auto">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                        <p className="text-gray-500 text-sm mb-6">Start organizing your products by creating categories</p>
                        <Link href="/admin/categories/new">
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Create First Category
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Category Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Parent Category
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {categories.map((cat: any) => (
                                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-semibold">
                                                {cat.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{cat.name}</p>
                                                <p className="text-xs text-gray-500">/{cat.slug}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {cat.parent ? (
                                            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                                                {cat.parent.name}
                                            </span>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">None (Top Level)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/categories/${cat.id}`}>
                                                <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

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
