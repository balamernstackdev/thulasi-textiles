'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminProductFiltersProps {
    filterAttributes?: {
        sizes: string[];
        colors: string[];
        materials: string[];
        fabrics: string[];
        occasions: string[];
    };
}

export default function AdminProductFilters({ filterAttributes }: AdminProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Filter states
    const [sizes, setSizes] = useState<string[]>(searchParams.get('sizes')?.split(',').filter(Boolean) || []);
    const [colors, setColors] = useState<string[]>(searchParams.get('colors')?.split(',').filter(Boolean) || []);
    const [fabrics, setFabrics] = useState<string[]>(searchParams.get('fabrics')?.split(',').filter(Boolean) || []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (search) params.set('q', search);
            else params.delete('q');
            params.set('page', '1');
            router.push(`?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (sizes.length > 0) params.set('sizes', sizes.join(',')); else params.delete('sizes');
        if (colors.length > 0) params.set('colors', colors.join(',')); else params.delete('colors');
        if (fabrics.length > 0) params.set('fabrics', fabrics.join(',')); else params.delete('fabrics');

        params.set('page', '1');
        router.push(`?${params.toString()}`);
        setIsFilterOpen(false);
    };

    const clearFilters = () => {
        setSearch('');
        setSizes([]);
        setColors([]);
        setFabrics([]);
        router.push('/admin/products');
        setIsFilterOpen(false);
    };

    const toggleItem = (item: string, current: string[], setter: (val: string[]) => void) => {
        if (current.includes(item)) {
            setter(current.filter(i => i !== item));
        } else {
            setter([...current, item]);
        }
    };

    return (
        <div className="space-y-4">
            <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 relative">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        placeholder="Search products by name, SKU, or fabric..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-12 pr-4 h-12 w-full border-2 border-gray-50 bg-gray-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2dd4bf]/20 focus:border-[#2dd4bf] focus:bg-white transition-all font-bold text-gray-900"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-gray-100 hover:bg-gray-50 ${(sizes.length > 0 || colors.length > 0 || fabrics.length > 0) ? 'border-teal-400 text-teal-600 bg-teal-50/10' : 'text-gray-500'}`}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    {(sizes.length > 0 || colors.length > 0 || fabrics.length > 0) ? 'Filters Active' : 'Filter catalog'}
                </Button>

                {isFilterOpen && (
                    <div className="absolute top-full right-4 mt-2 w-80 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Matrix Filters</h4>
                            <button onClick={() => setIsFilterOpen(false)}><X className="w-4 h-4 text-gray-300 hover:text-gray-600" /></button>
                        </div>

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Size Filter */}
                            {filterAttributes?.sizes && (
                                <div>
                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-3">Filter by Size</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filterAttributes.sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => toggleItem(size, sizes, setSizes)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${sizes.includes(size) ? 'bg-teal-500 border-teal-500 text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-teal-200'}`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Color Filter */}
                            {filterAttributes?.colors && (
                                <div>
                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-3">Filter by Color</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filterAttributes.colors.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => toggleItem(color, colors, setColors)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${colors.includes(color) ? 'bg-teal-500 border-teal-500 text-white' : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-teal-200'}`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fabric Filter */}
                            {filterAttributes?.fabrics && (
                                <div>
                                    <p className="text-[9px] font-black text-gray-900 uppercase tracking-widest mb-3">Filter by Fabric</p>
                                    <div className="space-y-1">
                                        {filterAttributes.fabrics.map(fabric => (
                                            <button
                                                key={fabric}
                                                onClick={() => toggleItem(fabric, fabrics, setFabrics)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-[9px] font-bold uppercase transition-all ${fabrics.includes(fabric) ? 'bg-teal-50 text-teal-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                            >
                                                {fabric}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex gap-2">
                            <Button onClick={handleFilterApply} className="flex-1 bg-black text-white hover:bg-teal-600 text-[10px] font-black uppercase tracking-widest py-6 rounded-xl">Apply Matrix</Button>
                            <Button variant="ghost" onClick={clearFilters} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-rose-500">Reset</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
