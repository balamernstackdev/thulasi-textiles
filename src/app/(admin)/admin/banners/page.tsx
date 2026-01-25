
import { getBanners, createBanner, deleteBanner } from '@/lib/actions/banner';
import { revalidatePath } from 'next/cache';
import { Plus, Trash2, Link2 } from 'lucide-react';

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
        <div className="p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
                <p className="text-gray-500 mt-1">Manage promotional banners and section highlights across the store</p>
            </div>

            {/* Add Banner Form */}
            <BannerForm />

            {/* Existing Banners Management */}
            <div>
                <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">Manage Live Banners</h2>
                {banners?.length === 0 ? (
                    <div className="bg-white rounded-xl border-4 border-dashed border-gray-200 p-20 text-center">
                        <Plus className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No banners active in the system</h3>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 overflow-hidden">
                        {banners?.map((banner: any) => (
                            <div key={banner.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                                <div className="aspect-[21/9] relative overflow-hidden bg-gray-900">
                                    <img
                                        src={banner.imageUrl}
                                        alt="Banner Preview"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-gray-900/80 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter backdrop-blur-md">
                                        Type: {banner.type}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-black w-8 h-8 flex items-center justify-center rounded-full shadow-lg">
                                        {banner.order}
                                    </div>
                                    {banner.title && (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 p-4">
                                            <h3 className="text-white font-black text-lg uppercase italic tracking-tighter">{banner.title}</h3>
                                            <p className="text-white/80 text-[10px]">{banner.subtitle}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5 flex items-center justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Link2 className="w-3 h-3" />
                                            <span className="text-[10px] uppercase font-bold tracking-widest">Link Path</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 truncate">
                                            {banner.link || "— No Link Attached —"}
                                        </p>
                                    </div>
                                    <form action={handleDeleteBanner}>
                                        <input type="hidden" name="id" value={banner.id} />
                                        <button
                                            type="submit"
                                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white p-3 rounded-xl transition-all group/del"
                                        >
                                            <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />
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
