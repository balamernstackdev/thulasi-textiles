import ProductCarousel from './ProductCarousel';
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
        <section className={`py-2 md:py-8 ${bgVariant === 'gray' ? 'bg-[#F2F2F2]' : 'bg-white'}`}>
            <div className="max-w-[1700px] mx-auto px-0 md:px-12 lg:px-20">
                <div className="bg-transparent md:bg-white md:rounded-[2.5rem] p-2 md:p-6 md:shadow-sm md:border md:border-gray-100">
                    <div className="flex flex-col md:flex-row items-baseline justify-between mb-4 md:mb-8 gap-4">
                        <div className="space-y-3">
                            <p className="text-orange-600 font-bold uppercase tracking-widest text-[10px] md:text-xs">
                                {subtitle || "Surgical Selection"}
                            </p>
                            <h2 className="text-4xl md:text-6xl font-serif italic text-gray-900 leading-none">
                                {title.split(' ')[0]} <span className="text-orange-600">{title.split(' ').slice(1).join(' ')}</span>
                            </h2>
                        </div>
                        {viewAllLink && (
                            <Link
                                href={viewAllLink}
                                className="group flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-900 hover:text-orange-600 transition-colors"
                            >
                                <span>Explore All {title.split(' ')[0]}</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    <ProductCarousel products={products} session={session} />
                </div>
            </div>
        </section>
    );
}
