'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface ProductFiltersProps {
    categories?: any[];
}

export default function ProductFilters({ categories = [] }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse initial values from URL
    const initialMin = searchParams.get('minPrice') || '';
    const initialMax = searchParams.get('maxPrice') || '';
    const selectedCategory = searchParams.get('category');

    const [minPrice, setMinPrice] = useState(initialMin);
    const [maxPrice, setMaxPrice] = useState(initialMax);

    // Update local state when URL changes
    useEffect(() => {
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (minPrice) params.set('minPrice', minPrice);
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', maxPrice);
        else params.delete('maxPrice');

        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleClear = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('minPrice');
        params.delete('maxPrice');
        params.delete('category');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleCategorySelect = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (selectedCategory === slug) {
            params.delete('category'); // Toggle off
        } else {
            params.set('category', slug);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 sticky top-0 bg-white z-10 py-2">Filters</h3>

            <div className="space-y-10">
                {/* Category Filter */}
                {categories.length > 0 && (
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-[10px]">Categories</p>
                        <div className="space-y-2">
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat.slug;
                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleCategorySelect(cat.slug)}
                                        className={`w-full text-left flex items-center justify-between group py-1.5 px-2 rounded-lg transition-colors ${isSelected ? 'text-orange-600 bg-orange-50 font-bold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}
                                    >
                                        <span className="text-[11px] uppercase tracking-wider">{cat.name}</span>
                                        {isSelected && <Check className="w-3 h-3" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Price Filter */}
                <div>
                    <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider text-[10px]">Price Range</p>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs text-black">₹</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full text-xs border border-gray-200 pl-7 pr-3 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-bold"
                            />
                        </div>
                        <span className="text-gray-300">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs text-black">₹</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full text-xs border border-gray-200 pl-7 pr-3 py-2.5 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none font-bold"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleApply}
                            className="flex-1 bg-orange-600 text-white text-[10px] uppercase tracking-widest font-black py-3 rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-50"
                        >
                            Apply
                        </button>
                        {(minPrice || maxPrice || selectedCategory) && (
                            <button
                                onClick={handleClear}
                                className="px-4 border border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest font-black rounded-xl hover:border-gray-300 hover:text-gray-600 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
