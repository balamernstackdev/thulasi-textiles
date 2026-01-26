'use client';

import { useState } from 'react';
import { toggleCouponStatus } from '@/lib/actions/coupon';
import { useRouter } from 'next/navigation';

export default function ToggleCouponStatus({ id, isActive }: { id: string, isActive: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleToggle = async () => {
        setLoading(true);
        try {
            await toggleCouponStatus(id, !isActive);
            router.refresh();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 ${isActive ? 'bg-orange-600' : 'bg-gray-200'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
            />
        </button>
    );
}
