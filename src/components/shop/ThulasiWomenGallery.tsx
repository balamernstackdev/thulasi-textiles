import { Star, Instagram, ShoppingBag, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getGalleryReviews } from '@/lib/actions/review';

export default async function ThulasiWomenGallery() {
    const { data: reviews } = await getGalleryReviews();

    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="py-12 md:py-16 bg-white overflow-hidden">
            <div className="max-w-[1700px] mx-auto px-4 sm:px-8 md:px-12 lg:px-20">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
                                <Instagram className="w-6 h-6" />
                            </div>
                            <span className="text-rose-500 font-black uppercase tracking-[0.4em] text-xs">Community Spotlight</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            Our <span className="text-orange-600">Thulasi Women</span>
                        </h2>
                        <p className="text-gray-500 font-medium text-lg max-w-2xl leading-relaxed">
                            A curated collective of our patrons showcasing heritage weaves in their most authentic moments. Direct proof of artisanal excellence.
                        </p>
                    </div>
                    <Link
                        href="/community"
                        className="bg-black text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl active:scale-95"
                    >
                        Join the Collective
                    </Link>
                </div>

                {/* Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                    {reviews.map((review: any) => (
                        <div key={review.id} className="relative group break-inside-avoid">
                            {/* Card Container */}
                            <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2">
                                {/* Photo */}
                                <div className="relative aspect-[4/5] overflow-hidden">
                                    <img
                                        src={review.images?.[0]?.url}
                                        alt="Thulasi Woman"
                                        className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <Link
                                            href={`/product/${review.product?.slug}`}
                                            className="bg-white text-black px-6 py-3 rounded-full font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500"
                                        >
                                            <ShoppingBag className="w-3.5 h-3.5" />
                                            Shop This Look
                                        </Link>
                                    </div>

                                    {/* Product Tag Badge (Static) */}
                                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-lg">
                                        <div className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                                        <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest truncate max-w-[120px]">
                                            {review.product?.name}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-8 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-black">
                                                {review.user?.name?.[0] || 'T'}
                                            </div>
                                            <span className="text-xs font-black text-gray-900 uppercase tracking-tight">{review.user?.name}</span>
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 text-sm font-medium leading-relaxed line-clamp-3 italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Insight */}
                <div className="mt-16 pt-12 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            Joined by <span className="text-gray-900">5,000+ Thulasi Women</span> across the globe
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                        Verified Authentication Collective
                    </div>
                </div>
            </div>
        </section>
    );
}
