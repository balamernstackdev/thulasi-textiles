'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard, ArrowLeft, Receipt, ShieldCheck, Award } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { format } from 'date-fns';

type OrderDetail = {
    id: string;
    status: string;
    paymentStatus: string;
    total: number;
    createdAt: Date;
    address: any;
    items: any[];
};

export default function OrderDetailClient({ order }: { order: OrderDetail }) {
    const searchParams = useSearchParams();
    const isSuccess = searchParams.get('success') === 'true';
    const clearCart = useCartStore(state => state.clearCart);
    const router = useRouter();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            setShowSuccessModal(true);
            clearCart();
        }
    }, [isSuccess, clearCart]);

    const handleCloseSuccess = () => {
        setShowSuccessModal(false);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, '', newUrl);
    };

    const statusConfig = {
        PENDING: { label: 'Order Placed', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
        PROCESSING: { label: 'Processing', color: 'bg-blue-100 text-blue-700', icon: Package },
        SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
        DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle },
        CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
    };

    const config = statusConfig[order.status as keyof typeof statusConfig];
    const StatusIcon = config.icon;

    const statusSteps = [
        { key: 'PENDING', label: 'Order Placed' },
        { key: 'PROCESSING', label: 'Processing' },
        { key: 'SHIPPED', label: 'Shipped' },
        { key: 'DELIVERED', label: 'Delivered' },
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-8 md:px-12 lg:px-20 bg-gray-50">
            {/* Success Modal Popup */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseSuccess} />
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-md w-full relative z-10 text-center shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">
                            Order Placed!
                        </h2>
                        <p className="text-gray-500 font-medium mb-8">
                            Your order has been successfully placed. We'll send you a confirmation email shortly.
                        </p>
                        <button
                            onClick={handleCloseSuccess}
                            className="bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs w-full hover:bg-orange-600 transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-6">
                        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 font-black uppercase text-[10px] tracking-widest transition-all group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to My Orders
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">
                                Order <span className="text-orange-600">#{order.id.slice(0, 8).toUpperCase()}</span>
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                Placed {format(new Date(order.createdAt), 'MMMM d, yyyy, h:mm a')}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {order.status !== 'CANCELLED' && (
                            <Link
                                href={`/orders/${order.id}/track`}
                                className="bg-orange-600 hover:bg-black text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-100 transition-all flex items-center gap-2"
                            >
                                <Truck className="w-4 h-4" />
                                Track Order
                            </Link>
                        )}
                        {order.status === 'DELIVERED' && (
                            <Link
                                href={`/orders/certificates/${order.id}`}
                                className="bg-emerald-600 hover:bg-black text-white px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all flex items-center gap-2"
                            >
                                <Award className="w-4 h-4" />
                                Claim Heritage Certificate
                            </Link>
                        )}
                        <span className={`px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] border ${order.status === 'PROCESSING' ? 'bg-orange-100 text-orange-700 border-orange-200' : config.color.replace('bg-', 'border-').replace('text-', 'bg-').split(' ')[0] + '/10'} ${order.status === 'PROCESSING' ? '' : config.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Status Stepper - Modernized */}
                {order.status !== 'CANCELLED' && (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 mb-12 border border-gray-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/20 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

                        <div className="relative flex items-center justify-between">
                            {statusSteps.map((step, idx) => {
                                const StepIcon = statusConfig[step.key as keyof typeof statusConfig].icon;
                                const isActive = idx <= currentStepIndex;
                                const isCompleted = idx < currentStepIndex;

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                                        {/* Connector Line */}
                                        {idx < statusSteps.length - 1 && (
                                            <div className="absolute top-7 md:top-8 left-1/2 w-full h-[4px] bg-gray-100 -z-10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-600 transition-all duration-1000 ease-out"
                                                    style={{ width: idx < currentStepIndex ? '100%' : '0%' }}
                                                />
                                            </div>
                                        )}

                                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-700 shadow-xl ${isActive
                                            ? 'bg-orange-600 text-white scale-110 shadow-orange-200'
                                            : 'bg-white border-2 border-gray-100 text-gray-200'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-7 h-7" /> : <StepIcon className="w-7 h-7" />}
                                        </div>
                                        <div className="mt-5 space-y-1 text-center">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] leading-tight block ${isActive ? 'text-gray-900 font-black' : 'text-gray-300 font-bold'
                                                }`}>
                                                {step.label}
                                            </span>
                                            {isActive && idx === currentStepIndex && (
                                                <span className="text-[8px] font-black text-orange-600 uppercase tracking-widest animate-pulse">Current Phase</span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Items */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-gray-200/40 border border-gray-50">
                            <div className="flex items-center gap-3 mb-10">
                                <Package className="w-6 h-6 text-orange-600" />
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight italic">Shipment Details</h2>
                            </div>

                            <div className="space-y-8">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-6 group">
                                        <div className="w-full sm:w-32 h-40 bg-gray-50 rounded-2xl overflow-hidden relative shrink-0 border border-gray-100 shadow-inner">
                                            {item.variant?.product?.images?.[0] && (
                                                <Image
                                                    src={item.variant.product.images[0].url}
                                                    alt={item.variant.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-orange-600 transition-colors uppercase italic leading-none">{item.variant?.product?.name}</h3>
                                                    <div className="flex flex-wrap gap-2 py-2">
                                                        {item.variant.size && (
                                                            <span className="bg-gray-50 text-[10px] font-black px-3 py-1 rounded-full text-gray-500 uppercase tracking-widest border border-gray-100">
                                                                Size: {item.variant.size}
                                                            </span>
                                                        )}
                                                        {item.variant.color && (
                                                            <span className="bg-gray-50 text-[10px] font-black px-3 py-1 rounded-full text-gray-500 uppercase tracking-widest border border-gray-100">
                                                                Color: {item.variant.color}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-left md:text-right shrink-0">
                                                    <p className="text-2xl font-black text-gray-900 leading-none">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">
                                                        {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar */}
                    <div className="lg:col-span-4 space-y-8 sticky top-24">
                        {/* Unified Summary Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-gray-200/40 border border-gray-50 space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50/50 rounded-full translate-x-12 -translate-y-12 blur-2xl" />

                            {/* Address Section */}
                            <div className="relative">
                                <div className="flex items-center gap-3 mb-4 text-orange-600">
                                    <MapPin className="w-5 h-5" />
                                    <h3 className="font-black uppercase tracking-widest text-[10px]">Shipping To</h3>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-gray-900 leading-none mb-2">{order.address.name}</p>
                                    <div className="text-sm text-gray-500 font-medium leading-relaxed">
                                        <p>{order.address.street}</p>
                                        <p>{order.address.city}, {order.address.state} {order.address.zip}</p>
                                        <p className="uppercase tracking-widest text-[9px] font-black mt-1 text-gray-400">{order.address.country}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="relative border-t border-gray-50 pt-10">
                                <div className="flex items-center gap-3 mb-6 text-blue-600">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-black uppercase tracking-widest text-[10px]">Payment Strategy</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-gray-50/80 p-4 rounded-3xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">METHOD</span>
                                        <span className="text-[11px] font-black text-gray-900 uppercase italic">Cash on Delivery</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-4 rounded-3xl border-2 border-orange-50 shadow-sm relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest leading-none relative z-10">STATUS</span>
                                        <span className={`text-[11px] font-black uppercase tracking-widest relative z-10 ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
                                            }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Total Breakdown */}
                            <div className="relative border-t border-gray-50 pt-10">
                                <div className="flex items-center gap-3 mb-6 text-gray-900">
                                    <Receipt className="w-5 h-5" />
                                    <h3 className="font-black uppercase tracking-widest text-[10px]">Price Details</h3>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-[11px] font-black text-gray-500 px-1 uppercase tracking-widest">
                                        <span>Order Subtotal</span>
                                        <span className="text-gray-900">₹{order.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-black text-gray-500 px-1 uppercase tracking-widest">
                                        <span>Logistics</span>
                                        <span className="text-green-600 font-black">FREE</span>
                                    </div>
                                    <div className="pt-6 mt-6 border-t-4 border-double border-gray-50">
                                        <div className="flex justify-between items-end px-1">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] block leading-none">GRAND TOTAL</span>
                                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">INCL. ALL TAXES</span>
                                            </div>
                                            <span className="text-4xl font-black text-gray-900 tracking-tighter leading-none italic">
                                                ₹{order.total.toLocaleString('en-IN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 pt-6 grayscale opacity-30">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Secure Thulasi Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
