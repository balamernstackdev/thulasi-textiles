'use client';

import { useState } from 'react';
import { deleteCoupon } from '@/lib/actions/coupon';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteCouponButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this coupon? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            await deleteCoupon(id);
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to delete coupon');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90 disabled:opacity-50"
            title="Delete Coupon"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4" />
            )}
        </button>
    );
}
