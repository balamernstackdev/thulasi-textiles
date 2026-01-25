'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from '@/lib/actions/product';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DeleteProductButton({ id }: { id: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
            return;
        }

        setLoading(true);
        try {
            const result = await deleteProduct(id);
            if (result.success) {
                toast.success('Product removed from collection');
                router.refresh();
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to eliminate product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            disabled={loading}
            onClick={handleDelete}
            className="hover:text-rose-600 p-2 transition-colors disabled:opacity-50"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
}
