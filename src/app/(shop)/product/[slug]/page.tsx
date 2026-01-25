import { getProductBySlug, getProducts } from '@/lib/actions/product';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';
// import ProductCard from '@/components/shop/ProductCard';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Star, ArrowRight, Sparkles, Scissors, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import ProductInteraction from '@/components/shop/ProductInteraction';
import ProductCarousel from '@/components/shop/ProductCarousel';
import { checkWishstatus } from '@/lib/actions/wishlist';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: product } = await getProductBySlug(slug);

    if (!product) return { title: 'Product Not Found' };

    return {
        title: product.metaTitle || `${product.name} | Thulasi Textiles`,
        description: product.metaDescription || product.description.substring(0, 160),
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const { data: product } = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }

    // Parallel fetching for remaining data
    const [wishStatus, relatedProductsResult, session] = await Promise.all([
        checkWishstatus(product.id),
        getProducts({
            categorySlug: product.category.slug,
            limit: 5
        }),
        getSession()
    ]);

    const isWishlisted = wishStatus.isWishlisted;
    let relatedProducts: any[] = [];
    if (relatedProductsResult.success && 'data' in relatedProductsResult) {
        relatedProducts = relatedProductsResult.data;
    }

    // Fallback if no related products (ensure a rich listing is always visible)
    if (relatedProducts.length <= 3) {
        const featuredResult = await getProducts({ isFeatured: true, limit: 12 });
        if (featuredResult.success && 'data' in featuredResult) {
            // Merge and de-duplicate
            const existingIds = new Set(relatedProducts.map(p => p.id));
            const additional = (featuredResult.data as any[]).filter(p => !existingIds.has(p.id));
            relatedProducts = [...relatedProducts, ...additional];
        }
    }

    // Parse artisan images
    const artisanImages = (() => {
        if (!product.artisanImage) return [];
        try {
            const parsed = JSON.parse(product.artisanImage);
            return Array.isArray(parsed) ? parsed : [product.artisanImage];
        } catch (e) {
            return [product.artisanImage];
        }
    })();

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumbs - Now Sticky with Balanced Offset */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-[60px] lg:top-[160px] z-40 transition-all duration-300">
                <div className="max-w-[1700px] mx-auto px-6 py-1">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        <Link href={`/category/${product.category.parent?.slug || product.category.slug}`} className="hover:text-orange-600 transition-colors">
                            {product.category.parent?.name || product.category.name}
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                        {product.category.parent && (
                            <>
                                <Link href={`/category/${product.category.slug}`} className="hover:text-orange-600 transition-colors">
                                    {product.category.name}
                                </Link>
                                <ChevronRight className="w-3.5 h-3.5 text-gray-200" />
                            </>
                        )}
                        <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
                    </div>
                </div>
            </div>

            <main className="pb-4 pt-1">
                <div className="max-w-[1700px] mx-auto px-6 py-1 lg:py-2">
                    {/* The 3-Column Grid is now inside ProductInteraction for better state control */}
                    <ProductInteraction product={product} isWishlisted={isWishlisted} />

                    {/* Dynamic Artisan Story Section (Full Width across Info/Images columns) */}
                    <div className="grid grid-cols-1 lg:grid-cols-[7.5fr_2.5fr] gap-6">
                        <div className="space-y-8">
                            {(product.artisanStory || artisanImages.length > 0) && (
                                <section className="relative h-[400px] rounded-sm overflow-hidden group shadow-sm">
                                    {/* For multiple images, we show the first one but acknowledge the "listing" by using a fade/carousel effect in the future. 
                                        For now, we fulfill the "banners" requirement by supporting multiple uploads. */}
                                    <Image
                                        src={artisanImages[0] || "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=2000"}
                                        alt="The Artisan Story"
                                        fill
                                        className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex items-center p-12 lg:p-24">
                                        <div className="max-w-2xl space-y-8">
                                            <div className="flex items-center gap-4">
                                                <span className="text-orange-500 font-black uppercase tracking-[0.5em] text-xs">The Heritage Story</span>
                                                {artisanImages.length > 1 && (
                                                    <span className="bg-orange-500/20 text-orange-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-500/30">
                                                        {artisanImages.length} Fold Listing
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                                                Crafted with <span className="text-orange-500 text-shadow-lg">Love</span> & Tradition
                                            </h2>
                                            <p className="text-white/80 text-xl font-medium leading-relaxed">
                                                {product.artisanStory || "Every Thulasi Textile piece is born in the heart of traditional weaving clusters. We work directly with master artisans to bring you authentic weaves that celebrate the richness of Indian heritage while embracing modern aesthetics."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Multi-image indicator for "listing" feel */}
                                    {artisanImages.length > 1 && (
                                        <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                                            {artisanImages.map((_, i) => (
                                                <div key={i} className={`w-12 h-1 rounded-full ${i === 0 ? 'bg-orange-600' : 'bg-white/30'}`} />
                                            ))}
                                        </div>
                                    )}
                                </section>
                            )}

                            {/* Dynamic Technical Details & Care */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
                                {/* Technical Specs */}
                                <div className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm flex flex-col h-full">
                                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50">
                                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Technical Specs</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Product Credentials</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-y-2">
                                        {[
                                            { label: 'Material', value: product.fabric || 'Premium Organic Cotton', icon: Sparkles },
                                            { label: 'Weave Type', value: product.weave || 'Traditional Loom', icon: Scissors },
                                            { label: 'Origin', value: product.origin || 'Tamil Nadu', icon: MapPin },
                                            { label: 'Occasion', value: product.occasion || 'Everyday Elegance', icon: Star }
                                        ].map((spec, i) => (
                                            <div key={i} className="flex items-center justify-between py-4 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                        <spec.icon className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900">{spec.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Care Guide */}
                                <div className="bg-white rounded-sm p-6 border border-gray-200 shadow-sm flex flex-col h-full relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform" />

                                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-gray-50 relative z-10">
                                        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white">
                                            <RotateCcw className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Care Guide</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Longevity Instructions</p>
                                        </div>
                                    </div>

                                    <ul className="space-y-6 relative z-10">
                                        {(product.careInstructions || "Professional Dry Clean Only\nStore in a cool place\nAvoid direct sunlight\nIron on medium heat")
                                            .split('\n')
                                            .map((step: string, i: number) => (
                                                <li key={i} className="flex items-start gap-4">
                                                    <div className="mt-1 w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-600 leading-relaxed">{step}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>

                                    <div className="mt-auto pt-10 relative z-10">
                                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100">
                                            <p className="text-[10px] font-bold text-orange-700 leading-relaxed">
                                                <AlertCircle className="w-3 h-3 inline-block mr-2 -mt-0.5" />
                                                Following these steps ensures your Thulasi textile retains its heritage sheen for generations.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block h-full border-l border-gray-100 pl-12" />
                    </div>

                    {/* Related Products Carousel */}
                    {relatedProducts && relatedProducts.length > 0 && (
                        <div className="pt-8 mt-8 border-t border-gray-100">
                            <ProductCarousel
                                products={relatedProducts.filter((p: any) => p.id !== product.id)}
                                title="Products related to this item"
                                session={session}
                            />

                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
