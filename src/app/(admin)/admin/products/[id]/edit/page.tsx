import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductForm from '@/components/admin/ProductForm';
import { getCategoriesTree } from '@/lib/actions/category';
import { getProductById } from '@/lib/actions/product';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';


export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [categoriesResult, productResult] = await Promise.all([
        getCategoriesTree(),
        getProductById(id)
    ]);

    const categories = categoriesResult.data || [];
    const product = productResult.data;

    if (!product) {
        notFound();
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-6">
                <Link href="/admin/products">
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm hover:bg-orange-600 hover:text-white transition-all">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight italic">Refine Product</h1>
                    <p className="text-gray-400 font-medium">Fine-tune the details of your heritage collection</p>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.1)] border border-gray-50 p-10 lg:p-16">
                <ProductForm categories={categories} product={product} />
            </div>
        </div>
    );
}
