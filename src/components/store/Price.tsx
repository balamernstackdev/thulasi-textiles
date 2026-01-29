'use client';

import { useCurrencyStore } from '@/lib/store/currency';
import { formatPrice } from '@/lib/currency';
import { useEffect, useState } from 'react';

export default function Price({ amount, className = '' }: { amount: number, className?: string }) {
    const { currency, isHydrated } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Server/Hydration Mismatch protection:
    // Default to INR on server, or if not mounted
    if (!mounted || !isHydrated) {
        return <span className={className}>₹{amount.toLocaleString('en-IN')}</span>;
    }

    return (
        <span className={className}>
            {formatPrice(amount, currency)}
        </span>
    );
}
