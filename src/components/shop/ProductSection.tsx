import ProductCard from './ProductCard';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
        <section className={`py-10 md:py-16 ${bgVariant === 'gray' ? 'bg-[#F2F2F2]' : 'bg-white'}`}>
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-8 gap-4">
                        <div className="space-y-1">
                            <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                {title.split(' ')[0]} <span className="text-orange-600">{title.split(' ').slice(1).join(' ')}</span>
                            </h2>
                            {subtitle && (
                                <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-orange-600 transition-colors"
                            >
                                View All Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product as any} session={session} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
