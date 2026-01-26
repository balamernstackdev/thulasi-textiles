'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { revalidateCategories } from '@/lib/actions/category';

export default function RefreshCacheButton() {
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            const result = await revalidateCategories();
            if (result.success) {
                toast.success('Live site cache refreshed successfully!');
            } else {
                toast.error(result.error || 'Failed to refresh cache');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
            className="w-full sm:w-auto border-gray-100 font-bold text-[10px] uppercase tracking-widest px-6 h-12 rounded-xl hover:bg-orange-50 hover:text-orange-600 transition-all active:scale-95"
        >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Live Site Cache'}
        </Button>
    );
}
