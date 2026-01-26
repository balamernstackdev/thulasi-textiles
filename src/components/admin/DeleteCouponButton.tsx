'use client';

import { useState } from 'react';
import { deleteCoupon } from '@/lib/actions/coupon';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

import DeleteConfirmation from './DeleteConfirmation';
import { toast } from 'sonner';

export default function DeleteCouponButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteCoupon(id);
            toast.success('Campaign terminated successfully');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete campaign');
        }
    };

    return (
        <DeleteConfirmation
            title="Terminate Campaign?"
            description="This will permanently disable this coupon code. Future customers won't be able to apply this discount."
            onConfirm={handleDelete}
            trigger={
                <button
                    className="p-3 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                    title="Delete Coupon"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            }
        />
    );
}
