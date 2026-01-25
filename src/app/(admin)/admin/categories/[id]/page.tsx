import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoryById, getCategoriesTree } from '@/lib/actions/category';
import { notFound } from 'next/navigation';

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const [{ data: category }, { data: categories }] = await Promise.all([
        getCategoryById(id),
        getCategoriesTree()
    ]);

    if (!category) {
        notFound();
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <CategoryForm
                category={category}
                categories={categories || []}
                isEditing={true}
            />
        </div>
    );
}
