'use client';

import { Trash2 } from 'lucide-react';
import { deleteCategory } from '@/lib/actions/category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import DeleteConfirmation from './DeleteConfirmation';

export default function DeleteCategoryButton({ id, name }: { id: string, name: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        const result = await deleteCategory(id);
        if (result.success) {
            toast.success(`${name} category removed`);
            router.refresh();
        } else {
            toast.error(result.error || 'Failed to delete category');
        }
    };

    return (
        <DeleteConfirmation
            title="Delete Category?"
            description={`Are you sure you want to delete the "${name}" category? This will affect all products listed under it.`}
            onConfirm={handleDelete}
            trigger={
                <button className="text-gray-300 hover:text-red-600 p-3 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                    <Trash2 className="w-5 h-5" />
                </button>
            }
        />
    );
}
