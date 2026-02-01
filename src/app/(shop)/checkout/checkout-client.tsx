'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, MapPin, CreditCard, Package, Ticket, X, Loader2, ChevronDown, Lock, ShieldCheck } from 'lucide-react';
import { createOrder } from '@/lib/actions/order';
import { createAddress } from '@/lib/actions/address';
import { validateCoupon } from '@/lib/actions/coupon';

type Address = {
    id: string;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
};

export default function CheckoutClient({ session, addresses }: { session: any; addresses: Address[] }) {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id || '');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [couponError, setCouponError] = useState<string | null>(null);

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 2999 ? 0 : 99;
    const tax = totalPrice * 0.18;
    const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
    const finalTotal = totalPrice + shipping + tax - discount;

    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items.length, router]);

    if (items.length === 0) return null;

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if ((window as any).Razorpay) return resolve(true);
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) return;
        setIsProcessing(true);

        try {
            const formData = new FormData();
            formData.append('addressId', selectedAddressId);
            formData.append('cartItems', JSON.stringify(items));
            formData.append('total', finalTotal.toString());
            if (appliedCoupon) {
                formData.append('couponId', appliedCoupon.id);
                formData.append('discountAmount', appliedCoupon.discountAmount.toString());
            }

            if (paymentMethod === 'ONLINE') {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) throw new Error('Payment gateway failed to load');

                const result = await createOrder(formData);
                if (!result.success || !result.data) throw new Error(result.error);

                const orderId = result.data.id;
                const paymentRes = await fetch('/api/payment/create-order', {
                    method: 'POST',
                    body: JSON.stringify({ amount: finalTotal }),
                });
                const paymentData = await paymentRes.json();

                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    name: 'Thulasi Textiles',
                    description: 'Order Payment',
                    order_id: paymentData.id,
                    handler: async (response: any) => {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            body: JSON.stringify({ ...response, orderId })
                        });
                        if ((await verifyRes.json()).success) {
                            router.push(`/orders/${orderId}?success=true`);
                        }
                    },
                    prefill: { name: addresses.find(a => a.id === selectedAddressId)?.name, email: session.user?.email },
                    theme: { color: '#ea580c' },
                };
                new (window as any).Razorpay(options).open();
            } else {
                const result = await createOrder(formData);
                if (result.success && result.data) router.push(`/orders/${result.data.id}?success=true`);
            }
        } catch (error: any) {
            alert(error.message || 'Payment failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsValidatingCoupon(true);
        try {
            const res = await validateCoupon(couponCode, totalPrice);
            if (res.success) { setAppliedCoupon(res.data); setCouponCode(''); }
            else setCouponError(res.error || 'Invalid code');
        } finally { setIsValidatingCoupon(false); }
    };

    return (
        <div className="min-h-screen py-12 px-4 sm:px-8 bg-gray-50/50">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8]">
                        Checkout
                    </h1>
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
                        <Lock className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Environment Secure</span>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Sections */}
                    <div className="lg:col-span-8 space-y-4">
                        {/* 1. Address Section */}
                        <div className={`bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ${step === 1 ? 'ring-4 ring-orange-100' : 'opacity-70 shadow-sm'}`}>
                            <button
                                onClick={() => setStep(1)}
                                className="w-full px-8 py-6 flex items-center justify-between text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${step >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase italic tracking-tighter">Delivery Destination</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Where should we send your heritage?</p>
                                    </div>
                                </div>
                                {step !== 1 && <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Change</span>}
                            </button>

                            <AnimatePresence>
                                {step === 1 && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
                                        <div className="p-8 space-y-6">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                {addresses.map((address) => (
                                                    <label key={address.id} className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative ${selectedAddressId === address.id ? 'border-orange-600 bg-orange-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                                                        <input type="radio" className="sr-only" name="address" checked={selectedAddressId === address.id} onChange={() => setSelectedAddressId(address.id)} />
                                                        <p className="font-black text-gray-900 mb-1">{address.name}</p>
                                                        <p className="text-xs text-gray-500 font-bold leading-relaxed">{address.street}, {address.city}, {address.state} {address.zip}</p>
                                                        {selectedAddressId === address.id && <Check className="absolute top-4 right-4 w-5 h-5 text-orange-600" />}
                                                    </label>
                                                ))}
                                                <button onClick={() => setShowAddressForm(true)} className="p-6 rounded-3xl border-2 border-dashed border-gray-200 hover:border-orange-600 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 group text-gray-400">
                                                    <Plus className="w-6 h-6 group-hover:text-orange-600" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-orange-600">Add New Address</span>
                                                </button>
                                            </div>
                                            <button onClick={() => setStep(2)} disabled={!selectedAddressId} className="w-full bg-black text-white h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-gray-200 hover:bg-orange-600 transition-all active:scale-95">
                                                Confirm & Continue
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 2. Payment Section */}
                        <div className={`bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ${step === 2 ? 'ring-4 ring-orange-100' : 'opacity-70 shadow-sm'}`}>
                            <button
                                onClick={() => step > 1 && setStep(2)}
                                disabled={step < 2}
                                className="w-full px-8 py-6 flex items-center justify-between text-left disabled:cursor-not-allowed"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${step >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 uppercase italic tracking-tighter">Payment Strategy</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Choose your preferred gateway</p>
                                    </div>
                                </div>
                            </button>

                            <AnimatePresence>
                                {step === 2 && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-t border-gray-50">
                                        <div className="p-8 space-y-6">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <button onClick={() => setPaymentMethod('ONLINE')} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === 'ONLINE' ? 'border-orange-600 bg-orange-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-orange-600"><CreditCard /></div>
                                                    <div>
                                                        <p className="font-black text-gray-900">Online Payment</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Razorpay Secure</p>
                                                    </div>
                                                </button>
                                                <button onClick={() => setPaymentMethod('COD')} className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 text-left ${paymentMethod === 'COD' ? 'border-orange-600 bg-orange-50/50' : 'border-gray-100 hover:border-gray-300'}`}>
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-600"><Package /></div>
                                                    <div>
                                                        <p className="font-black text-gray-900">Cash on Delivery</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Pay at your doorstep</p>
                                                    </div>
                                                </button>
                                            </div>
                                            <button onClick={() => setStep(3)} className="w-full bg-black text-white h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-600 transition-all">
                                                Finalize Review
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* 3. Review Section */}
                        <div className={`bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-500 ${step === 3 ? 'ring-4 ring-orange-100' : 'opacity-70 shadow-sm'}`}>
                            <div className="w-full px-8 py-6 flex items-center gap-4 border-b border-gray-50">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${step >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    {step > 3 ? <Check className="w-5 h-5" /> : '3'}
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-900 uppercase italic tracking-tighter">Artisan Review</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">A final look at your selections</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {step === 3 && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                        <div className="p-8 space-y-8">
                                            <div className="space-y-4">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl">
                                                        <div className="w-16 h-16 rounded-xl overflow-hidden relative border border-gray-100"><Image src={item.image} alt={item.productName} fill className="object-cover" /></div>
                                                        <div className="flex-1">
                                                            <p className="font-black text-gray-900 text-sm uppercase italic">{item.productName}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.quantity} × ₹{item.price.toLocaleString()}</p>
                                                        </div>
                                                        <p className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={handlePlaceOrder} disabled={isProcessing} className="w-full bg-orange-600 text-white h-20 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm shadow-2xl shadow-orange-200 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3">
                                                {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Authorize Purchase'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/50 border border-gray-50 sticky top-24">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-8">Summary</h3>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Heritage Value</span><span className="text-gray-900">₹{totalPrice.toLocaleString()}</span></div>
                                    {discount > 0 && <div className="flex justify-between text-xs font-bold text-orange-600 uppercase tracking-widest"><span>Ancestors Bonus</span><span>- ₹{discount.toLocaleString()}</span></div>}
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Logistics</span><span className={shipping === 0 ? 'text-green-600' : 'text-gray-900'}>{shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}</span></div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest"><span>GST Contribution</span><span className="text-gray-900">₹{tax.toLocaleString()}</span></div>
                                </div>

                                <div className="pt-6 border-t-2 border-dashed border-gray-100">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block leading-none">Investment</span>
                                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Final Value</span>
                                        </div>
                                        <span className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
