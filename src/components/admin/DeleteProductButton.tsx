'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import DeleteConfirmation from './DeleteConfirmation';

export default function DeleteProductButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteProduct(id);
        if (result.success) {
            toast.success('Product removed from collection');
            router.refresh();
        } else {
            toast.error(result.error);
        }
    };

    return (
        <DeleteConfirmation
            title="Delete this Product?"
            description="This action will permanently remove this masterpiece from your collection. All heritage data and images will be lost."
            onConfirm={handleDelete}
            trigger={
                <button className="text-gray-300 hover:text-red-600 p-3 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                    <Trash2 className="w-5 h-5" />
                </button>
            }
        />
    );
}
