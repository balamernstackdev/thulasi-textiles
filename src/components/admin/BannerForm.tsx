'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Link2, X, Check, Loader2, Save } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { createBanner, updateBanner } from '@/lib/actions/banner';
import { toast } from 'sonner';

interface BannerFormProps {
    initialData?: any;
    onSuccess?: () => void;
}

export default function BannerForm({ initialData, onSuccess }: BannerFormProps) {
    const [bannerType, setBannerType] = useState(initialData?.type || 'HOME_MAIN');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [mobileImageUrl, setMobileImageUrl] = useState(initialData?.mobileImageUrl || '');
    const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync state if initialData changes (e.g. when modal opens with new data)
    useEffect(() => {
        if (initialData) {
            setBannerType(initialData.type || 'HOME_MAIN');
            setImageUrl(initialData.imageUrl || '');
            setMobileImageUrl(initialData.mobileImageUrl || '');
            setVideoUrl(initialData.videoUrl || '');
        }
    }, [initialData]);

    const clientAction = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            let result;
            if (initialData) {
                result = await updateBanner(initialData.id, formData);
            } else {
                result = await createBanner(formData);
            }

            if (result.success) {
                if (!initialData) {
                    // Reset if creating new
                    setImageUrl('');
                    setMobileImageUrl('');
                    setVideoUrl('');
                    setBannerType('HOME_MAIN');
                    // Reset text inputs manually if needed or rely on form reset
                    const form = document.getElementById('banner-form') as HTMLFormElement;
                    form?.reset();
                }
                toast.success(initialData ? 'Banner updated successfully' : 'Banner created successfully');
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.error || (initialData ? 'Failed to update banner' : 'Failed to create banner'));
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`bg-white ${!initialData ? 'rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-10 mb-8' : 'h-full flex flex-col'}`}>
            {!initialData && (
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-100">
                        <Plus className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter">New Banner</h2>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Global Promotions & Placement</p>
                    </div>
                </div>
            )}

            <form id="banner-form" action={clientAction} className="space-y-8 h-full flex flex-col">
                <input type="hidden" name="imageUrl" value={imageUrl} />
                <input type="hidden" name="mobileImageUrl" value={mobileImageUrl} />
                <input type="hidden" name="videoUrl" value={videoUrl} />

                <div className="flex-1 overflow-y-auto pr-2 space-y-8">
                    {/* Section 1: Placement & Type */}
                    <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Campaign Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <label htmlFor="type" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Placement Zone
                                </label>
                                <select
                                    name="type"
                                    id="type"
                                    value={bannerType}
                                    onChange={(e) => setBannerType(e.target.value)}
                                    className="w-full h-14 bg-white border-2 border-gray-100 rounded-xl px-5 text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-all cursor-pointer"
                                >
                                    <option value="HOME_MAIN">Main Slider (1920x500)</option>
                                    <option value="VIDEO_HERO">Cinematic Video Hero</option>
                                    <option value="COUNTDOWN">Flash Sale Countdown</option>
                                    <option value="ANNOUNCEMENT">Top Bar Ticker</option>
                                    <option value="BEST_SELLER_SECTION">Best Sellers Zone</option>
                                    <option value="OFFER_SECTION">Offer Page Link</option>
                                    <option value="SIDEBAR_PROMO">Sidebar Tile</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="order" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Priority (Weight)</label>
                                <input
                                    id="order"
                                    type="number"
                                    name="order"
                                    defaultValue={initialData?.order || 0}
                                    className="w-full h-14 bg-white rounded-xl border-2 border-gray-100 px-5 focus:border-orange-600 outline-none transition-all font-black text-gray-900"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="alignment" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Text Alignment</label>
                                <select
                                    name="alignment"
                                    id="alignment"
                                    defaultValue={initialData?.alignment || 'LEFT'}
                                    className="w-full h-14 bg-white border-2 border-gray-100 rounded-xl px-5 text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-all cursor-pointer"
                                >
                                    <option value="LEFT">Left Aligned</option>
                                    <option value="CENTER">Center Aligned</option>
                                    <option value="RIGHT">Right Aligned</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Creative Assets */}
                    <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-500" /> Visual & Style
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {/* Image Uploader */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Desktop Banner
                                </label>
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
                                            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-dashed border-gray-200 hover:border-orange-500 py-8 h-auto rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-6 h-6 text-gray-300" />
                                                <span className="text-[10px]">{imageUrl ? 'Change' : 'Upload'} Desktop</span>
                                            </div>
                                        </Button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            {/* Mobile Image Uploader */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Mobile Banner
                                </label>
                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary/sign"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                    onSuccess={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setMobileImageUrl(result.info.secure_url);
                                        }
                                    }}
                                >
                                    {({ open }: { open: any }) => (
                                        <Button
                                            type="button"
                                            onClick={() => open()}
                                            className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-dashed border-gray-200 hover:border-orange-500 py-8 h-auto rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm"
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-6 h-6 text-gray-300" />
                                                <span className="text-[10px]">{mobileImageUrl ? 'Change' : 'Upload'} Mobile</span>
                                            </div>
                                        </Button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            {/* Video Uploader - Conditional */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                                    Video Asset (Optional)
                                </label>
                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary/sign"
                                    options={{ resourceType: 'video' }}
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                    onSuccess={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setVideoUrl(result.info.secure_url);
                                        }
                                    }}
                                >
                                    {({ open }: { open: any }) => (
                                        <Button
                                            type="button"
                                            onClick={() => open()}
                                            className={`w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-dashed px-4 py-8 h-auto rounded-2xl font-black uppercase tracking-widest transition-all shadow-sm ${bannerType === 'VIDEO_HERO' ? 'border-orange-500' : 'border-gray-200 opacity-50'}`}
                                        >
                                            <div className="flex flex-col items-center gap-2">
                                                <Upload className="w-6 h-6 text-gray-300" />
                                                <span className="text-[10px]">{videoUrl ? 'Change' : 'Upload'} Video</span>
                                            </div>
                                        </Button>
                                    )}
                                </CldUploadWidget>
                            </div>

                            {/* Color Picker: Background */}
                            <div className="space-y-3">
                                <label htmlFor="backgroundColor" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Brand Background</label>
                                <div className="flex items-center gap-3 h-14 bg-white border-2 border-gray-100 rounded-xl px-4">
                                    <input
                                        id="backgroundColor"
                                        type="color"
                                        name="backgroundColor"
                                        defaultValue={initialData?.backgroundColor || "#000000"}
                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-xs font-bold text-gray-900 uppercase">Background</span>
                                </div>
                            </div>

                            {/* Color Picker: Text */}
                            <div className="space-y-3">
                                <label htmlFor="textColor" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Typography Color</label>
                                <div className="flex items-center gap-3 h-14 bg-white border-2 border-gray-100 rounded-xl px-4">
                                    <input
                                        id="textColor"
                                        type="color"
                                        name="textColor"
                                        defaultValue={initialData?.textColor || "#ffffff"}
                                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                                    />
                                    <span className="text-xs font-bold text-gray-900 uppercase">Text / UI</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Content & Timeline */}
                    <section className="bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Copywriting & Action
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-3 lg:col-span-2">
                                <label htmlFor="title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Headline</label>
                                <input
                                    id="title"
                                    type="text"
                                    name="title"
                                    defaultValue={initialData?.title || ''}
                                    placeholder="e.g. FESTIVE COLLECTION"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="buttonText" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">BTN Label</label>
                                <input
                                    id="buttonText"
                                    type="text"
                                    name="buttonText"
                                    defaultValue={initialData?.buttonText || "Shop Now"}
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-black text-center text-gray-900"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="countdownEndDate" className={`text-[10px] font-black uppercase tracking-widest pl-2 ${bannerType === 'COUNTDOWN' ? 'text-orange-600' : 'text-gray-400'}`}>Expiry (Countdown)</label>
                                <input
                                    id="countdownEndDate"
                                    type="datetime-local"
                                    name="countdownEndDate"
                                    defaultValue={initialData?.countdownEndDate ? new Date(initialData.countdownEndDate).toISOString().slice(0, 16) : ''}
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                    disabled={bannerType !== 'COUNTDOWN'}
                                />
                            </div>

                            <div className="space-y-3 lg:col-span-3">
                                <label htmlFor="subtitle" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Sales Hook / Subtitle</label>
                                <input
                                    id="subtitle"
                                    type="text"
                                    name="subtitle"
                                    defaultValue={initialData?.subtitle || ''}
                                    placeholder="e.g. Up to 50% OFF on all items"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                />
                            </div>
                            <div className="space-y-3">
                                <label htmlFor="link" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Target Link</label>
                                <div className="relative">
                                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        id="link"
                                        type="text"
                                        name="link"
                                        defaultValue={initialData?.link || ''}
                                        placeholder="/category/women"
                                        className="w-full h-14 rounded-xl border-2 border-gray-100 bg-white pl-12 pr-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Submit Row */}
                <div className="flex items-center justify-between gap-6 pt-4 border-t border-gray-100 mt-auto">
                    <label className="flex items-center gap-4 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                name="isActive"
                                value="true"
                                defaultChecked={initialData ? initialData.isActive : true}
                                className="peer h-6 w-11 cursor-pointer appearance-none rounded-full bg-gray-200 transition-all checked:bg-emerald-500 hover:bg-gray-300"
                            />
                            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-all peer-checked:left-6 shadow-sm"></span>
                        </div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">Visible on Store</span>
                    </label>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-10 h-14 rounded-xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 min-w-[240px] border-none ${isSubmitting
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                            : 'bg-black hover:bg-orange-600 text-white'
                            }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {initialData ? <Save className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {initialData ? 'Update Banner' : 'Deploy Banner'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
