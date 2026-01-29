import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import OccasionHero from '@/components/shop/OccasionHero';
import { getProducts } from '@/lib/actions/product';
import ProductCard from '@/components/shop/ProductCard';

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// Occasion mapping for "Editorial" content
const OCCASION_DATA: Record<string, { title: string; description: string; image: string; tag: string }> = {
    'wedding': {
        title: 'The Royal Wedding Collection',
        description: 'Handwoven Kanjeevarams for your special day. Pure Zari, timeless motifs, and heritage craftsmanship.',
        image: 'https://images.unsplash.com/photo-1546804240-f413d5043836?q=80&w=2669&auto=format&fit=crop',
        tag: 'Wedding'
    },
    'festive': {
        title: 'Festive Celebrations',
        description: 'Vibrant silk cottons and soft silks perfect for festivals and family gatherings.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop',
        tag: 'Festive'
    },
    'office-wear': {
        title: 'Professional Elegance',
        description: 'Comfortable, lightweight cottons and linens for the modern working woman.',
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?q=80&w=2574&auto=format&fit=crop', // Better office image later
        tag: 'Office'
    },
    'party': {
        title: 'Evening Soiree',
        description: 'Shimmering soft silks and designer weaves for evening parties.',
        image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2548&auto=format&fit=crop',
        tag: 'Party'
    }
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const occasion = OCCASION_DATA[params.slug];
    if (!occasion) return { title: 'Occasion Not Found' };

    return {
        title: `${occasion.title} | Thulasi Textiles`,
        description: occasion.description,
    };
}

export default async function OccasionPage({ params, searchParams }: Props) {
    const slug = params.slug;
    const occasionInfo = OCCASION_DATA[slug];

    if (!occasionInfo) {
        notFound();
    }

    // Fetch products matching this occasion
    const { data: products } = await getProducts({
        occasions: [occasionInfo.tag], // Filter by the tag mapped above
        limit: 50
    });

    return (
        <main className="min-h-screen bg-white">
            <OccasionHero
                title={occasionInfo.title}
                description={occasionInfo.description}
                image={occasionInfo.image}
            />

            <section className="max-w-[1700px] mx-auto px-4 md:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        Curated Selection
                    </span>
                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">
                        {products?.length || 0} Exquisite Pieces
                    </span>
                </div>

                {products && products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <h3 className="text-xl font-serif text-gray-900 mb-2">Collection Coming Soon</h3>
                        <p className="text-gray-500">We are curating specific pieces for {occasionInfo.title}.</p>
                    </div>
                )}
            </section>
        </main>
    );
}
