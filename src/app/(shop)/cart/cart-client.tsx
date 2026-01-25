'use client';

import { useState, useTransition } from 'react';
import { useCartStore } from '@/lib/store/cart';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { toggleWishlist } from '@/lib/actions/wishlist';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function CartClient({ session }: { session: any }) {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleRemove = (id: string, name: string) => {
        removeItem(id);
        toast.error(`${name} removed from cart`);
    };

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 2999 ? 0 : 99;
    const tax = totalPrice * 0.18; // 18% GST
    const finalTotal = totalPrice + shipping + tax;

    const handleCheckout = () => {
        if (!session) {
            router.push('/login?redirect=/checkout');
        } else {
            router.push('/checkout');
        }
    };

    const handleSaveForLater = async (itemId: string, productId: string, name: string) => {
        if (!session) {
            toast.error('Please login to save to wishlist');
            router.push('/login?redirect=/cart');
            return;
        }

        startTransition(async () => {
            const result = await toggleWishlist(productId);
            if (result.success) {
                // Remove from cart after saving to wishlist
                removeItem(itemId);
                toast.success(`${name} moved to wishlist!`, {
                    description: 'You can purchase it later from your profile.',
                    icon: <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                });
            } else {
                toast.error('Failed to save for later');
            }
        });
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="text-center space-y-8 max-w-md">
                    <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-16 h-16 text-gray-300" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Your Cart is Empty</h2>
                        <p className="text-gray-500 font-medium">Discover our curated collection of handcrafted textiles</p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        Start Shopping
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="max-w-[1700px] mx-auto px-4 lg:px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-1">Shopping Cart</h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{getTotalItems()} Items in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all">
                                <div className="flex gap-6">
                                    {/* Product Image */}
                                    <Link href={`/product/${item.productSlug}`} className="shrink-0">
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gray-100 rounded-2xl overflow-hidden relative group">
                                            <Image
                                                src={item.image}
                                                alt={item.productName}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                    </Link>

                                    {/* Product Details */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <Link href={`/product/${item.productSlug}`}>
                                                <h3 className="text-xl font-black text-gray-900 hover:text-orange-600 transition-colors tracking-tight">
                                                    {item.productName}
                                                </h3>
                                            </Link>
                                            <div className="flex gap-3 mt-2 text-sm font-bold text-gray-500">
                                                {item.size && <span>Size: {item.size}</span>}
                                                {item.color && <span>• Color: {item.color}</span>}
                                                {item.material && <span>• Material: {item.material}</span>}
                                            </div>
                                            <p className="text-xs text-gray-400 font-bold mt-1">SKU: {item.variantSku}</p>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity Controls */}
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-1 py-0.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="px-4 font-black text-gray-900 text-lg tabular-nums">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.stock}
                                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900 disabled:opacity-20 disabled:cursor-not-allowed"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                                {item.stock <= 5 && (
                                                    <span className="text-[10px] text-orange-600 font-black uppercase tracking-tighter">Only {item.stock} left!</span>
                                                )}
                                            </div>

                                            {/* Price & Actions */}
                                            <div className="flex items-center gap-2">
                                                <p className="text-2xl font-black text-gray-900 mr-2">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>

                                                <button
                                                    onClick={() => handleSaveForLater(item.id, item.productId, item.productName)}
                                                    className="p-2.5 hover:bg-rose-50 rounded-full transition-all group/heart"
                                                    title="Save for Later (Moves to Wishlist)"
                                                >
                                                    <Heart className={`w-5 h-5 transition-colors ${isPending ? 'opacity-50' : 'text-gray-300 group-hover/heart:text-rose-500'}`} />
                                                </button>

                                                <button
                                                    onClick={() => handleRemove(item.id, item.productName)}
                                                    className="p-2.5 hover:bg-gray-100 rounded-full transition-all group/trash"
                                                    title="Remove from Cart"
                                                >
                                                    <Trash2 className="w-5 h-5 text-gray-300 group-hover/trash:text-red-500 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl sticky top-24 space-y-6">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase italic">Order Summary</h2>

                            <div className="space-y-3 py-6 border-y border-gray-100">
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Tax (GST 18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-black text-gray-900">
                                <span>Total</span>
                                <span>₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                            </div>

                            {shipping > 0 && (
                                <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4">
                                    <p className="text-xs font-black text-orange-600 uppercase tracking-wide">
                                        Add ₹{(2999 - totalPrice).toLocaleString('en-IN')} more for FREE shipping!
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-black text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <Link
                                href="/"
                                className="block text-center text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                ← Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
