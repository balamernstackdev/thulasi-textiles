'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function ProductSort() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'newest';
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { label: 'Newest Arrivals', value: 'newest' },
        { label: 'Price: Low to High', value: 'price_asc' },
        { label: 'Price: High to Low', value: 'price_desc' },
    ];

    const handleSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', value);
        params.set('page', '1'); // Reset to first page
        router.push(`?${params.toString()}`);
        setIsOpen(false);
    };

    const currentLabel = sortOptions.find(o => o.value === currentSort)?.label || 'Newest Arrivals';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 bg-white shadow-sm hover:border-gray-300 transition-all min-w-[200px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <span className="text-gray-400 font-medium text-xs uppercase tracking-wider">Sort:</span>
                    <span className="text-orange-600 truncate">{currentLabel}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-full min-w-[200px] bg-white rounded-xl border border-gray-100 shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                        {sortOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSort(option.value)}
                                className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors ${currentSort === option.value
                                        ? 'bg-orange-50 text-orange-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
