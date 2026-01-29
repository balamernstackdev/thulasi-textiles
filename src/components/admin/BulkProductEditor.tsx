'use client';

import { useState, useCallback, useEffect } from 'react';
import { Save, Search, Filter, RefreshCw, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { bulkUpdateProductPrice, bulkToggleProductVisibility } from '@/lib/actions/product';

export default function BulkProductEditor({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [bulkAction, setBulkAction] = useState<'none' | 'increase_price' | 'decrease_price' | 'visibility_on' | 'visibility_off'>('none');
    const [actionValue, setActionValue] = useState(0); // For percentage
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Filter Logic
    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredProducts.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredProducts.map(p => p.id)));
        }
    };

    const toggleSelect = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    const executeBulkAction = async () => {
        if (selectedIds.size === 0) return;
        setLoading(true);
        setStatusMessage(null);

        try {
            let result;
            const ids = Array.from(selectedIds);

            if (bulkAction === 'increase_price' || bulkAction === 'decrease_price') {
                result = await bulkUpdateProductPrice(ids, actionValue, bulkAction === 'increase_price' ? 'increase' : 'decrease');
            } else if (bulkAction === 'visibility_on' || bulkAction === 'visibility_off') {
                result = await bulkToggleProductVisibility(ids, bulkAction === 'visibility_on');
            }

            if (result?.success) {
                setStatusMessage({ type: 'success', text: `Successfully updated ${ids.length} products.` });
                router.refresh();
                setSelectedIds(new Set()); // Clear selection
            } else {
                setStatusMessage({ type: 'error', text: 'Failed to update products. Please try again.' });
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'An unexpected error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-10">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none"
                    >
                        <option value="all">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <select
                        value={bulkAction}
                        onChange={(e) => setBulkAction(e.target.value as any)}
                        className="flex-1 md:w-48 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-orange-500"
                    >
                        <option value="none">Select Action...</option>
                        <option value="increase_price">Increase Price (%)</option>
                        <option value="decrease_price">Decrease Price (%)</option>
                        <option value="visibility_on">Set Active</option>
                        <option value="visibility_off">Set Inactive</option>
                    </select>

                    {(bulkAction.includes('price')) && (
                        <input
                            type="number"
                            placeholder="%"
                            value={actionValue}
                            onChange={(e) => setActionValue(Number(e.target.value))}
                            className="w-20 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold"
                        />
                    )}

                    <button
                        onClick={executeBulkAction}
                        disabled={loading || bulkAction === 'none' || selectedIds.size === 0}
                        className="px-6 py-2 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Apply
                    </button>
                </div>
            </div>

            {statusMessage && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold">{statusMessage.text}</span>
                </div>
            )}

            {/* Grid */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.size === filteredProducts.length && filteredProducts.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                </th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Price</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stock</th>
                                <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className={`hover:bg-orange-50/30 transition-colors ${selectedIds.has(product.id) ? 'bg-orange-50/50' : ''}`}>
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(product.id)}
                                            onChange={() => toggleSelect(product.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 relative overflow-hidden shrink-0">
                                                {product.images[0] && (
                                                    <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{product.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono">{product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-block px-2 py-1 rounded-md bg-gray-100 text-xs font-bold text-gray-600">
                                            {product.category?.name}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-gray-900">
                                        ₹{Number(product.basePrice).toLocaleString()}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`font-bold text-xs ${product.variants.reduce((acc: number, v: any) => acc + v.stock, 0) < 5 ? 'text-red-500' : 'text-gray-900'}`}>
                                            {product.variants.reduce((acc: number, v: any) => acc + v.stock, 0)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => {
                                                // Individual toggle could go here
                                            }}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                        >
                                            {product.isActive ? 'Active' : 'Draft'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
