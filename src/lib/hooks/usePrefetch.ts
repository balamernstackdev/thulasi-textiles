'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useRef } from 'react';

export function usePrefetch() {
    const router = useRouter();
    const prefetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const onMouseEnter = useCallback((href: string) => {
        // Start prefetching after 80ms of hover (intent confirmation)
        prefetchTimeoutRef.current = setTimeout(() => {
            router.prefetch(href);
        }, 80);
    }, [router]);

    const onMouseLeave = useCallback(() => {
        if (prefetchTimeoutRef.current) {
            clearTimeout(prefetchTimeoutRef.current);
        }
    }, []);

    return { onMouseEnter, onMouseLeave };
}
