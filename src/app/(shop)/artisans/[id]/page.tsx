import { getArtisanById } from '@/lib/actions/artisan';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Award, MapPin, Sparkles, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import ProductCard from '@/components/shop/ProductCard';
import { getSession } from '@/lib/auth';

export default async function ArtisanProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const res = await getArtisanById(id);
    const session = await getSession();

    if (!res.success || !res.data) {
        notFound();
    }

    const artisan = res.data;

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100 hidden lg:block">
                <div className="max-w-[1500px] mx-auto px-6 py-3">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
                        <Link href="/" className="hover:text-orange-600">Home</Link>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900">Artisan Collective</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                        <span className="text-gray-900">{artisan.name}</span>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="max-w-[1500px] mx-auto px-4 md:px-6 lg:px-8 py-10 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-gray-50 border-8 border-white group">
                        {artisan.imageUrl ? (
                            <Image
                                src={artisan.imageUrl}
                                alt={artisan.name}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105"
                            />
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <span className="text-gray-200 font-bold uppercase">No Portrait</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-12">
                            <p className="text-white text-sm font-medium italic">"Every weave tells a thousand stories of my ancestors."</p>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Master Artisan</span>
                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles className="w-4 h-4" /> Trusted Partner
                                </div>
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">
                                {artisan.name}
                            </h1>
                            <div className="flex flex-wrap gap-8 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                        <Award className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Experience</p>
                                        <p className="text-sm font-bold text-gray-900 leading-none">{artisan.experienceYears || '25+'} Years</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Village</p>
                                        <p className="text-sm font-bold text-gray-900 leading-none">{artisan.village || 'Tamil Nadu'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-4">The Legacy</h3>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium">
                                {artisan.bio || "This master artisan has been preserving the sacred weaves of South India for decades. Each piece they create is a testament to the patient, meticulous hand-loom traditions passed down through seven generations."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Products Section */}
                <div className="mt-32 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-10">
                        <div>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase italic tracking-tighter">Masterpieces</h2>
                            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-black">Handcrafted by {artisan.name}</p>
                        </div>
                        <div className="bg-black text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" /> {artisan.products?.length || 0} Artifacts
                        </div>
                    </div>

                    {artisan.products && artisan.products.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                            {artisan.products.map((product: any) => (
                                <ProductCard key={product.id} product={product} session={session} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No artifacts currently in vault</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
