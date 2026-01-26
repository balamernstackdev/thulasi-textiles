'use client';

import { Trash2 } from 'lucide-react';
import { deleteBanner } from '@/lib/actions/banner';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteConfirmation from './DeleteConfirmation';

export default function DeleteBannerButton({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        try {
            await deleteBanner(id);
            toast.success('Promotion asset removed');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error('Failed to eliminate promo asset');
        }
    };

    return (
        <DeleteConfirmation
            title="Remove Promotion?"
            description="This will permanently delete this banner. It will no longer appear on the storefront."
            onConfirm={handleDelete}
            trigger={
                <button className="bg-gray-50 text-gray-300 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all active:scale-90 shadow-sm">
                    <Trash2 className="w-5 h-5 transition-transform" />
                </button>
            }
        />
    );
}
