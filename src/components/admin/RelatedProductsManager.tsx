'use client';

import { useState, useEffect } from 'react';
import { Search, X, Plus, Loader2, Package } from 'lucide-react';
import Image from 'next/image';
import { getAvailableRelatedProducts, updateRelatedProducts } from '@/lib/actions/product';
import { toast } from 'sonner';

interface RelatedProductsManagerProps {
    productId: string;
    initialRelatedProducts: any[];
}

export default function RelatedProductsManager({ productId, initialRelatedProducts }: RelatedProductsManagerProps) {
    const [relatedProducts, setRelatedProducts] = useState(initialRelatedProducts || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Debounced search
    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            const result = await getAvailableRelatedProducts(productId, searchQuery);
            if (result.success && result.data) {
                setSearchResults(result.data);
            }
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, productId]);

    const addRelatedProduct = (product: any) => {
        if (relatedProducts.find(p => p.id === product.id)) {
            toast.error('Product already added');
            return;
        }
        setRelatedProducts([...relatedProducts, product]);
        setSearchQuery('');
        setSearchResults([]);
        setHasChanges(true);
    };

    const removeRelatedProduct = (productId: string) => {
        setRelatedProducts(relatedProducts.filter(p => p.id !== productId));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        const relatedIds = relatedProducts.map(p => p.id);
        const result = await updateRelatedProducts(productId, relatedIds);

        if (result.success) {
            toast.success('Related products updated successfully');
            setHasChanges(false);
        } else {
            toast.error(result.error || 'Failed to update related products');
        }
        setIsSaving(false);
    };

    return (
        <div className="space-y-6">
            {/* Search Section */}
            <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                    Search Products to Add
                </label>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by product name..."
                        className="w-full h-14 bg-white rounded-xl border-2 border-gray-100 pl-12 pr-5 focus:border-orange-600 outline-none transition-all font-bold text-gray-900"
                    />
                    {isSearching && (
                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-600 animate-spin" />
                    )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                    <div className="bg-white border-2 border-gray-100 rounded-xl max-h-64 overflow-y-auto">
                        {searchResults.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => addRelatedProduct(product)}
                                className="w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                            >
                                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-xs font-black text-gray-900 line-clamp-1">{product.name}</p>
                                    <p className="text-[10px] font-bold text-gray-400">{product.category?.name}</p>
                                </div>
                                <Plus className="w-4 h-4 text-orange-600" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Current Related Products */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">
                        Related Products ({relatedProducts.length})
                    </label>
                    {hasChanges && (
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    )}
                </div>

                {relatedProducts.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-gray-300 text-[10px] font-black uppercase tracking-widest italic bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100">
                        No related products added
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {relatedProducts.map((product) => (
                            <div key={product.id} className="bg-white border-2 border-gray-100 rounded-xl p-3 space-y-2 group hover:border-orange-600 transition-all relative">
                                <button
                                    onClick={() => removeRelatedProduct(product.id)}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-rose-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.name}
                                            width={200}
                                            height={200}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Package className="w-8 h-8" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-900 line-clamp-2 leading-tight">{product.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 mt-1">₹{Number(product.basePrice).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
