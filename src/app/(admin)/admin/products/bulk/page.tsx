import { getProducts } from '@/lib/actions/product';
import { getCategories } from '@/lib/actions/category';
import BulkProductEditor from '@/components/admin/BulkProductEditor';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BulkEditorPage() {
    const [productsResult, categoriesResult] = await Promise.all([
        getProducts({ limit: 1000 }), // Fetch a large batch for bulk editing
        getCategories()
    ]);

    const products = productsResult.data || [];
    const categories = categoriesResult.data || [];

    return (
        <div className="p-8 pb-24 max-w-[1700px] mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/products"
                    className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic">Bulk Editor</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                        Manage prices & inventory efficiently
                    </p>
                </div>
            </div>

            <BulkProductEditor initialProducts={products} categories={categories} />
        </div>
    );
}
