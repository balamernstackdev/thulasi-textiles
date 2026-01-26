'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { getInventoryItems, bulkUpdateInventory } from '@/lib/actions/inventory';
import {
    Package,
    Search,
    Filter,
    Loader2,
    Layers,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Memoized Row Component to prevent redundant re-renders
const InventoryItemRow = React.memo(({
    item,
    isSelected,
    onToggle
}: {
    item: any,
    isSelected: boolean,
    onToggle: (id: string) => void
}) => {
    return (
        <tr className={`hover:bg-gray-50/50 transition-colors ${isSelected ? 'bg-teal-50/30' : ''}`}>
            <td className="p-6 text-center">
                <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg accent-teal-500 cursor-pointer"
                    checked={isSelected}
                    onChange={() => onToggle(item.id)}
                />
            </td>
            <td className="p-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                        <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                        <p className="font-black text-gray-900 text-sm leading-tight">{item.product.name}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                            {item.size} • {item.color} • <span className="text-teal-600 font-bold">{item.sku || 'NO SKU'}</span>
                        </p>
                    </div>
                </div>
            </td>
            <td className="p-6 font-black text-gray-900">
                <div className="space-y-1">
                    <p>₹{item.price.toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">Base: ₹{item.product.basePrice.toLocaleString()}</p>
                </div>
            </td>
            <td className="p-6">
                <span className={`px-4 py-2 rounded-xl text-xs font-black ${item.stock <= 5 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-gray-50 text-gray-900'}`}>
                    {item.stock} Units
                </span>
            </td>
            <td className="p-6">
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        {item.isActive ? 'In Matrix' : 'Offline'}
                    </span>
                </div>
            </td>
        </tr>
    );
});

InventoryItemRow.displayName = 'InventoryItemRow';

export default function InventoryPage() {
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    const [bulkStock, setBulkStock] = useState<string>('');
    const [bulkPrice, setBulkPrice] = useState<string>('');

    const fetchInventory = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getInventoryItems();
            if (res.success) setItems(res.data);
        } catch (error) {
            toast.error("Critical: Failed to load inventory data");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [fetchInventory]);

    // Fast toggle using Set
    const toggleSelect = useCallback((id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    }, []);

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

    const selectAll = useCallback(() => {
        if (selectedIds.size === filteredItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredItems.map(i => i.id)));
        }
    }, [selectedIds.size, filteredItems]);

    const handleBulkUpdate = async (type: 'STOCK' | 'PRICE' | 'ACTIVATE' | 'DEACTIVATE') => {
        if (selectedIds.size === 0) return;
        setProcessing(true);

        const data: any = { variantIds: Array.from(selectedIds) };

        if (type === 'STOCK') {
            if (!bulkStock) return setProcessing(false);
            data.stockUpdate = parseInt(bulkStock);
        } else if (type === 'PRICE') {
            if (!bulkPrice) return setProcessing(false);
            data.priceUpdate = parseFloat(bulkPrice);
        } else if (type === 'ACTIVATE') {
            data.isActive = true;
        } else if (type === 'DEACTIVATE') {
            data.isActive = false;
        }

        try {
            const res = await bulkUpdateInventory(data);
            if (res.success) {
                toast.success(`Updated ${selectedIds.size} items`);
                setSelectedIds(new Set());
                setBulkStock('');
                setBulkPrice('');
                fetchInventory();
            }
        } catch (error) {
            toast.error("Bulk update failed");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-12 h-12 text-teal-400 animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 font-black">Synchronizing Inventory Matrix</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto pb-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">Inventory Suite</h1>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Performance-ready bulk operations</p>
                </div>
                <div className="bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <Layers className="w-4 h-4 text-orange-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">{items.length} Variants</span>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        placeholder="Quick filter..."
                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-14 pr-6 text-sm font-bold shadow-sm focus:border-teal-400 outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <select
                        className="w-full h-14 bg-white border border-gray-100 rounded-2xl pl-6 pr-6 text-sm font-bold shadow-sm appearance-none cursor-pointer outline-none focus:border-teal-400 transition-all"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="ALL">All Departments</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <div>
                        <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Latency Optimization</p>
                        <p className="text-[9px] font-bold text-rose-800">UI is now memoized for instantaneous selection feedback.</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100 font-black">
                            <tr>
                                <th className="p-6 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 rounded-lg accent-teal-500 cursor-pointer"
                                        checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                                        onChange={selectAll}
                                    />
                                </th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest">Net Price</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="p-6 text-[9px] text-gray-400 uppercase tracking-widest">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredItems.map((item) => (
                                <InventoryItemRow
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedIds.has(item.id)}
                                    onToggle={toggleSelect}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Floating Bulk Action Bar */}
            {selectedIds.size > 0 && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-4xl bg-[#1e293b] px-8 py-5 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 z-50 animate-in slide-in-from-bottom-10">
                    <div className="flex items-center gap-4 pr-6 border-r border-white/10">
                        <div className="w-10 h-10 bg-teal-400 rounded-xl flex items-center justify-center text-[#1e293b] font-black">
                            {selectedIds.size}
                        </div>
                        <Button variant="ghost" className="h-auto p-0 text-white hover:text-teal-400 text-[9px] font-black uppercase tracking-widest" onClick={() => setSelectedIds(new Set())}>Clear Select</Button>
                    </div>

                    <div className="flex-1 flex flex-wrap items-center gap-4 justify-center">
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Stock"
                                className="w-24 h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-teal-400"
                                value={bulkStock}
                                onChange={(e) => setBulkStock(e.target.value)}
                            />
                            <Button className="bg-white text-[#1e293b] hover:bg-teal-400 h-10 rounded-xl text-[9px] font-black uppercase" onClick={() => handleBulkUpdate('STOCK')} disabled={processing}>Set</Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                placeholder="Price"
                                className="w-24 h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-bold text-white outline-none focus:border-teal-400"
                                value={bulkPrice}
                                onChange={(e) => setBulkPrice(e.target.value)}
                            />
                            <Button className="bg-white text-[#1e293b] hover:bg-orange-400 h-10 rounded-xl text-[9px] font-black uppercase" onClick={() => handleBulkUpdate('PRICE')} disabled={processing}>Update</Button>
                        </div>
                        <div className="flex items-center gap-2 lg:ml-4">
                            <Button variant="outline" className="h-10 border-white/10 text-white hover:bg-white/5 rounded-xl text-[9px] font-black uppercase px-4" onClick={() => handleBulkUpdate('ACTIVATE')}>Online</Button>
                            <Button variant="outline" className="h-10 border-white/10 text-white hover:bg-white/5 rounded-xl text-[9px] font-black uppercase px-4" onClick={() => handleBulkUpdate('DEACTIVATE')}>Offline</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
