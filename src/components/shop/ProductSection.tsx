import ProductCard from './ProductCard';
import Link from 'next/link';

interface ProductWithData {
    id: string;
    name: string;
    slug: string;
    basePrice: any;
    images: any[];
    category: any;
    isFeatured: boolean;
    isBestSeller: boolean;
}

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: ProductWithData[];
    viewAllLink?: string;
    bgVariant?: 'white' | 'gray';
    session?: any;
}

export default function ProductSection({
    title,
    subtitle,
    products,
    viewAllLink,
    bgVariant = 'white',
    session
}: ProductSectionProps) {
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-12 md:py-16 ${bgVariant === 'gray' ? 'bg-gray-50' : 'bg-white'}`}>
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase">{title}</h2>
                        {subtitle && <p className="text-sm md:text-base text-gray-500 font-medium">{subtitle}</p>}
                    </div>
                    {viewAllLink && (
                        <Link
                            href={viewAllLink}
                            className="inline-flex items-center gap-2 text-orange-600 font-black text-xs md:text-sm uppercase tracking-widest hover:translate-x-1 transition-transform"
                        >
                            View All Collection →
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product as any} session={session} />
                    ))}
                </div>
            </div>
        </section>
    );
}
