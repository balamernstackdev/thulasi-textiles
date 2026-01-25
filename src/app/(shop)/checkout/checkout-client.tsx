'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Check, Plus, MapPin, CreditCard, Package } from 'lucide-react';
import { createOrder } from '@/lib/actions/order';
import { createAddress } from '@/lib/actions/address';

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

    const totalPrice = getTotalPrice();
    const shipping = totalPrice > 2999 ? 0 : 99;
    const tax = totalPrice * 0.18;
    const finalTotal = totalPrice + shipping + tax;

    if (items.length === 0) {
        router.push('/cart');
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

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            alert('Please select a delivery address');
            return;
        }

        setIsProcessing(true);
        try {
            const formData = new FormData();
            formData.append('addressId', selectedAddressId);
            formData.append('cartItems', JSON.stringify(items));
            formData.append('total', finalTotal.toString());

            const result = await createOrder(formData);

            if (result.success && result.data) {
                clearCart();
                router.push(`/orders/${result.data.id}?success=true`);
            } else {
                alert(result.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Failed to place order');
        } finally {
            setIsProcessing(false);
        }
    };

    const steps = [
        { num: 1, title: 'Address', icon: MapPin },
        { num: 2, title: 'Payment', icon: CreditCard },
        { num: 3, title: 'Review', icon: Package },
    ];

    return (
        <div className="min-h-screen py-12 px-4 lg:px-8 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter uppercase italic mb-8">Checkout</h1>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center gap-4">
                        {steps.map((s, idx) => (
                            <div key={s.num} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step >= s.num ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {step > s.num ? <Check className="w-6 h-6" /> : <s.icon className="w-6 h-6" />}
                                    </div>
                                    <span className={`text-xs font-black mt-2 ${step >= s.num ? 'text-orange-600' : 'text-gray-400'}`}>
                                        {s.title}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`w-24 h-1 mx-4 ${step > s.num ? 'bg-orange-600' : 'bg-gray-200'}`} />
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

                                    <label className="block p-6 rounded-2xl border-2 border-gray-200 opacity-50 cursor-not-allowed">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-black text-lg text-gray-400">Online Payment</p>
                                                <p className="text-sm text-gray-400 font-medium mt-1">Coming soon - Razorpay integration</p>
                                            </div>
                                            <CreditCard className="w-6 h-6 text-gray-300" />
                                        </div>
                                    </label>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="px-8 py-4 border-2 border-gray-300 rounded-full font-black hover:bg-gray-50 transition-colors"
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

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="px-8 py-4 border-2 border-gray-300 rounded-full font-black hover:bg-gray-50 transition-colors"
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

                            <div className="space-y-3 py-6 border-y border-gray-100">
                                <div className="flex justify-between text-gray-600 font-bold">
                                    <span>Price ({items.length} items)</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
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
                                    You will save ₹{(totalPrice * 0.1).toFixed(2)} on this order
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
