'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CldUploadWidget } from 'next-cloudinary';
import { ImageIcon, Trash2, Save, X, ChevronRight, LayoutGrid, Type, AlignLeft, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createCategory, updateCategory } from '@/lib/actions/category';

interface CategoryFormProps {
    category?: any;
    categories: any[];
    isEditing?: boolean;
}

export default function CategoryForm({ category, categories, isEditing = false }: CategoryFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState(category?.name || '');
    const [slug, setSlug] = useState(category?.slug || '');
    const [description, setDescription] = useState(category?.description || '');
    const [image, setImage] = useState(category?.image || '');
    const [parentId, setParentId] = useState(category?.parentId || 'none');

    // Auto-slug generation
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setName(val);
        if (!isEditing) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.set('name', name);
        formData.set('slug', slug);
        formData.set('description', description);
        formData.set('image', image);
        formData.set('parentId', parentId);

        try {
            const result = isEditing
                ? await updateCategory(category.id, formData)
                : await createCategory(formData);

            if (result.success) {
                toast.success(`Category ${isEditing ? 'updated' : 'created'} successfully!`);
                router.push('/admin/categories');
                router.refresh();
            } else {
                toast.error(result.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-12 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                        <LayoutGrid className="w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter">
                            {isEditing ? 'Edit Category' : 'New Category'}
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                            Collection Management & Hierarchy
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="rounded-xl border-gray-100 font-bold text-xs uppercase tracking-widest px-6"
                    >
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest px-8 shadow-lg shadow-orange-100 border-none"
                    >
                        {loading ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Category</>}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-12 items-start">
                <div className="space-y-8">
                    {/* Basic Info */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Type className="w-5 h-5 text-orange-600" />
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Basic Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Category Name</label>
                                <input
                                    value={name}
                                    onChange={handleNameChange}
                                    placeholder="e.g. Silk Sarees"
                                    className="w-full h-14 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white px-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                    required
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">URL Slug</label>
                                <div className="relative">
                                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="silk-sarees"
                                        className="w-full h-14 rounded-xl border-2 border-gray-100 bg-gray-50/30 focus:bg-white pl-10 pr-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Tell the story of this collection..."
                                    className="w-full min-h-[160px] rounded-[1.5rem] border-2 border-gray-100 bg-gray-50/30 focus:bg-white pl-12 pr-6 pt-4 focus:border-orange-600 outline-none transition-all font-medium leading-relaxed text-gray-900"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Hierarchy Selection */}
                    <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 mb-2">
                            <LayoutGrid className="w-5 h-5 text-orange-600" />
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Parent Category</h3>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Nest Under</label>
                            <select
                                value={parentId}
                                onChange={(e) => setParentId(e.target.value)}
                                className="w-full h-14 bg-gray-50/30 border-2 border-gray-100 rounded-xl px-5 text-sm font-bold text-gray-900 outline-none focus:border-orange-600 transition-all cursor-pointer"
                            >
                                <option value="none">Main Collection (No Parent)</option>
                                {categories.filter(c => c.id !== category?.id && !c.parentId).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-400 font-medium pl-2 italic">
                                * Subcategories are displayed as dropdowns and sidebar filters on the shop.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Sidebar: Images */}
                <div className="space-y-8 lg:sticky lg:top-8">
                    <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 mb-2">
                            <ImageIcon className="w-5 h-5 text-orange-600" />
                            <h3 className="text-[11px] font-black text-gray-900 uppercase tracking-[0.3em]">Featured Image</h3>
                        </div>

                        <div className="group relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center transition-all hover:border-orange-600">
                            {image ? (
                                <>
                                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setImage('')}
                                        className="absolute top-3 right-3 bg-red-600 text-white p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-8 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-white mx-auto flex items-center justify-center shadow-sm">
                                        <ImageIcon className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                                        High-fidelity portrait for collection banners
                                    </p>
                                </div>
                            )}
                        </div>

                        <CldUploadWidget
                            signatureEndpoint="/api/cloudinary/sign"
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                            onSuccess={(result: any) => {
                                if (result.info?.secure_url) {
                                    setImage(result.info.secure_url);
                                }
                            }}
                        >
                            {({ open }: { open: any }) => (
                                <Button
                                    type="button"
                                    onClick={() => open()}
                                    className="w-full bg-black text-white px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                                >
                                    Upload Banner Image
                                </Button>
                            )}
                        </CldUploadWidget>

                        <div className="relative">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-gray-100 rounded-none px-0 py-2 text-[10px] font-bold text-gray-400 focus:border-orange-600 outline-none placeholder:text-gray-200"
                                placeholder="Paste image URL manually..."
                            />
                        </div>
                    </section>
                </div>
            </div>
        </form>
    );
}
