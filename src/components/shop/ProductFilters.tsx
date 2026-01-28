'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ProductFiltersProps {
    categories?: any[];
    filterAttributes?: {
        sizes: string[];
        colors: string[];
        materials: string[];
        fabrics: string[];
        occasions: string[];
    };
}

export default function ProductFilters({ categories = [], filterAttributes, isMobile = false, onClose }: ProductFiltersProps & { isMobile?: boolean, onClose?: () => void }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [localFilters, setLocalFilters] = useState({
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        category: searchParams.get('category') || '',
        sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
        colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
        materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
        fabrics: searchParams.get('fabrics')?.split(',').filter(Boolean) || [],
        occasions: searchParams.get('occasions')?.split(',').filter(Boolean) || []
    });

    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        categories: true,
        price: true,
        sizes: true,
        colors: true,
        materials: false,
        fabrics: false,
        occasions: false
    });

    useEffect(() => {
        setLocalFilters({
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            category: searchParams.get('category') || '',
            sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
            colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
            materials: searchParams.get('materials')?.split(',').filter(Boolean) || [],
            fabrics: searchParams.get('fabrics')?.split(',').filter(Boolean) || [],
            occasions: searchParams.get('occasions')?.split(',').filter(Boolean) || []
        });
    }, [searchParams]);

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(localFilters).forEach(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','));
            } else {
                params.set(key, value as string);
            }
        });

        params.set('page', '1');
        router.push(`?${params.toString()}`);
        if (onClose) onClose();
    };

    const toggleAttribute = (value: string, key: keyof typeof localFilters) => {
        const current = localFilters[key] as string[];
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];

        setLocalFilters(prev => ({ ...prev, [key]: next }));
    };

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const clearAll = () => {
        setLocalFilters({
            minPrice: '',
            maxPrice: '',
            category: '',
            sizes: [],
            colors: [],
            materials: [],
            fabrics: [],
            occasions: []
        });
        router.push(window.location.pathname);
        if (onClose) onClose();
    };

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <div className={`bg-white ${isMobile ? '' : 'p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 max-h-[calc(100vh-120px)]'} overflow-y-auto custom-scrollbar flex flex-col h-full`}>
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-2">
                <div>
                    <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">Matrix Filters</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Refine your selection</p>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            <div className="space-y-8 flex-grow">
                {/* Categories */}
                {categories.length > 0 && (
                    <FilterGroup title="Categories" isExpanded={expandedGroups.categories} onToggle={() => toggleGroup('categories')}>
                        <div className="space-y-1 mt-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setLocalFilters(prev => ({ ...prev, category: prev.category === cat.slug ? '' : cat.slug }))}
                                    className={`w-full text-left flex items-center justify-between group py-2.5 px-3 rounded-xl transition-all ${localFilters.category === cat.slug ? 'text-orange-600 bg-orange-50 font-black scale-[1.02]' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold'}`}
                                >
                                    <span className="text-[11px] uppercase tracking-wider">{cat.name}</span>
                                    {localFilters.category === cat.slug && <Check className="w-3.5 h-3.5" />}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {/* Price Range */}
                <FilterGroup title="Price Range" isExpanded={expandedGroups.price} onToggle={() => toggleGroup('price')}>
                    <div className="mt-4 space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">₹</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localFilters.minPrice}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                    className="w-full text-xs border border-gray-200 bg-white pl-7 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-black placeholder:text-gray-400 text-gray-900"
                                />
                            </div>
                            <span className="text-gray-200">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">₹</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localFilters.maxPrice}
                                    onChange={(e) => setLocalFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                    className="w-full text-xs border border-gray-200 bg-white pl-7 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-black placeholder:text-gray-400 text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </FilterGroup>

                {/* Sizes */}
                {filterAttributes?.sizes && filterAttributes.sizes.length > 0 && (
                    <FilterGroup title="Sizes" isExpanded={expandedGroups.sizes} onToggle={() => toggleGroup('sizes')}>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {filterAttributes.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => toggleAttribute(size, 'sizes')}
                                    className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${localFilters.sizes.includes(size) ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600'}`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {/* Colors */}
                {filterAttributes?.colors && filterAttributes.colors.length > 0 && (
                    <FilterGroup title="Colors" isExpanded={expandedGroups.colors} onToggle={() => toggleGroup('colors')}>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {filterAttributes.colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => toggleAttribute(color, 'colors')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${localFilters.colors.includes(color) ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600'}`}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {/* Materials */}
                {filterAttributes?.materials && filterAttributes.materials.length > 0 && (
                    <FilterGroup title="Materials" isExpanded={expandedGroups.materials} onToggle={() => toggleGroup('materials')}>
                        <div className="space-y-1 mt-4">
                            {filterAttributes.materials.map(material => (
                                <button
                                    key={material}
                                    onClick={() => toggleAttribute(material, 'materials')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${localFilters.materials.includes(material) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {/* Fabrics */}
                {filterAttributes?.fabrics && filterAttributes.fabrics.length > 0 && (
                    <FilterGroup title="Fabric Type" isExpanded={expandedGroups.fabrics} onToggle={() => toggleGroup('fabrics')}>
                        <div className="space-y-1 mt-4">
                            {filterAttributes.fabrics.map(fabric => (
                                <button
                                    key={fabric}
                                    onClick={() => toggleAttribute(fabric, 'fabrics')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${localFilters.fabrics.includes(fabric) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {fabric}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}

                {/* Occasions */}
                {filterAttributes?.occasions && filterAttributes.occasions.length > 0 && (
                    <FilterGroup title="Occasion" isExpanded={expandedGroups.occasions} onToggle={() => toggleGroup('occasions')}>
                        <div className="space-y-1 mt-4">
                            {filterAttributes.occasions.map(occasion => (
                                <button
                                    key={occasion}
                                    onClick={() => toggleAttribute(occasion, 'occasions')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${localFilters.occasions.includes(occasion) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {occasion}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}
            </div>

            <div className="mt-8 sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-50 z-20">
                <Button
                    onClick={handleApplyFilters}
                    className="w-full bg-orange-600 hover:bg-black text-white py-6 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-orange-100"
                >
                    Apply Matrix Filters
                </Button>
            </div>
        </div>
    );
}

function FilterGroup({ title, children, isExpanded, onToggle }: { title: string, children: React.ReactNode, isExpanded: boolean, onToggle: () => void }) {
    return (
        <div className="border-b border-gray-50 pb-8 last:border-0 last:pb-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between text-gray-900 group"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600" />}
            </button>
            {isExpanded && children}
        </div>
    );
}
