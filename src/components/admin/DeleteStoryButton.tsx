'use client';

import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { deleteStory } from '@/lib/actions/story';

export default function DeleteStoryButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this story? This action cannot be undone.')) return;

        setIsDeleting(true);
        try {
            await deleteStory(id);
            router.refresh();
        } catch (error) {
            console.error('Failed to delete story:', error);
            alert('Failed to delete story');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-gray-300 hover:text-rose-500 p-3 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
        >
            {isDeleting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <Trash2 className="w-5 h-5" />
            )}
        </button>
    );
}
