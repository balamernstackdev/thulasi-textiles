'use client';

import { useCurrencyStore } from '@/lib/store/currency';
import { formatPrice } from '@/lib/currency';
import { useEffect, useState } from 'react';

export default function Price({ amount, className = '', showGst = false }: { amount: number, className?: string, showGst?: boolean }) {
    const { currency, isHydrated } = useCurrencyStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Server/Hydration Mismatch protection:
    // Default to INR on server, or if not mounted
    if (!mounted || !isHydrated) {
        return (
            <span className={className}>
                ₹{amount.toLocaleString('en-IN')}
                {showGst && <span className="text-[8px] font-black uppercase text-gray-400 ml-1 tracking-tighter">(Incl. GST)</span>}
            </span>
        );
    }

    return (
        <span className={className}>
            {formatPrice(amount, currency)}
            {showGst && <span className="text-[8px] font-black uppercase text-gray-400 ml-1 tracking-tighter">(Incl. GST)</span>}
        </span>
    );
}
