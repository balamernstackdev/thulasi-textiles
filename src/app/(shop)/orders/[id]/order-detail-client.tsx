'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard, ArrowLeft, Receipt, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

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

    useEffect(() => {
        if (isSuccess) {
            clearCart();
        }
    }, [isSuccess, clearCart]);

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
        <div className="min-h-screen py-12 px-4 lg:px-8 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                {/* Success Message */}
                {isSuccess && (
                    <div className="mb-8 bg-green-50 border-2 border-green-200 rounded-3xl p-8 text-center">
                        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                        <h2 className="text-3xl font-black text-green-900 mb-2">Order Placed Successfully!</h2>
                        <p className="text-green-700 font-medium">Thank you for shopping with Thulasi Textiles</p>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-600 font-black uppercase text-[10px] tracking-widest transition-all group">
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                            Back to My Orders
                        </Link>
                        <div className="space-y-1">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                Order <span className="text-orange-600">#{order.id.slice(0, 8).toUpperCase()}</span>
                            </h1>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Clock className="w-3.5 h-3.5" />
                                Placed {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm border ${config.color.replace('bg-', 'border-').replace('text-', 'bg-').split(' ')[0] + '/10'} ${config.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Status Stepper - Modernized */}
                {order.status !== 'CANCELLED' && (
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 mb-12 border border-gray-50 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />

                        <div className="relative flex items-center justify-between">
                            {statusSteps.map((step, idx) => {
                                const StepIcon = statusConfig[step.key as keyof typeof statusConfig].icon;
                                const isActive = idx <= currentStepIndex;
                                const isCompleted = idx < currentStepIndex;

                                return (
                                    <div key={step.key} className="flex flex-col items-center flex-1 relative z-10">
                                        {/* Connector Line */}
                                        {idx < statusSteps.length - 1 && (
                                            <div className="absolute top-6 left-1/2 w-full h-[3px] bg-gray-100 -z-10">
                                                <div
                                                    className="h-full bg-orange-600 transition-all duration-1000 ease-out"
                                                    style={{ width: idx < currentStepIndex ? '100%' : '0%' }}
                                                />
                                            </div>
                                        )}

                                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${isActive
                                            ? 'bg-orange-600 text-white scale-110'
                                            : 'bg-white border-2 border-gray-100 text-gray-300'
                                            }`}>
                                            {isCompleted ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-6 h-6" />}
                                        </div>
                                        <span className={`text-[10px] md:text-xs font-black mt-4 uppercase tracking-widest text-center max-w-[80px] leading-tight ${isActive ? 'text-gray-900' : 'text-gray-300'
                                            }`}>
                                            {step.label}
                                        </span>
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
                                <div className="flex items-center gap-3 mb-4 text-blue-600">
                                    <CreditCard className="w-5 h-5" />
                                    <h3 className="font-black uppercase tracking-widest text-[10px]">Payment Info</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-2xl border border-gray-100">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Method</span>
                                        <span className="text-xs font-black text-gray-900 uppercase italic">Cash on Delivery</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Status</span>
                                        <span className={`text-xs font-black uppercase tracking-widest ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-orange-600'
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
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 px-1">
                                        <span>Order Subtotal</span>
                                        <span>₹{order.total.toLocaleString('en-IN')}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold text-gray-500 px-1">
                                        <span>Shipping</span>
                                        <span className="text-green-600 uppercase tracking-widest text-[10px] font-black">Free</span>
                                    </div>
                                    <div className="pt-4 mt-4 border-t-2 border-dashed border-gray-100">
                                        <div className="flex justify-between items-end px-1">
                                            <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Grand Total</span>
                                            <span className="text-3xl font-black text-gray-900 tracking-tighter leading-none italic">
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
