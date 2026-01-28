'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, Plus, MapPin, CreditCard, Package } from 'lucide-react';
import { createOrder } from '@/lib/actions/order';
import { createAddress } from '@/lib/actions/address';
import { validateCoupon } from '@/lib/actions/coupon';
import { Ticket, X, Loader2 } from 'lucide-react';

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

    // Redirect to cart if empty
    useEffect(() => {
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [items.length, router]);

    if (items.length === 0) {
        return null;
    }

    const handleAddAddress = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await createAddress(formData);

        if (result.success && result.data) {
            setSelectedAddressId(result.data.id);
            setShowAddressForm(false);
            router.refresh();
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert('Please select a delivery address');
            return;
        }

        setIsProcessing(true);

        try {
            if (paymentMethod === 'ONLINE') {
                const isLoaded = await loadRazorpayScript();
                if (!isLoaded) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setIsProcessing(false);
                    return;
                }

                // 1. Create Internal Order
                const formData = new FormData();
                formData.append('addressId', selectedAddressId);
                formData.append('cartItems', JSON.stringify(items));
                formData.append('total', finalTotal.toString());
                if (appliedCoupon) {
                    formData.append('couponId', appliedCoupon.id);
                    formData.append('discountAmount', appliedCoupon.discountAmount.toString());
                }

                const result = await createOrder(formData);
                if (!result.success || !result.data) {
                    throw new Error(result.error || 'Failed to create order');
                }

                const orderId = result.data.id;

                // 2. Create Razorpay Order
                const paymentRes = await fetch('/api/payment/create-order', {
                    method: 'POST',
                    body: JSON.stringify({ amount: finalTotal }),
                });
                const paymentData = await paymentRes.json();

                if (!paymentRes.ok) throw new Error(paymentData.error);

                // 3. Open Razorpay Modal
                const options = {
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount: paymentData.amount,
                    currency: paymentData.currency,
                    name: 'Thulasi Textiles',
                    description: 'Order Payment',
                    order_id: paymentData.id,
                    handler: async function (response: any) {
                        const verifyRes = await fetch('/api/payment/verify', {
                            method: 'POST',
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId: orderId
                            }),
                        });

                        const verifyData = await verifyRes.json();

                        if (verifyData.success) {
                            // Cart clear handled by destination page
                            router.push(`/orders/${orderId}?success=true`);
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessing(false);
                        }
                    },
                    prefill: {
                        name: addresses.find(a => a.id === selectedAddressId)?.name,
                        email: session.user?.email,
                    },
                    theme: {
                        color: '#ea580c',
                    },
                };

                const paymentObject = new (window as any).Razorpay(options);
                paymentObject.open();

            } else {
                // COD Flow
                const formData = new FormData();
                formData.append('addressId', selectedAddressId);
                formData.append('cartItems', JSON.stringify(items));
                formData.append('total', finalTotal.toString());
                if (appliedCoupon) {
                    formData.append('couponId', appliedCoupon.id);
                    formData.append('discountAmount', appliedCoupon.discountAmount.toString());
                }

                const result = await createOrder(formData);

                if (result.success && result.data) {
                    // Cart clear handled by destination page
                    router.push(`/orders/${result.data.id}?success=true`);
                } else {
                    alert(result.error || 'Failed to place order');
                }
                setIsProcessing(false);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order');
            setIsProcessing(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setIsValidatingCoupon(true);
        setCouponError(null);

        try {
            const res = await validateCoupon(couponCode, totalPrice);
            if (res.success) {
                setAppliedCoupon(res.data);
                setCouponCode('');
            } else {
                setCouponError(res.error || 'Invalid code');
            }
        } catch (error) {
            setCouponError('Error verifying code');
        } finally {
            setIsValidatingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setCouponError(null);
    };

    const steps = [
        { num: 1, title: 'Address', icon: MapPin },
        { num: 2, title: 'Payment', icon: CreditCard },
        { num: 3, title: 'Review', icon: Package },
    ];

    return (
        <div className="min-h-screen py-12 px-4 sm:px-8 md:px-12 lg:px-20 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-6 md:mb-8 text-center md:text-left">Checkout</h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between w-full max-w-4xl mx-auto mb-12">
                        {steps.map((s, idx) => (
                            <div key={s.num} className="flex items-center flex-1 last:flex-none relative">
                                <div className="flex flex-col items-center relative z-10">
                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-3xl flex items-center justify-center font-black transition-all duration-500 shadow-lg ${step >= s.num
                                        ? 'bg-orange-600 text-white shadow-orange-200 ring-4 ring-orange-50'
                                        : 'bg-white text-gray-300 border border-gray-100'
                                        }`}>
                                        {step > s.num ? <Check className="w-6 h-6 md:w-8 md:h-8" /> : <s.icon className="w-6 h-6 md:w-8 md:h-8" />}
                                    </div>
                                    <div className="absolute -bottom-8">
                                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors duration-500 whitespace-nowrap ${step >= s.num ? 'text-orange-600' : 'text-gray-300'}`}>
                                            {s.title}
                                        </span>
                                    </div>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 px-4">
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-orange-600 transition-all duration-700 ease-out"
                                                style={{ width: step > s.num ? '100%' : '0%' }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Step 1: Address Selection */}
                        {step === 1 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Delivery Address</h2>

                                <div className="space-y-4">
                                    {addresses.map((address) => (
                                        <label
                                            key={address.id}
                                            className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddressId === address.id
                                                ? 'border-orange-600 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={address.id}
                                                checked={selectedAddressId === address.id}
                                                onChange={() => setSelectedAddressId(address.id)}
                                                className="sr-only"
                                            />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-black text-lg text-gray-900">{address.name}</p>
                                                    <p className="text-gray-600 font-medium mt-2">
                                                        {address.street}, {address.city}, {address.state} {address.zip}
                                                    </p>
                                                    <p className="text-gray-500 font-medium">{address.country}</p>
                                                </div>
                                                {address.isDefault && (
                                                    <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase">
                                                        Default
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}

                                    {!showAddressForm && (
                                        <button
                                            onClick={() => setShowAddressForm(true)}
                                            className="w-full p-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-orange-600 hover:bg-orange-50 transition-all flex items-center justify-center gap-2 font-bold text-gray-600 hover:text-orange-600"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Add New Address
                                        </button>
                                    )}

                                    {showAddressForm && (
                                        <form onSubmit={handleAddAddress} className="p-6 border-2 border-orange-200 bg-orange-50 rounded-2xl space-y-4">
                                            <h3 className="font-black text-lg text-gray-900 mb-4">New Address</h3>
                                            <input name="name" placeholder="Full Name" required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                            <input name="street" placeholder="Street Address" required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input name="city" placeholder="City" required className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                                <input name="state" placeholder="State" required className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input name="zip" placeholder="ZIP Code" required className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                                <input name="country" placeholder="Country" required defaultValue="India" className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-600 outline-none font-bold" />
                                            </div>
                                            <label className="flex items-center gap-2">
                                                <input type="checkbox" name="isDefault" value="true" className="w-4 h-4 rounded accent-orange-600" />
                                                <span className="font-bold text-sm text-gray-700">Set as default address</span>
                                            </label>
                                            <div className="flex gap-3">
                                                <button type="submit" className="flex-1 bg-orange-600 text-white py-3 rounded-xl font-black hover:bg-orange-700 transition-colors">
                                                    Save Address
                                                </button>
                                                <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 border-2 border-gray-300 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!selectedAddressId}
                                    className="w-full mt-6 bg-black text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment
                                </button>
                            </div>
                        )}

                        {/* Step 2: Payment Method */}
                        {step === 2 && (
                            <div className="bg-white rounded-3xl p-8 shadow-xl">
                                <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Payment Method</h2>

                                <div className="space-y-4">
                                    <label className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={() => setPaymentMethod('COD')}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-lg text-gray-900">Cash on Delivery</p>
                                                <p className="text-sm text-gray-500 font-medium mt-1">Pay when you receive your order</p>
                                            </div>
                                            <Package className="w-6 h-6 text-gray-400" />
                                        </div>
                                    </label>

                                    <label className={`block p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'ONLINE' ? 'border-orange-600 bg-orange-50' : 'border-gray-200'
                                        }`}>
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="ONLINE"
                                            checked={paymentMethod === 'ONLINE'}
                                            onChange={() => setPaymentMethod('ONLINE')}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-lg text-gray-900">Online Payment</p>
                                                <p className="text-sm text-gray-500 font-medium mt-1">Pay securely with Razorpay</p>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-orange-600" />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-4 mt-6">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-black hover:bg-gray-900 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={() => setStep(3)}
                                        className="flex-1 bg-black text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                                    >
                                        Review Order
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Review & Place Order */}
                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-8 shadow-xl">
                                    <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Order Summary</h2>

                                    <div className="space-y-4">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                                                    <Image src={item.image} alt={item.productName} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-black text-gray-900">{item.productName}</h3>
                                                    <p className="text-sm text-gray-500 font-medium">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-black text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full sm:w-auto px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-black hover:bg-gray-900 hover:text-white transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="flex-1 bg-orange-600 text-white py-4 rounded-full font-black uppercase text-sm tracking-widest hover:bg-orange-700 transition-all shadow-xl disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Processing...' : 'Place Order'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 shadow-xl sticky top-24 space-y-6">
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Price Details</h2>

                            {/* Coupon Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <Ticket className="w-3 h-3" /> Promotional Code
                                </h3>
                                {!appliedCoupon ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Enter code"
                                                className="flex-1 bg-gray-50 text-gray-900 placeholder:text-gray-400 border-2 border-gray-200 focus:border-orange-600 focus:bg-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all uppercase"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={isValidatingCoupon || !couponCode}
                                                className="bg-black text-white px-4 py-2.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all disabled:opacity-50"
                                            >
                                                {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                                            </button>
                                        </div>
                                        {couponError && (
                                            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-tighter">
                                                {couponError}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-center justify-between group">
                                        <div>
                                            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Applied Code</p>
                                            <p className="text-sm font-black text-gray-900 tracking-tighter uppercase">{appliedCoupon.code}</p>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="p-2 hover:bg-white rounded-lg text-gray-400 hover:text-rose-600 transition-all"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 py-6 border-y border-gray-100">
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Price ({items.length} items)</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-orange-600 font-bold">
                                        <span>Discount ({appliedCoupon?.code})</span>
                                        <span>- ₹{discount.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Delivery</span>
                                    <span className={shipping === 0 ? 'text-green-600' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>GST (18%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-2xl font-black text-gray-900">
                                <span>Total Amount</span>
                                <span>₹{finalTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                                <p className="text-xs font-black text-green-700">
                                    {discount > 0
                                        ? `You are saving ₹${discount.toFixed(2)} with this coupon!`
                                        : `You could save more with a coupon code`
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
