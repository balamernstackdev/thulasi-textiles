import CategoryForm from '@/components/admin/CategoryForm';
import { getCategoriesTree } from '@/lib/actions/category';

export const dynamic = 'force-dynamic';


export default async function NewCategoryPage() {
    const { data: categories } = await getCategoriesTree();

    return (
        <div className="container mx-auto px-6 py-12">
            <CategoryForm categories={categories || []} />
        </div>
    );
}
