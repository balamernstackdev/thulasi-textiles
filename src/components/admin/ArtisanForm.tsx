'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { createArtisan, updateArtisan } from '@/lib/actions/artisan';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ArtisanForm({ artisan }: { artisan?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(artisan?.imageUrl || '');
    const isEditing = !!artisan;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name') as string,
            bio: formData.get('bio') as string,
            experienceYears: parseInt(formData.get('experienceYears') as string) || 0,
            village: formData.get('village') as string,
            specialty: formData.get('specialty') as string,
            imageUrl: imageUrl
        };

        try {
            const res = isEditing
                ? await updateArtisan(artisan.id, data)
                : await createArtisan(data);

            if (res.success) {
                toast.success(`Artisan ${isEditing ? 'updated' : 'created'} successfully`);
                router.push('/admin/artisans');
                router.refresh();
            } else {
                toast.error(res.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left: Image Upload */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Artisan Portrait</label>
                    <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 overflow-hidden relative group">
                        {imageUrl ? (
                            <>
                                <img src={imageUrl} alt="Artisan Preview" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setImageUrl('')}
                                        className="bg-white text-red-600 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
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
                                        <button
                                            type="button"
                                            onClick={() => open()}
                                            className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-gray-400 shadow-sm mb-4 hover:text-orange-600 transition-colors"
                                        >
                                            <Upload className="w-6 h-6" />
                                        </button>
                                    )}
                                </CldUploadWidget>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Upload Master Portrait</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Full Name</label>
                            <input
                                name="name"
                                defaultValue={artisan?.name}
                                required
                                className="w-full h-14 bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                placeholder="e.g., Master Weaver Ravi"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Specialty</label>
                            <input
                                name="specialty"
                                defaultValue={artisan?.specialty}
                                className="w-full h-14 bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                placeholder="e.g., Kanchipuram Gold Zari"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Experience (Years)</label>
                            <input
                                name="experienceYears"
                                type="number"
                                defaultValue={artisan?.experienceYears}
                                className="w-full h-14 bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                placeholder="e.g., 25"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Village / Origin</label>
                            <input
                                name="village"
                                defaultValue={artisan?.village}
                                className="w-full h-14 bg-white border-2 border-gray-100 rounded-2xl px-6 text-sm font-bold focus:border-orange-600 outline-none transition-all"
                                placeholder="e.g., Kanchipuram, Tamil Nadu"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2 mb-2 block">Biography & Heritage</label>
                            <textarea
                                name="bio"
                                defaultValue={artisan?.bio}
                                rows={5}
                                className="w-full bg-white border-2 border-gray-100 rounded-[2rem] p-6 text-sm font-medium focus:border-orange-600 outline-none transition-all resize-none"
                                placeholder="Tell their story and connection to the weave..."
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-6">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-16 px-12 rounded-[2rem] bg-black text-white hover:bg-orange-600 font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all flex-1"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `${isEditing ? 'Update Profile' : 'Immortalize Artisan'}`}
                        </Button>
                        <Link href="/admin/artisans" className="h-16 px-10 rounded-[2rem] bg-gray-100 text-gray-400 hover:bg-gray-200 font-black uppercase text-[10px] tracking-widest transition-all flex items-center justify-center">
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}
