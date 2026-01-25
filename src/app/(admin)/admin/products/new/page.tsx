import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/ProductForm';
import { getCategoriesTree } from '@/lib/actions/category';

export default async function NewProductPage() {
    const { data: categories } = await getCategoriesTree();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Create Product</h1>
                    <p className="text-gray-500 text-sm">Add a new product to your catalog</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <ProductForm categories={categories || []} />
            </div>
        </div>
    );
}
