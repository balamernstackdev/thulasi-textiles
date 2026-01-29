'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getInventoryItems, saveBulkIndividualUpdates } from '@/lib/actions/inventory';
import {
    Package,
    Search,
    Filter,
    Loader2,
    Save,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BulkInventoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [originalItems, setOriginalItems] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getInventoryItems();
            if (res.success) {
                setItems(res.data);
                setOriginalItems(JSON.parse(JSON.stringify(res.data)));
            }
        } catch (error) {
            toast.error("Failed to load inventory");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    const categories = useMemo(() =>
        Array.from(new Set(items.map(i => i.product.category?.name))).filter(Boolean)
        , [items]);

    const filteredItems = useMemo(() =>
        items.filter(item => {
            const matchesSearch = item.product.name.toLowerCase().includes(search.toLowerCase()) ||
                item.sku?.toLowerCase().includes(search.toLowerCase());
            const matchesCategory = filterCategory === 'ALL' || item.product.category?.name === filterCategory;
            return matchesSearch && matchesCategory;
        })
        , [items, search, filterCategory]);

    const handleCellChange = (id: string, field: 'price' | 'stock', value: string) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value === '' ? 0 : parseFloat(value) };
            }
            return item;
        }));
    };

    const changedItems = useMemo(() => {
        return items.filter(item => {
            const original = originalItems.find(o => o.id === item.id);
            if (!original) return false;
            return item.price !== original.price || item.stock !== original.stock;
        });
    }, [items, originalItems]);

    const handleSave = async () => {
        if (changedItems.length === 0) return;
        setSaving(true);

        const updates = changedItems.map(item => ({
            id: item.id,
            price: item.price,
            stock: item.stock
        }));

        try {
            const res = await saveBulkIndividualUpdates(updates);
            if (res.success) {
                toast.success(`Successfully updated ${updates.length} items`);
                setOriginalItems(JSON.parse(JSON.stringify(items)));
            } else {
                toast.error(res.error || "Failed to save updates");
            }
        } catch (error) {
            toast.error("An error occurred while saving");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Matrix Editor</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <Link href="/admin/inventory">
                        <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-gray-400" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Bulk Attribute Editor</h1>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Spreadsheet-style granular control</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${changedItems.length > 0 ? 'bg-orange-500 animate-pulse' : 'bg-gray-300'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                            {changedItems.length} Pending Changes
                        </span>
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={changedItems.length === 0 || saving}
                        className={`h-12 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${changedItems.length > 0 ? 'bg-black text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20' : 'bg-gray-100 text-gray-400'}`}
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Commit Changes
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Search by product or SKU..."
                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold shadow-sm focus:border-orange-400 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-6 pr-6 text-sm font-bold shadow-sm appearance-none cursor-pointer outline-none focus:border-orange-400 transition-all font-black uppercase text-[10px] tracking-widest"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="ALL">All Departments</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-center gap-4">
                    <Info className="w-5 h-5 text-orange-500" />
                    <p className="text-[9px] font-bold text-orange-800 leading-tight">
                        Changes are kept in local state until you click <span className="font-black">Commit Changes</span>.
                    </p>
                </div>
            </div>

            {/* Matrix Editor Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest font-black">Item Identity</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest font-black">Variant Details</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest font-black w-48">Unit Price (₹)</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest font-black w-40">Stock Level</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest font-black text-center">Auto-Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.map((item) => {
                                const original = originalItems.find(o => o.id === item.id);
                                const isChanged = item.price !== original?.price || item.stock !== original?.stock;

                                return (
                                    <tr key={item.id} className={`group transition-colors ${isChanged ? 'bg-orange-50/30' : 'hover:bg-gray-50/50'}`}>
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200 group-hover:bg-white transition-colors">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 text-xs leading-tight">{item.product.name}</p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                        {item.product.category?.name}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">
                                                    {item.size} / {item.color}
                                                </p>
                                                <p className="font-mono text-[9px] font-black text-orange-600 bg-orange-50 w-fit px-1.5 rounded">{item.sku || 'SKU-PENDING'}</p>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={item.price}
                                                    onChange={(e) => handleCellChange(item.id, 'price', e.target.value)}
                                                    className={`w-full h-11 px-4 rounded-xl text-sm font-black outline-none border-2 transition-all ${item.price !== original?.price ? 'border-orange-500 bg-white ring-4 ring-orange-500/10' : 'border-gray-50 bg-gray-50/30 focus:bg-white focus:border-gray-200'}`}
                                                />
                                                {item.price !== original?.price && (
                                                    <span className="absolute -top-6 left-0 text-[8px] font-black text-orange-500 uppercase italic">
                                                        Was: ₹{original?.price.toLocaleString()}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={item.stock}
                                                    onChange={(e) => handleCellChange(item.id, 'stock', e.target.value)}
                                                    className={`w-full h-11 px-4 rounded-xl text-sm font-black outline-none border-2 transition-all ${item.stock !== original?.stock ? 'border-orange-500 bg-white ring-4 ring-orange-500/10' : 'border-gray-50 bg-gray-50/30 focus:bg-white focus:border-gray-200'}`}
                                                />
                                                {item.stock !== original?.stock && (
                                                    <span className="absolute -top-6 left-0 text-[8px] font-black text-orange-500 uppercase italic">
                                                        Was: {original?.stock}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="inline-flex items-center gap-2">
                                                {isChanged ? (
                                                    <CheckCircle2 className="w-5 h-5 text-orange-500 animate-in zoom-in" />
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-100" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filteredItems.length === 0 && (
                    <div className="p-20 text-center">
                        <XCircle className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No matching assets found in matrix</p>
                    </div>
                )}
            </div>
        </div>
    );
}
