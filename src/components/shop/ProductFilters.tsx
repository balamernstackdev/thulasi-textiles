'use client';

import { useState, useEffect, useCallback } from 'react';
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

export default function ProductFilters({ categories = [], filterAttributes }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse initial values from URL
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedSizes, setSelectedSizes] = useState<string[]>(searchParams.get('sizes')?.split(',') || []);
    const [selectedColors, setSelectedColors] = useState<string[]>(searchParams.get('colors')?.split(',') || []);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>(searchParams.get('materials')?.split(',') || []);
    const [selectedFabrics, setSelectedFabrics] = useState<string[]>(searchParams.get('fabrics')?.split(',') || []);
    const [selectedOccasions, setSelectedOccasions] = useState<string[]>(searchParams.get('occasions')?.split(',') || []);

    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
        categories: true,
        price: true,
        sizes: true,
        colors: true,
        materials: false,
        fabrics: false,
        occasions: false
    });

    // Sync state with URL
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
        setSelectedCategory(searchParams.get('category') || '');
        setSelectedSizes(searchParams.get('sizes')?.split(',').filter(Boolean) || []);
        setSelectedColors(searchParams.get('colors')?.split(',').filter(Boolean) || []);
        setSelectedMaterials(searchParams.get('materials')?.split(',').filter(Boolean) || []);
        setSelectedFabrics(searchParams.get('fabrics')?.split(',').filter(Boolean) || []);
        setSelectedOccasions(searchParams.get('occasions')?.split(',').filter(Boolean) || []);
    }, [searchParams]);

    const updateUrl = useCallback((newParams: Record<string, string | string[] | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','));
            } else {
                params.set(key, value);
            }
        });

        params.set('page', '1');
        router.push(`?${params.toString()}`);
    }, [searchParams, router]);

    const handleApplyPrice = () => {
        updateUrl({ minPrice, maxPrice });
    };

    const toggleAttribute = (value: string, current: string[], setter: (val: string[]) => void, key: string) => {
        const next = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        setter(next);
        updateUrl({ [key]: next });
    };

    const toggleGroup = (group: string) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const clearAll = () => {
        router.push(window.location.pathname);
    };

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-8 sticky top-0 bg-white z-10 py-2">
                <h3 className="text-xs font-black text-gray-600 uppercase tracking-[0.2em]">Filters</h3>
                {hasActiveFilters && (
                    <button
                        onClick={clearAll}
                        className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                        <X className="w-3 h-3" /> Clear All
                    </button>
                )}
            </div>

            <div className="space-y-8">
                {/* Categories */}
                {categories.length > 0 && (
                    <FilterGroup title="Categories" isExpanded={expandedGroups.categories} onToggle={() => toggleGroup('categories')}>
                        <div className="space-y-1 mt-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateUrl({ category: selectedCategory === cat.slug ? null : cat.slug })}
                                    className={`w-full text-left flex items-center justify-between group py-2 px-3 rounded-xl transition-all ${selectedCategory === cat.slug ? 'text-orange-600 bg-orange-50 font-black' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold'}`}
                                >
                                    <span className="text-[11px] uppercase tracking-wider">{cat.name}</span>
                                    {selectedCategory === cat.slug && <Check className="w-3.5 h-3.5" />}
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
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full text-xs border border-gray-200 bg-white pl-7 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-black placeholder:text-gray-400 text-gray-900"
                                />
                            </div>
                            <span className="text-gray-200">-</span>
                            <div className="relative flex-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-black">₹</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full text-xs border border-gray-200 bg-white pl-7 pr-3 py-3 rounded-xl focus:ring-2 focus:ring-orange-500/10 focus:border-orange-500 transition-all outline-none font-black placeholder:text-gray-400 text-gray-900"
                                />
                            </div>
                        </div>
                        <Button
                            onClick={handleApplyPrice}
                            className="w-full bg-black hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all"
                        >
                            Apply Price
                        </Button>
                    </div>
                </FilterGroup>

                {/* Sizes */}
                {filterAttributes?.sizes && filterAttributes.sizes.length > 0 && (
                    <FilterGroup title="Sizes" isExpanded={expandedGroups.sizes} onToggle={() => toggleGroup('sizes')}>
                        <div className="grid grid-cols-2 gap-2 mt-4">
                            {filterAttributes.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => toggleAttribute(size, selectedSizes, setSelectedSizes, 'sizes')}
                                    className={`py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedSizes.includes(size) ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600'}`}
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
                                    onClick={() => toggleAttribute(color, selectedColors, setSelectedColors, 'colors')}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedColors.includes(color) ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:text-orange-600'}`}
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
                                    onClick={() => toggleAttribute(material, selectedMaterials, setSelectedMaterials, 'materials')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${selectedMaterials.includes(material) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
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
                                    onClick={() => toggleAttribute(fabric, selectedFabrics, setSelectedFabrics, 'fabrics')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${selectedFabrics.includes(fabric) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
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
                                    onClick={() => toggleAttribute(occasion, selectedOccasions, setSelectedOccasions, 'occasions')}
                                    className={`w-full text-left py-2 px-3 rounded-xl text-[11px] font-bold uppercase tracking-wide transition-all ${selectedOccasions.includes(occasion) ? 'text-orange-600 bg-orange-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                                >
                                    {occasion}
                                </button>
                            ))}
                        </div>
                    </FilterGroup>
                )}
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
