
import { getBanners, createBanner, deleteBanner } from '@/lib/actions/banner';
import { revalidatePath } from 'next/cache';
import { Plus, Trash2, Link2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

import Pagination from '@/components/shared/Pagination';
import BannerForm from '@/components/admin/BannerForm';

export default async function BannersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const pageSize = 10;

    const { data: banners, pagination } = await getBanners({ page, pageSize });

    async function handleDeleteBanner(formData: FormData) {
        'use server';
        const id = formData.get('id') as string;
        await deleteBanner(id);
    }

    return (
        <div className="p-4 md:p-8 space-y-12">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Promotions</h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage store banners & highlights</p>
            </div>

            {/* Add Banner Form */}
            <section>
                <BannerForm />
            </section>

            {/* Existing Banners Management */}
            <div>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Plus className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Live Assets</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Currently active promotions</p>
                    </div>
                </div>

                {banners?.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
                        <Plus className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest">No banners active in the system</h3>
                    </div>
                ) : (
                    <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
                        {banners?.map((banner: any) => (
                            <div key={banner.id} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-orange-600 transition-all group">
                                <div className="aspect-[21/9] relative overflow-hidden bg-gray-900">
                                    <img
                                        src={banner.imageUrl}
                                        alt="Banner Preview"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90"
                                    />
                                    <div className="absolute top-4 left-4 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-xl">
                                        {banner.type}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white text-gray-900 text-[10px] font-black w-10 h-10 flex items-center justify-center rounded-xl shadow-2xl">
                                        #{banner.order}
                                    </div>
                                    {banner.title && (
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                                            <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">{banner.title}</h3>
                                            <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-1">{banner.subtitle}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-gray-300 mb-1">
                                            <Link2 className="w-3 h-3" />
                                            <span className="text-[9px] uppercase font-black tracking-[0.2em]">Target Link</span>
                                        </div>
                                        <p className="text-xs font-black text-gray-900 truncate italic">
                                            {banner.link || "— No Path Defined —"}
                                        </p>
                                    </div>
                                    <form action={handleDeleteBanner}>
                                        <input type="hidden" name="id" value={banner.id} />
                                        <button
                                            type="submit"
                                            className="bg-gray-50 text-gray-300 hover:bg-red-600 hover:text-white p-4 rounded-2xl transition-all active:scale-90 shadow-sm"
                                        >
                                            <Trash2 className="w-5 h-5 transition-transform" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    baseUrl="/admin/banners"
                />
            )}
        </div>
    );
}
