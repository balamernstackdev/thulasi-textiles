import { getRelatedProducts } from '@/lib/actions/product';
import ProductCard from './ProductCard';

export default async function RelatedProducts({
    productId,
    categoryId,
    fabric,
    session
}: {
    productId: string,
    categoryId: string,
    fabric?: string,
    session: any
}) {
    const res = await getRelatedProducts(productId, categoryId, fabric);

    if (!res.success || !res.data || res.data.length === 0) {
        return null;
    }

    return (
        <section className="mt-24 pt-16 border-t border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">You May Also Like</h2>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Handpicked matches for your style</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {res.data.map((product: any) => (
                    <ProductCard key={product.id} product={product} session={session} />
                ))}
            </div>
        </section>
    );
}
