'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '@/lib/actions/product';
import { Loader2 } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

interface InfiniteProductGridProps {
    initialProducts: any[];
    categorySlug?: string;
    isNew?: boolean;
    initialPagination: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    searchParams?: any;
    session?: any;
}

export default function InfiniteProductGrid({
    initialProducts,
    categorySlug,
    isNew,
    initialPagination,
    searchParams,
    session
}: InfiniteProductGridProps) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(initialPagination.page);
    const [hasMore, setHasMore] = useState(initialPagination.page < initialPagination.totalPages);
    const [isLoading, setIsLoading] = useState(false);

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '400px', // Start loading before reaching the end
    });

    useEffect(() => {
        if (inView && hasMore && !isLoading) {
            loadMoreProducts();
        }
    }, [inView, hasMore, isLoading]);

    // Reset when initial products change (e.g. filters applied)
    useEffect(() => {
        setProducts(initialProducts);
        setPage(initialPagination.page);
        setHasMore(initialPagination.page < initialPagination.totalPages);
    }, [initialProducts, initialPagination]);

    const loadMoreProducts = async () => {
        setIsLoading(true);
        const nextPage = page + 1;

        try {
            const res = await getProducts({
                categorySlug,
                isNew,
                page: nextPage,
                pageSize: initialPagination.pageSize,
                ...searchParams
            });

            if (res.success && 'data' in res) {
                setProducts(prev => [...prev, ...res.data]);
                setPage(nextPage);
                setHasMore(nextPage < res.pagination.totalPages);
            }
        } catch (error) {
            console.error('Failed to load more products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} session={session} />
                ))}
            </div>

            {hasMore && (
                <div ref={ref} className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Unweaving more treasures...</span>
                    </div>
                </div>
            )}

            {!hasMore && products.length > 0 && (
                <div className="text-center py-12">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
                        You've reached the end of this collection
                    </p>
                </div>
            )}
        </div>
    );
}
