'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Link2, X, Check, Loader2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { createBanner } from '@/lib/actions/banner';
import { toast } from 'sonner';

export default function BannerForm() {
    const [imageUrl, setImageUrl] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const clientAction = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            await createBanner(formData);
            setImageUrl(''); // Reset image after success
            toast.success('Banner created successfully');
        } catch (error) {
            toast.error('Failed to create banner');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10 mb-8">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                    <Plus className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">New Banner</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Global Promotions & Placement</p>
                </div>
            </div>

            <form action={clientAction} className="space-y-8">
                <input type="hidden" name="imageUrl" value={imageUrl} />

                {/* Section 1: Placement & Weight */}
                <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500" /> Campaign Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label htmlFor="type" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                Placement Zone
                            </label>
                            <select
                                name="type"
                                id="type"
                                className="w-full h-14 bg-white border-2 border-gray-100 rounded-xl px-5 text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-all cursor-pointer"
                            >
                                <option value="HOME_MAIN">Main Home Slider (1920x600px)</option>
                                <option value="BEST_SELLER_SECTION">Best Sellers Section (1920x400px)</option>
                                <option value="OFFER_SECTION">Offers Section (1920x400px)</option>
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="order" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Display Priority (Weight)</label>
                            <input
                                id="order"
                                type="number"
                                name="order"
                                defaultValue={0}
                                className="w-full h-14 bg-white rounded-xl border-2 border-gray-100 px-5 focus:border-orange-600 outline-none transition-all font-black text-gray-900"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Creative Content */}
                <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500" /> Visual & Copy
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Image Uploader - Takes 1 column */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                Banner Image
                            </label>
                            <div className="space-y-4">
                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary/sign"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                    onSuccess={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setImageUrl(result.info.secure_url);
                                        }
                                    }}
                                >
                                    {({ open }: { open: any }) => (
                                        <Button
                                            type="button"
                                            onClick={() => open()}
                                            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-dashed border-gray-200 hover:border-orange-500 px-6 py-12 h-auto rounded-2xl font-black uppercase tracking-widest transition-all group shadow-sm active:scale-95"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors" />
                                                <span className="text-xs">{imageUrl ? 'Replace Image' : 'Upload Asset'}</span>
                                            </div>
                                        </Button>
                                    )}
                                </CldUploadWidget>

                                {imageUrl && (
                                    <div className="relative group aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                                        <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Text Content - Takes 2 columns */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="space-y-3">
                                <label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Headline Text</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    placeholder="e.g. FESTIVE COLLECTION"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="subtitle" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Subtitle / Sales Hook</label>
                                <input
                                    id="subtitle"
                                    type="text"
                                    name="subtitle"
                                    placeholder="e.g. Up to 50% OFF on all items"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Action */}
                <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                    <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" /> Action & Routing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-3">
                            <label htmlFor="buttonText" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">CTA Button Label</label>
                            <input
                                id="buttonText"
                                type="text"
                                name="buttonText"
                                defaultValue="Shop Now"
                                className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-black text-center text-gray-900"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="link" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Destination URL</label>
                            <div className="relative">
                                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    id="link"
                                    type="text"
                                    name="link"
                                    placeholder="/category/women"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white pl-12 pr-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Submit Row */}
                <div className="flex items-center justify-between gap-6 pt-4 border-t border-gray-100">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                value="true"
                                defaultChecked
                                className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all checked:bg-emerald-500 hover:bg-gray-300"
                            />
                            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 shadow-sm"></span>
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Visible on Store</span>
                    </label>

                    <button
                        type="submit"
                        disabled={!imageUrl || isSubmitting}
                        className={`px-10 h-14 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 min-w-[240px] border-none ${!imageUrl || isSubmitting
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-black hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Plus className="w-5 h-5" />
                                Launch Promotion
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
