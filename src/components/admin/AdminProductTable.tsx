'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Search, Check } from 'lucide-react';
import { deleteProducts } from '@/lib/actions/product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteConfirmation from './DeleteConfirmation';
import DeleteProductButton from './DeleteProductButton';

export default function AdminProductTable({ products }: { products: any[] }) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const toggleSelectAll = () => {
        if (selectedIds.length === products.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(products.map(p => p.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteProducts(selectedIds);
            if (result.success) {
                toast.success(`${selectedIds.length} products removed from collection`);
                setSelectedIds([]);
                router.refresh();
            } else {
                toast.error(result.error || 'Failed to delete products');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
            {selectedIds.length > 0 && (
                <div className="bg-teal-50/50 border-b border-teal-100 px-6 py-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white scale-90">
                            <Check className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black text-teal-900 uppercase tracking-widest">
                            {selectedIds.length} Products Selected
                        </span>
                    </div>
                    <DeleteConfirmation
                        title={`Delete ${selectedIds.length} Products?`}
                        description={`This action will permanently remove ${selectedIds.length} masterpieces from your collection. This cannot be undone.`}
                        onConfirm={handleBulkDelete}
                        trigger={
                            <button className="flex items-center gap-2 bg-rose-50 text-rose-600 hover:bg-rose-100 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-rose-200/50 active:scale-95 disabled:opacity-50" disabled={isDeleting}>
                                <Trash2 className="w-4 h-4" /> Delete Selected
                            </button>
                        }
                    />
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                        <tr>
                            <th className="px-6 py-5 w-12 text-center">
                                <button
                                    onClick={toggleSelectAll}
                                    className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedIds.length === products.length && products.length > 0
                                            ? 'bg-teal-500 border-teal-500'
                                            : 'border-gray-200 hover:border-teal-500'
                                        }`}
                                >
                                    {selectedIds.length === products.length && products.length > 0 && (
                                        <Check className="w-3 h-3 text-white" />
                                    )}
                                </button>
                            </th>
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
                            <tr key={product.id} className={`hover:bg-gray-50/30 transition-colors group ${selectedIds.includes(product.id) ? 'bg-teal-50/20' : ''}`}>
                                <td className="px-6 py-5 text-center">
                                    <button
                                        onClick={() => toggleSelect(product.id)}
                                        className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${selectedIds.includes(product.id)
                                                ? 'bg-teal-500 border-teal-500'
                                                : 'border-gray-200 hover:border-teal-500'
                                            }`}
                                    >
                                        {selectedIds.includes(product.id) && (
                                            <Check className="w-3 h-3 text-white" />
                                        )}
                                    </button>
                                </td>
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
                                            <p className="font-black text-gray-900 group-hover:text-teal-600 transition-colors text-sm">{product.name}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{product.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-[10px] font-black text-teal-600 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">
                                        {product.category?.name || 'Uncategorized'}
                                    </span>
                                </td>
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
                                <td colSpan={7} className="p-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                            <Search className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <p className="font-black text-gray-900 uppercase tracking-widest text-xs">No products found matching your matrix</p>
                                        <Link href="/admin/products" className="mt-4 text-teal-600 text-[10px] font-black uppercase tracking-widest hover:underline">Reset Search</Link>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
