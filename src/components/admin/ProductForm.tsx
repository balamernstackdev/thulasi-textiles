'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus, X, Image as ImageIcon, Trash2, Loader2, Video, Search, Check, ExternalLink } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import { createProduct, updateProduct, getProducts } from '@/lib/actions/product';
import { getArtisans } from '@/lib/actions/artisan';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Variant {
    sku: string;
    size: string;
    color: string;
    price: number;
    stock: number;
}

export default function ProductForm({ categories, product }: { categories: any[], product?: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form States
    const [imageUrls, setImageUrls] = useState<string[]>(product?.images.map((img: any) => img.url) || []);
    const [newImageUrl, setNewImageUrl] = useState('');

    const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
    const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);
    const [isOffer, setIsOffer] = useState(product?.isOffer || false);
    const [isNew, setIsNew] = useState(product?.isNew || false);
    const [isActive, setIsActive] = useState(product?.isActive ?? true);
    const [artisans, setArtisans] = useState<any[]>([]);
    const [selectedArtisanId, setSelectedArtisanId] = useState(product?.artisanId || '');

    // Parse artisan images (JSON array or single string)
    const [artisanImageUrls, setArtisanImageUrls] = useState<string[]>(() => {
        if (!product?.artisanImage) return [];
        try {
            const parsed = JSON.parse(product.artisanImage);
            if (Array.isArray(parsed)) return parsed.filter(Boolean);
            if (typeof parsed === 'string' && parsed) return [parsed];
            return [];
        } catch (e) {
            return (product.artisanImage && typeof product.artisanImage === 'string')
                ? [product.artisanImage].filter(Boolean)
                : [];
        }
    });
    const [newArtisanUrl, setNewArtisanUrl] = useState('');

    const [variants, setVariants] = useState<Variant[]>(product?.variants.map((v: any) => ({
        sku: v.sku,
        size: v.size || '',
        color: v.color || '',
        price: Number(v.price),
        stock: v.stock
    })) || []);

    const [newVariant, setNewVariant] = useState<Variant>({
        sku: '',
        size: '',
        color: '',
        price: 0,
        stock: 0
    });

    const [heritageTitle, setHeritageTitle] = useState(product?.heritageTitle || '');
    const [videoUrl, setVideoUrl] = useState(product?.videoUrl || '');
    const [complementaryProductIds, setComplementaryProductIds] = useState<string[]>(
        product?.complementaryProducts?.map((p: any) => p.id) || []
    );
    const [selectedComplementaryProducts, setSelectedComplementaryProducts] = useState<any[]>(
        product?.complementaryProducts || []
    );

    // Search for complementary products
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedSearchQuery) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            const res = await getProducts({ search: debouncedSearchQuery, limit: 5 });
            if (res.success) {
                setSearchResults((res.data || []).filter((p: any) => p.id !== product?.id));
            }
            setIsSearching(false);
        };
        fetchResults();
    }, [debouncedSearchQuery, product?.id]);

    useEffect(() => {
        const fetchArtisansList = async () => {
            const res = await getArtisans();
            if (res.success) setArtisans(res.data);
        };
        fetchArtisansList();
    }, []);

    const toggleComplementaryProduct = (p: any) => {
        if (complementaryProductIds.includes(p.id)) {
            setComplementaryProductIds(prev => prev.filter(id => id !== p.id));
            setSelectedComplementaryProducts(prev => prev.filter(item => item.id !== p.id));
        } else {
            setComplementaryProductIds(prev => [...prev, p.id]);
            setSelectedComplementaryProducts(prev => [...prev, p]);
        }
    };

    const [qualityAudit, setQualityAudit] = useState<any[]>(() => {
        if (product?.qualityAudit) {
            try {
                return typeof product.qualityAudit === 'string'
                    ? JSON.parse(product.qualityAudit)
                    : product.qualityAudit;
            } catch (e) {
                return [];
            }
        }
        return [
            { label: "Fabric Purity", val: "100%" },
            { label: "Color Fastness", val: "Lab Tested" },
            { label: "Weave Density", val: "High" },
            { label: "Finishing", val: "Hand-rolled" },
            { label: "Eco-Grade", val: "A+" }
        ];
    });

    const isEditing = !!product;

    const addArtisanImage = () => {
        if (newArtisanUrl.trim()) {
            setArtisanImageUrls(prev => [...prev, newArtisanUrl.trim()]);
            setNewArtisanUrl('');
        }
    };

    const addImage = () => {
        if (newImageUrl.trim()) {
            setImageUrls(prev => [...prev, newImageUrl.trim()]);
            setNewImageUrl('');
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const addVariant = () => {
        if (newVariant.sku && (newVariant.size || newVariant.color) && newVariant.price >= 0 && newVariant.stock >= 0) {
            setVariants(prev => [...prev, newVariant]);
            setNewVariant({
                sku: '',
                size: '',
                color: '',
                price: 0,
                stock: 0
            });
        }
    };

    const removeVariant = (index: number) => {
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.set('images', JSON.stringify(imageUrls));
        formData.set('variants', JSON.stringify(variants));
        formData.set('isFeatured', String(isFeatured));
        formData.set('isBestSeller', String(isBestSeller));
        formData.set('isOffer', String(isOffer));
        formData.set('isNew', String(isNew));
        formData.set('isActive', String(isActive));
        formData.set('artisanImage', JSON.stringify(artisanImageUrls));
        formData.set('heritageTitle', heritageTitle);
        formData.set('qualityAudit', JSON.stringify(qualityAudit));
        formData.set('videoUrl', videoUrl);
        formData.set('artisanId', selectedArtisanId);
        formData.set('complementaryProducts', JSON.stringify(complementaryProductIds));

        if (newImageUrl.trim()) {
            const finalImages = [...imageUrls, newImageUrl.trim()];
            formData.set('images', JSON.stringify(finalImages));
        }

        if (newArtisanUrl.trim()) {
            const finalArtisanImages = [...artisanImageUrls, newArtisanUrl.trim()];
            formData.set('artisanImage', JSON.stringify(finalArtisanImages));
        }

        try {
            if (isEditing) {
                const result = await updateProduct(product.id, formData);
                if (result.success) {
                    toast.success('Product updated successfully');
                } else {
                    toast.error(result.error || 'Failed to update product');
                    setLoading(false);
                    return;
                }
            } else {
                await createProduct(formData);
            }
            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Submit error:', error);
            toast.error('Failed to save your Product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-10" onSubmit={handleSubmit}>
            <input type="hidden" name="images" value={JSON.stringify(imageUrls)} />
            <input type="hidden" name="variants" value={JSON.stringify(variants)} />

            {/* Basic Information Section */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Basic Information</h2>
                    <p className="text-sm text-gray-400 font-medium">Essential details about your heritage Product</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Product Name <span className="text-orange-600">*</span>
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            defaultValue={product?.name || ''}
                            className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-600 outline-none text-gray-900 transition-all font-bold"
                            placeholder="e.g., Premium Kanchipuram Silk Saree"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={4}
                            defaultValue={product?.description || ''}
                            className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-600 outline-none text-gray-900 resize-none transition-all font-medium"
                            placeholder="Tell the story of this Product..."
                        />
                    </div>
                </div>
            </div>

            {/* Pricing, Category & Status Flags */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Pricing & Organization</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label htmlFor="price" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Base Price <span className="text-orange-600">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                            <input
                                id="price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={product?.basePrice || ''}
                                className="w-full border-2 border-gray-100 rounded-2xl pl-12 pr-6 py-4 focus:border-orange-600 outline-none text-gray-900 transition-all font-black"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="categoryId" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Category <span className="text-orange-600">*</span>
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            defaultValue={product?.categoryId || ''}
                            className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-600 outline-none text-gray-900 bg-white transition-all font-bold"
                            required
                        >
                            <option value="">Choose a category</option>
                            {categories.map(cat => (
                                <optgroup key={cat.id} label={cat.name} className="font-black text-gray-400 uppercase text-[10px] tracking-widest">
                                    {cat.children && cat.children.map((sub: any) => (
                                        <option key={sub.id} value={sub.id} className="text-gray-900 font-bold normal-case text-base">{sub.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="artisanId" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Master Artisan
                        </label>
                        <select
                            id="artisanId"
                            name="artisanId"
                            value={selectedArtisanId}
                            onChange={(e) => setSelectedArtisanId(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-600 outline-none text-gray-900 bg-white transition-all font-bold"
                        >
                            <option value="">Link an artisan...</option>
                            {artisans.map(artisan => (
                                <option key={artisan.id} value={artisan.id}>{artisan.name} ({artisan.village})</option>
                            ))}
                        </select>
                        <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase tracking-widest">
                            Linking a master artisan enables the "Artisan Story" feature in the shop.
                        </p>
                    </div>

                    {/* Flags */}
                    <div className="md:col-span-2 flex flex-wrap gap-8 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isFeatured}
                                onChange={(e) => setIsFeatured(e.target.checked)}
                                className="w-6 h-6 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 transition-all"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-orange-600 transition-colors">Featured</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isBestSeller}
                                onChange={(e) => setIsBestSeller(e.target.checked)}
                                className="w-6 h-6 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 transition-all"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-blue-600 transition-colors">Best Seller</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isOffer}
                                onChange={(e) => setIsOffer(e.target.checked)}
                                className="w-6 h-6 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 transition-all"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-green-600 transition-colors">On Offer</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isNew}
                                onChange={(e) => setIsNew(e.target.checked)}
                                className="w-6 h-6 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 transition-all"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-purple-600 transition-colors">New Arrival</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={isActive}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-6 h-6 text-orange-600 border-2 border-gray-300 rounded-lg focus:ring-orange-500 transition-all"
                            />
                            <span className="text-sm font-black text-gray-700 uppercase tracking-widest group-hover:text-teal-600 transition-colors">Active</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Media Assets Section */}
            <div className="space-y-8">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Media Assets</h2>
                    <p className="text-sm text-gray-400 font-medium">Manage product images, video content, and artisan portraits</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                    {/* Main Gallery */}
                    <div className="xl:col-span-3 space-y-6">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Product Gallery (Portrait Recommended)</label>
                        <div className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 space-y-6">
                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <CldUploadWidget
                                    signatureEndpoint="/api/cloudinary/sign"
                                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                    onSuccess={(result: any) => {
                                        if (result.info?.secure_url) {
                                            setImageUrls(prev => [...prev, result.info.secure_url]);
                                        }
                                    }}
                                >
                                    {({ open }: { open: any }) => (
                                        <Button
                                            type="button"
                                            onClick={() => open()}
                                            className="w-full md:w-auto bg-black hover:bg-orange-600 text-white px-8 py-7 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95"
                                        >
                                            <Upload className="w-5 h-5 mr-3" />
                                            Upload Media
                                        </Button>
                                    )}
                                </CldUploadWidget>

                                <div className="w-full flex gap-3">
                                    <input
                                        type="text"
                                        value={newImageUrl}
                                        onChange={(e) => setNewImageUrl(e.target.value)}
                                        className="flex-1 border-2 border-white rounded-xl px-6 py-4 focus:border-orange-600 outline-none text-gray-900 transition-all font-bold"
                                        placeholder="Paste image URL here"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addImage}
                                        className="h-[60px] w-[60px] rounded-xl bg-white text-gray-400 hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="w-6 h-6" />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative group aspect-[3/4] rounded-2xl border-2 border-white overflow-hidden bg-white shadow-sm transition-all hover:border-orange-200">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="bg-white text-red-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <div className="absolute top-2 left-2">
                                                <span className="bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em] shadow-lg">Primary</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Artisan & Video Sidebar */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Artisan & Media</label>
                            <div className="bg-orange-50/30 p-6 rounded-[2.5rem] border border-orange-100/50 flex flex-col space-y-6">
                                {/* Artisan Portraits */}
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest">Heritage Portraits</p>
                                    <div className="grid grid-cols-1 gap-3">
                                        {artisanImageUrls.map((url, idx) => (
                                            <div key={idx} className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-white border-2 border-white shadow-sm group">
                                                <img src={url} alt={`Artisan ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => setArtisanImageUrls(prev => prev.filter((_, i) => i !== idx))}
                                                    className="absolute top-1 right-1 bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <CldUploadWidget
                                        signatureEndpoint="/api/cloudinary/sign"
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'our-products'}
                                        onSuccess={(result: any) => {
                                            if (result.info?.secure_url) {
                                                setArtisanImageUrls(prev => [...prev, result.info.secure_url]);
                                            }
                                        }}
                                    >
                                        {({ open }: { open: any }) => (
                                            <Button type="button" onClick={() => open()} className="w-full bg-white border-2 border-orange-100 text-[10px] font-black uppercase text-gray-900 h-12 rounded-xl">
                                                Upload Portrait
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                </div>

                                {/* Video Loop */}
                                <div className="space-y-4 pt-6 border-t border-orange-100/50">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Video className="w-4 h-4" />
                                        <p className="text-[9px] font-black uppercase tracking-widest">Heritage Video</p>
                                    </div>
                                    <input
                                        type="text"
                                        value={videoUrl}
                                        onChange={(e) => setVideoUrl(e.target.value)}
                                        className="w-full bg-white/50 border-2 border-transparent focus:border-blue-600 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                                        placeholder="Video URL (Cloudinary/YouTube)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Product Variants</h2>
                    <p className="text-sm text-gray-400 font-medium">Define sizes and specific pricing</p>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border-2 border-gray-50 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">SKU ID</label>
                            <input
                                type="text"
                                placeholder="e.g. SLK-RED-M"
                                className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 focus:border-orange-600 outline-none transition-all font-bold"
                                value={newVariant.sku}
                                onChange={(e) => setNewVariant({ ...newVariant, sku: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Size</label>
                            <input
                                type="text"
                                placeholder="e.g. M, 40, Free"
                                className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 focus:border-orange-600 outline-none transition-all font-bold"
                                value={newVariant.size}
                                onChange={(e) => setNewVariant({ ...newVariant, size: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Color</label>
                            <input
                                type="text"
                                placeholder="e.g. Maroon"
                                className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 focus:border-orange-600 outline-none transition-all font-bold"
                                value={newVariant.color}
                                onChange={(e) => setNewVariant({ ...newVariant, color: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Variant Price</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 font-bold">₹</span>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full border-2 border-gray-50 rounded-xl pl-8 pr-4 py-3 focus:border-orange-600 outline-none transition-all font-black"
                                    value={newVariant.price || ''}
                                    onChange={(e) => setNewVariant({ ...newVariant, price: parseFloat(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Stock Units</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full border-2 border-gray-50 rounded-xl px-4 py-3 focus:border-orange-600 outline-none transition-all font-bold text-orange-600"
                                value={newVariant.stock || ''}
                                onChange={(e) => setNewVariant({ ...newVariant, stock: parseFloat(e.target.value) })}
                            />
                        </div>
                    </div>
                    <Button
                        type="button"
                        onClick={addVariant}
                        className="w-full bg-gray-900 hover:bg-orange-600 text-white py-6 rounded-2xl font-black uppercase tracking-widest transition-all"
                    >
                        <Plus className="w-5 h-5 mr-3" /> Add This Variant
                    </Button>
                </div>

                {variants.length > 0 && (
                    <div className="border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left min-w-[600px]">
                                <thead className="bg-gray-50/50 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">SKU</th>
                                        <th className="px-6 py-4">Attributes</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4 text-center">In Stock</th>
                                        <th className="px-6 py-4 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {variants.map((v, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50/30 transition-colors">
                                            <td className="px-6 py-5 font-black text-gray-900">{v.sku}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex gap-2">
                                                    {v.size && <span className="bg-white border text-[10px] font-black px-2 py-0.5 rounded-md text-gray-600">{v.size}</span>}
                                                    {v.color && <span className="bg-white border text-[10px] font-black px-2 py-0.5 rounded-md text-gray-600">{v.color}</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 font-black text-orange-600">₹{v.price.toLocaleString()}</td>
                                            <td className="px-6 py-5 font-bold text-center">
                                                <span className={`${v.stock > 0 ? 'text-green-600' : 'text-red-600'} bg-gray-50 px-3 py-1 rounded-full text-xs`}>
                                                    {v.stock} units
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button type="button" onClick={() => removeVariant(idx)} className="text-gray-300 hover:text-red-600 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Story & Craftsmanship */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Story & Craftsmanship</h2>
                    <p className="text-sm text-gray-400 font-medium">Define the technical details and artisan heritage</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-2">
                        <label htmlFor="artisanStory" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Artisan Story
                        </label>
                        <textarea
                            id="artisanStory"
                            name="artisanStory"
                            rows={4}
                            defaultValue={product?.artisanStory || ''}
                            className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 focus:border-orange-600 outline-none text-gray-900 resize-none transition-all font-medium"
                            placeholder="Tell the heritage story..."
                        />
                    </div>

                    <div>
                        <label htmlFor="fabric" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Fabric / Material
                        </label>
                        <input id="fabric" name="fabric" type="text" defaultValue={product?.fabric || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" placeholder="e.g. Silk" />
                    </div>

                    <div>
                        <label htmlFor="weave" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Weave Type
                        </label>
                        <input id="weave" name="weave" type="text" defaultValue={product?.weave || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" placeholder="e.g. Handloom" />
                    </div>

                    <div>
                        <label htmlFor="origin" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Origin
                        </label>
                        <input id="origin" name="origin" type="text" defaultValue={product?.origin || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" placeholder="e.g. Salem" />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="careInstructions" className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">
                            Care Instructions
                        </label>
                        <textarea id="careInstructions" name="careInstructions" rows={3} defaultValue={product?.careInstructions || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-medium" placeholder="Dry clean only" />
                    </div>
                </div>
            </div>

            {/* Complete The Look - Smart Upselling */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Complete The Look</h2>
                    <p className="text-sm text-gray-400 font-medium">Link complementary products (blouses, jewelry, accessories)</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
                    <div className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full border-2 border-white rounded-3xl pl-16 pr-6 py-5 focus:border-orange-600 outline-none text-gray-900 transition-all font-bold shadow-sm"
                                placeholder="Search products..."
                            />
                            {isSearching && (
                                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                                    <Loader2 className="w-5 h-5 animate-spin text-orange-600" />
                                </div>
                            )}
                        </div>

                        {searchResults.length > 0 && (
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden divide-y divide-gray-50 max-h-[400px] overflow-y-auto">
                                {searchResults.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => toggleComplementaryProduct(p)}
                                        className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden relative">
                                                {p.images?.[0] && <img src={p.images[0].url} className="object-cover w-full h-full" alt="" />}
                                            </div>
                                            <p className="text-xs font-black text-gray-900">{p.name}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${complementaryProductIds.includes(p.id) ? 'bg-green-500 border-green-500 text-white' : 'border-gray-100'}`}>
                                            <Check className="w-3 h-3" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked ({selectedComplementaryProducts.length})</label>
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-4 min-h-[150px] flex flex-wrap gap-3">
                            {selectedComplementaryProducts.map((p) => (
                                <div key={p.id} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                    <span className="text-[10px] font-bold text-gray-700">{p.name}</span>
                                    <button type="button" onClick={() => toggleComplementaryProduct(p)} className="text-red-400 hover:text-red-600">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Heritage Strategy & Quality Audit */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">Heritage & Quality</h2>
                </div>

                <div className="grid grid-cols-1 gap-8 p-8 bg-orange-50/20 rounded-[2.5rem] border border-orange-100">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Heritage Title</label>
                        <input type="text" value={heritageTitle} onChange={(e) => setHeritageTitle(e.target.value)} className="w-full border-2 border-white rounded-2xl px-5 py-4 outline-none font-bold" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                        {qualityAudit.map((audit, idx) => (
                            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 space-y-2">
                                <input type="text" value={audit.label} onChange={(e) => {
                                    const next = [...qualityAudit]; next[idx].label = e.target.value; setQualityAudit(next);
                                }} className="w-full text-[8px] font-black uppercase text-gray-400 outline-none" />
                                <input type="text" value={audit.val} onChange={(e) => {
                                    const next = [...qualityAudit]; next[idx].val = e.target.value; setQualityAudit(next);
                                }} className="w-full text-xs font-black italic text-gray-900 outline-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* SEO Metadata */}
            <div className="space-y-6">
                <div className="pb-4 border-b">
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight italic">SEO Metadata</h2>
                </div>
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Meta Title</label>
                        <input name="metaTitle" type="text" defaultValue={product?.metaTitle || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Meta Description</label>
                        <textarea name="metaDescription" rows={3} defaultValue={product?.metaDescription || ''} className="w-full border-2 border-gray-100 rounded-2xl px-5 py-4 outline-none font-medium" />
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-5 pt-10 border-t-2 border-gray-100">
                <Button type="button" variant="ghost" onClick={() => router.back()} className="px-8 h-14 font-black uppercase tracking-widest text-gray-400">Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-orange-600 hover:bg-black text-white px-12 h-16 rounded-[2rem] font-black uppercase tracking-widest shadow-2xl min-w-[240px]">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isEditing ? 'Update Product' : 'Create Product')}
                </Button>
            </div>
        </form>
    );
}
