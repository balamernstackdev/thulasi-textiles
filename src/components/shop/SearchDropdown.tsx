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
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                            </div>
                        ) : results.length > 0 ? (
                            <div className="flex flex-col gap-0">
                                {results.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="group flex items-center gap-3 py-1.5 px-3 hover:bg-gray-100 transition-colors cursor-pointer"
                                    >
                                        <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            {/* bold query match logic could go here, for now just text */}
                                            <span className="text-sm font-bold text-gray-900 truncate block">
                                                {product.name}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                <button
                                    onClick={() => {
                                        onClose();
                                        router.push(`/search?q=${encodeURIComponent(query)}`);
                                    }}
                                    className="w-full text-left flex items-center gap-3 py-1.5 px-3 hover:bg-gray-100 transition-colors cursor-pointer text-blue-600 border-t border-gray-50"
                                >
                                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                                    <span className="text-sm font-medium">
                                        Search for <span className="font-bold">"{query}"</span>
                                    </span>
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
                            <div className="flex flex-col gap-0">
                                {trending.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        onClick={onClose}
                                        className="group flex items-center gap-3 py-1.5 px-3 hover:bg-gray-100 transition-colors"
                                    >
                                        <TrendingUp className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-sm font-bold text-gray-900 truncate">
                                            {product.name}
                                        </span>
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
