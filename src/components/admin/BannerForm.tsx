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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-6">
                <Plus className="w-5 h-5 text-orange-600" />
                <h2 className="text-lg font-semibold text-gray-900">Create Dynamic Banner</h2>
            </div>

            <form action={clientAction} className="space-y-5">
                <input type="hidden" name="imageUrl" value={imageUrl} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Left Column: Image & Type */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-bold text-gray-700 mb-2">
                                Placement Location <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="type"
                                id="type"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900 bg-white font-medium"
                            >
                                <option value="HOME_MAIN">Main Home Slider (1920x600px)</option>
                                <option value="BEST_SELLER_SECTION">Best Sellers Section (1920x400px)</option>
                                <option value="OFFER_SECTION">Offers Section (1920x400px)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Banner Image <span className="text-red-500">*</span>
                            </label>

                            <div className="space-y-3">
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
                                            variant="outline"
                                            className="w-full border-2 border-dashed border-gray-300 py-8 h-auto flex flex-col gap-2 hover:border-orange-500 hover:bg-orange-50 transition-all"
                                        >
                                            <Upload className="w-6 h-6 text-gray-400 group-hover:text-orange-500" />
                                            <span className="text-sm font-bold text-gray-500">
                                                {imageUrl ? 'Change Image' : 'Upload Banner Image'}
                                            </span>
                                        </Button>
                                    )}
                                </CldUploadWidget>

                                {imageUrl && (
                                    <div className="relative group aspect-[21/9] rounded-xl overflow-hidden border border-gray-200">
                                        <img src={imageUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl('')}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-[10px] font-black uppercase flex items-center gap-1 shadow-md">
                                            <Check className="w-3 h-3" /> Ready
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">Banner Title (Optional)</label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                placeholder="e.g. FESTIVE COLLECTION"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                            />
                        </div>
                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-bold text-gray-700 mb-2">Subtitle (Optional)</label>
                            <input
                                id="subtitle"
                                type="text"
                                name="subtitle"
                                placeholder="e.g. Up to 50% OFF on all items"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="buttonText" className="block text-sm font-bold text-gray-700 mb-2">Button Text</label>
                                <input
                                    id="buttonText"
                                    type="text"
                                    name="buttonText"
                                    defaultValue="Shop Now"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                                />
                            </div>
                            <div>
                                <label htmlFor="order" className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                                <input
                                    id="order"
                                    type="number"
                                    name="order"
                                    defaultValue={0}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Full Width Row: Link & Active */}
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="link" className="block text-sm font-bold text-gray-700 mb-2">Target Link</label>
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    id="link"
                                    type="text"
                                    name="link"
                                    placeholder="/category/women"
                                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-orange-500 outline-none text-gray-900"
                                />
                            </div>
                        </div>
                        <label className="flex items-center justify-center gap-3 cursor-pointer bg-gray-50 border border-gray-200 rounded-lg h-[46px] hover:border-orange-500 transition-all group">
                            <input
                                type="checkbox"
                                name="isActive"
                                value="true"
                                defaultChecked
                                className="w-5 h-5 text-orange-600 border-gray-300 rounded focus:ring-orange-500 cursor-pointer"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-orange-600 transition-colors">Active</span>
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!imageUrl || isSubmitting}
                    className={`px-8 py-3 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 min-w-[220px] ${!imageUrl || isSubmitting
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                        }`}
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            Create Banner
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
