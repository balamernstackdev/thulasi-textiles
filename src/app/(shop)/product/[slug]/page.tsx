import { getProductBySlug, getProducts } from '@/lib/actions/product';
import { notFound } from 'next/navigation';
import ProductInteraction from '@/components/shop/ProductInteraction';
import Link from 'next/link';
import { ChevronRight, MapPin, Star, ShieldCheck, Scissors, RotateCcw, Package, Truck, Info, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import RelatedProducts from '@/components/shop/RelatedProducts';
import ReviewForm from '@/components/shop/ReviewForm';
import ReviewList from '@/components/shop/ReviewList';
import ProductDetailedFeatures from '@/components/shop/ProductDetailedFeatures';
import BundleWizard from '@/components/shop/BundleWizard';
import ArtisanPreview from '@/components/shop/ArtisanPreview';
import { checkWishstatus } from '@/lib/actions/wishlist';
import { getReviews } from '@/lib/actions/review';
import { Metadata } from 'next';
import { getSession } from '@/lib/auth';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const { data: product } = await getProductBySlug(slug);

    if (!product) return { title: 'Product Not Found' };

    const productPrice = `₹${Number(product.basePrice).toLocaleString('en-IN')}`;
    const productDesc = product.metaDescription || product.description.slice(0, 160);
    const heritageNote = product.weave ? `Authentic ${product.weave} weave.` : '';

    const description = `${product.name} at ${productPrice}. ${heritageNote} ${productDesc}`;
    const mainImage = product.images?.[0]?.url || '/logo.png';

    return {
        title: `${product.name} | Thulasi Textiles`,
        description: description,
        openGraph: {
            title: `${product.name} - Thulasi Textiles`,
            description: description,
            images: [
                {
                    url: mainImage,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            type: 'website',
            siteName: 'Thulasi Textiles',
        },
        twitter: {
            card: 'summary_large_image',
            title: product.name,
            description: description,
            images: [mainImage],
            creator: '@thulasitextiles',
        },
        keywords: [product.name, product.fabric, product.weave, 'Thulasi Textiles', 'Handcrafted', 'Artisan'].filter(Boolean) as string[],
    };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const [productResult, session] = await Promise.all([
        getProductBySlug(slug),
        getSession()
    ]);

    const product = productResult.success ? productResult.data : null;

    if (!product) {
        notFound();
    }

    const { isWishlisted } = await checkWishstatus(product.id);
    const reviewsResult = await getReviews(product.id);

    // Parse dedicated artisan images if they exist, otherwise fallback to product images
    let artisanImages: string[] = [];
    if (product.artisanImage) {
        try {
            const parsed = JSON.parse(product.artisanImage);
            artisanImages = Array.isArray(parsed) ? parsed : [parsed];
        } catch (e) {
            artisanImages = [product.artisanImage];
        }
    }

    if (artisanImages.length === 0) {
        artisanImages = product.images.map((img: any) => img.url);
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumbs - Static */}
            <div className="bg-white/95 backdrop-blur-md border-b border-gray-100 relative z-40 transition-all duration-300 hidden lg:block">
                <div className="max-w-[1500px] mx-auto px-4 md:px-6 py-1">
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
                <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-1 lg:py-4">
                    <ProductInteraction product={product} isWishlisted={isWishlisted} session={session} />

                    <div className="space-y-16 lg:space-y-24 mt-12 lg:mt-20">
                        <div className="space-y-12">
                            {(product.artisanStory || artisanImages.length > 0) && (
                                <section className="relative h-[400px] rounded-sm overflow-hidden group shadow-sm bg-black">
                                    {product.videoUrl ? (
                                        <div className="absolute inset-0 z-0">
                                            <video
                                                src={product.videoUrl}
                                                autoPlay
                                                muted
                                                loop
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40" />
                                        </div>
                                    ) : (
                                        <Image
                                            src={artisanImages[0] || "/placeholder-product.png"}
                                            alt="The Artisan Story"
                                            fill
                                            className="object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 flex items-center p-6 md:p-12 lg:p-24 z-10">
                                        <div className="max-w-2xl space-y-4 md:space-y-8">
                                            <div className="flex items-center gap-4">
                                                <span className="text-orange-500 font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-xs">The Heritage Story</span>
                                                {artisanImages.length > 1 && !product.videoUrl && (
                                                    <span className="bg-orange-500/20 text-orange-500 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-500/30">
                                                        {artisanImages.length} Fold Listing
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                                                Crafted with <span className="text-orange-500 text-shadow-lg">Love</span> & Tradition
                                            </h2>
                                            <p className="text-white/80 text-sm md:text-xl font-medium leading-relaxed">
                                                {product.artisanStory || "Every Thulasi Textile piece is born in the heart of traditional weaving clusters. We work directly with master artisans to bring you authentic weaves."}
                                            </p>
                                        </div>
                                    </div>
                                    {artisanImages.length > 1 && !product.videoUrl && (
                                        <div className="absolute bottom-12 right-12 flex gap-3 z-20">
                                            {artisanImages.map((_: string, i: number) => (
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

                        {/* Artisan Traceability & Loom Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <ArtisanPreview artisan={product.artisan} />

                            <div className="bg-gray-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                <div className="relative space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-orange-500 backdrop-blur-md">
                                            <Scissors className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Loom Audit</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loom Architecture</span>
                                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{product.loomType || 'Traditional Pit Loom'}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weaving Investment</span>
                                            <span className="text-sm font-bold text-white uppercase italic tracking-tight">{product.weavingHours || '84'} Hand-Crafted Hours</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Protocol</span>
                                            <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                                <ShieldCheck className="w-4 h-4" /> 100% Traceable
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider bg-white/5 p-4 rounded-2xl">
                                        This piece is encoded with a unique heritage signature. Upon purchase, a digital Certificate of Authenticity will be generated in your vault.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Strategy Sections */}
                        <div className="pt-16">
                            <ProductDetailedFeatures product={product} />
                        </div>

                        {/* Complete The Look */}
                        {product.complementaryProducts && product.complementaryProducts.length > 0 && (
                            <div className="pt-16 border-t border-gray-100">
                                <BundleWizard
                                    mainProduct={product}
                                    complementaryProducts={product.complementaryProducts}
                                />
                            </div>
                        )}

                        {/* Recommended Products */}
                        <RelatedProducts
                            productId={product.id}
                            categoryId={product.category.id}
                            fabric={product.fabric || undefined}
                            session={session}
                        />

                        {/* Customer Reviews Section */}
                        <section className="mt-16 pt-16 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                                <div>
                                    <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Customer Reviews</h2>
                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Authentication feedback from our community</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-12 items-start">
                                <div>
                                    {session ? (
                                        <ReviewForm productId={product.id} />
                                    ) : (
                                        <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">You must be logged in to leave a review.</p>
                                            <Link href="/login" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all hover:bg-orange-600">Login to Review</Link>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <ReviewList reviews={reviewsResult.success ? reviewsResult.data : []} />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
