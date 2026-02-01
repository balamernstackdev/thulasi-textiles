'use client';

import { useState, useEffect } from 'react';
import { Search, X, TrendingUp, Clock, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getQuickSearch, getTrendingProducts } from '@/lib/actions/product';
import { useDebounce } from '@/lib/hooks/useDebounce';
import Price from '@/components/store/Price';

interface SearchDropdownProps {
    isOpen: boolean;
    query: string;
    onClose: () => void;
}

export default function SearchDropdown({ isOpen, query, onClose }: SearchDropdownProps) {
    const router = useRouter();
    const [results, setResults] = useState<any[]>([]);
    const [trending, setTrending] = useState<any[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // We'll manage debounce manually if the hook isn't reliable, 
    // but assuming useDebounce works as standard hook:
    // const debouncedQuery = useDebounce(query, 300);
    // Actually, to match previous logic exactly and ensure safety:

    // Load Initial Data (Recent & Trending)
    useEffect(() => {
        // Load recent
        const saved = localStorage.getItem('thulasi_recent_searches');
        if (saved) setRecentSearches(JSON.parse(saved));

        // Load trending
        const fetchTrending = async () => {
            const res = await getTrendingProducts();
            if (res.success) setTrending(res.data);
        };
        fetchTrending();
    }, []);

    // Search Effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setIsLoading(true);
                const res = await getQuickSearch(query);
                if (res.success) setResults(res.data);
                setIsLoading(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const handleRecentClick = (term: string) => {
        onClose();
        router.push(`/search?q=${encodeURIComponent(term)}`);
    };

    const clearRecent = () => {
        setRecentSearches([]);
        localStorage.removeItem('thulasi_recent_searches');
    };

    if (!isOpen) return null;

    return (
        <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 flex flex-col max-h-[70vh]">

            <div className="overflow-y-auto no-scrollbar py-2">
                {query.length >= 2 ? (
                    /* SEARCH RESULTS */
                    <div className="px-2">
                        <div className="flex items-center justify-between px-2 py-2 mb-1">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                {isLoading ? 'Searching...' : 'Results'}
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-12">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curating...</span>
                                </div>
                            </div>
                        ) : results.length > 0 ? (
                            <div className="flex flex-col gap-0">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="group flex items-center gap-4 py-3 px-4 hover:bg-orange-50/30 transition-all cursor-pointer border-b border-gray-50 last:border-0"
                                    >
                                        <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 group-hover:shadow-md transition-shadow">
                                            <Image
                                                src={product.images[0]?.url || '/placeholder-product.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <span className="text-sm font-black text-gray-900 truncate block uppercase italic tracking-tight group-hover:text-orange-600">
                                                {product.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <span className="text-xs font-bold text-gray-900">
                                                    ₹{product.basePrice.toLocaleString()}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 px-1.5 py-0.5 bg-gray-50 rounded">In Stock</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        onClose();
                                        router.push(`/search?q=${encodeURIComponent(query)}`);
                                    }}
                                    className="w-full text-center flex items-center justify-center gap-2 py-4 px-4 hover:bg-orange-50/50 transition-colors cursor-pointer text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] border-t border-gray-100"
                                >
                                    View All results for "{query}" <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-sm text-gray-500">
                                No results found for "{query}"
                            </div>
                        )}
                    </div>
                ) : (
                    /* RECENT & TRENDING */
                    <div className="flex flex-col divide-y divide-gray-50">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="px-2 py-2">
                                <div className="flex items-center justify-between px-2 mb-1">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Recent</span>
                                    <button onClick={clearRecent} className="text-[10px] font-bold text-rose-500 hover:text-rose-600">
                                        Clear
                                    </button>
                                </div>
                                <div className="flex flex-col">
                                    {recentSearches.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleRecentClick(term)}
                                            className="text-left py-1.5 px-3 hover:bg-gray-100 text-sm font-bold text-purple-800 flex items-center gap-3 transition-colors w-full"
                                        >
                                            <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                                            <span>{term}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trending */}
                        <div className="px-2 py-2">
                            <div className="flex items-center gap-2 px-2 mb-2">
                                <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Trending Now</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 p-2">
                                {trending.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="group flex items-center gap-3 p-2 hover:bg-orange-50/30 rounded-xl transition-all border border-transparent hover:border-orange-100"
                                    >
                                        <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-gray-50">
                                            <Image
                                                src={product.images[0]?.url || '/placeholder-product.png'}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0">
                                            <span className="text-[11px] font-black text-gray-900 truncate block uppercase leading-tight group-hover:text-orange-600">
                                                {product.name}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400">₹{product.basePrice.toLocaleString()}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 text-[10px] font-medium text-center text-gray-400">
                Press Enter to search
            </div>
        </div>
    );
}
