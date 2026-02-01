'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Check, ShoppingBag, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'sonner';

interface BundleWizardProps {
    mainProduct: any;
    complementaryProducts: any[];
}

export default function BundleWizard({ mainProduct, complementaryProducts }: BundleWizardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const [selectedIds, setSelectedIds] = useState<string[]>(complementaryProducts.map(p => p.complementary.id));

    const toggleSelection = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const selectedProducts = complementaryProducts
        .filter(p => selectedIds.includes(p.complementary.id))
        .map(p => p.complementary);

    const totalBundlePrice = selectedProducts.reduce((sum, p) => sum + Number(p.basePrice), Number(mainProduct.basePrice));

    const handleAddBundle = () => {
        // Add main product
        addItem({
            id: mainProduct.variants[0]?.id || mainProduct.id,
            productId: mainProduct.id,
            productName: mainProduct.name,
            productSlug: mainProduct.slug,
            variantSku: mainProduct.variants[0]?.sku || 'BASE',
            price: Number(mainProduct.basePrice),
            image: mainProduct.images[0]?.url || '/placeholder-product.png',
            stock: 10,
            quantity: 1,
        });

        // Add selected complementary products
        selectedProducts.forEach(product => {
            addItem({
                id: product.variants[0]?.id || product.id,
                productId: product.id,
                productName: product.name,
                productSlug: product.slug,
                variantSku: product.variants[0]?.sku || 'BASE',
                price: Number(product.basePrice),
                image: product.images[0]?.url || '/placeholder-product.png',
                stock: 10,
                quantity: 1,
            });
        });

        toast.success(`Bundle Added!`, {
            description: `Main piece + ${selectedProducts.length} complementary items added to cart.`
        });
    };

    return (
        <section className="bg-gray-900 rounded-[4rem] p-8 md:p-16 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full translate-x-32 -translate-y-32 blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full -translate-x-12 translate-y-12 blur-[80px]" />

            <div className="relative z-10 grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-900/50">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="text-orange-500 font-black uppercase tracking-[0.4em] text-xs">Complete The Look</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
                        Heritage <span className="text-orange-500">Bundle</span> Wizard
                    </h2>

                    <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-md">
                        Our stylists have curated these artisanal pieces to perfectly complement your selection. Save time and elevate your elegance in one click.
                    </p>

                    <div className="pt-8 border-t border-white/10 space-y-6">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Total Bundle Value</span>
                                <span className="text-3xl font-black text-white italic tracking-tighter">₹{totalBundlePrice.toLocaleString('en-IN')}</span>
                            </div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-tighter text-right">(Incl. 18% GST)</p>
                        </div>
                        <Button
                            onClick={handleAddBundle}
                            className="w-full bg-white hover:bg-orange-600 text-black hover:text-white py-10 rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-4 group"
                        >
                            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            Add Entire Set to Cart
                        </Button>
                    </div>
                </div>

                {/* Bundle Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Main Product Display */}
                    <div className="relative group perspective-1000">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden border-2 border-orange-600/50 shadow-2xl transition-all duration-700">
                            <Image
                                src={mainProduct.images[0]?.url || '/placeholder-product.png'}
                                alt={mainProduct.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <span className="bg-orange-600 text-white text-[8px] font-black px-2 py-1 rounded w-fit mb-2 uppercase tracking-widest">Main Piece</span>
                                <h4 className="text-white font-black uppercase italic tracking-tighter truncate">{mainProduct.name}</h4>
                            </div>
                            <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/30">
                                <Lock className="w-4 h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Complementary Products */}
                    {complementaryProducts.map((p: any) => {
                        const product = p.complementary;
                        const isSelected = selectedIds.includes(product.id);
                        return (
                            <div
                                key={product.id}
                                onClick={() => toggleSelection(product.id)}
                                className={`relative group cursor-pointer transition-all duration-500 scale-100 hover:scale-105 active:scale-95`}
                            >
                                <div className={`aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all duration-500 ${isSelected ? 'border-orange-600 shadow-2xl shadow-orange-900/40' : 'border-white/10 opacity-50 grayscale hover:opacity-100'}`}>
                                    <Image
                                        src={product.images[0]?.url || '/placeholder-product.png'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                        <div className="flex gap-1 mb-1">
                                            {product.origin && <span className="text-[7px] font-black uppercase text-teal-400 border border-teal-400/30 px-1 py-0.5 rounded italic whitespace-nowrap">{product.origin}</span>}
                                            {product.fabric && <span className="text-[7px] font-black uppercase text-purple-400 border border-purple-400/30 px-1 py-0.5 rounded italic whitespace-nowrap">{product.fabric}</span>}
                                        </div>
                                        <p className="text-orange-500 text-[10px] font-black mb-1">₹{Number(product.basePrice).toLocaleString()} <span className="text-[8px] text-gray-500 font-normal tracking-tighter">(Incl. GST)</span></p>
                                        <h4 className="text-white font-black uppercase italic tracking-tighter truncate">{product.name}</h4>
                                    </div>
                                    <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-orange-600 text-white shadow-lg' : 'bg-black/40 text-white/50 border border-white/20 backdrop-blur-md'}`}>
                                        {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Curated Heritage Bundles • Thulasi Exclusives</p>
                <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                </div>
            </div>
        </section>
    );
}
