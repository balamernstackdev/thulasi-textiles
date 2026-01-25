'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, Truck, CheckCircle, XCircle, MapPin, CreditCard, ArrowLeft } from 'lucide-react';

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

                {/* Header */}
                <div className="mb-8">
                    <Link href="/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold mb-4 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic mb-2">
                                Order #{order.id.slice(0, 8).toUpperCase()}
                            </h1>
                            <p className="text-gray-500 font-medium">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-sm font-black uppercase flex items-center gap-2 ${config.color}`}>
                            <StatusIcon className="w-4 h-4" />
                            {config.label}
                        </span>
                    </div>
                </div>

                {/* Order Timeline */}
                {order.status !== 'CANCELLED' && (
                    <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                        <h2 className="text-xl font-black text-gray-900 mb-6">Order Status</h2>
                        <div className="flex items-center justify-between">
                            {statusSteps.map((step, idx) => (
                                <div key={step.key} className="flex flex-col items-center flex-1 relative">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${idx <= currentStepIndex ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {idx < currentStepIndex ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                                    </div>
                                    <span className={`text-xs font-bold mt-2 text-center ${idx <= currentStepIndex ? 'text-orange-600' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                    {idx < statusSteps.length - 1 && (
                                        <div className={`absolute top-5 left-1/2 w-full h-1 ${idx < currentStepIndex ? 'bg-orange-600' : 'bg-gray-200'
                                            }`} style={{ zIndex: -1 }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-3xl p-8 shadow-lg">
                            <h2 className="text-xl font-black text-gray-900 mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                                            {item.variant?.product?.images?.[0] && (
                                                <Image
                                                    src={item.variant.product.images[0].url}
                                                    alt={item.variant.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">{item.variant?.product?.name}</h3>
                                            <div className="flex gap-3 mt-1 text-sm font-medium text-gray-500">
                                                {item.variant.size && <span>Size: {item.variant.size}</span>}
                                                {item.variant.color && <span>• {item.variant.color}</span>}
                                            </div>
                                            <p className="text-sm text-gray-400 font-medium mt-1">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-lg text-gray-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                            <p className="text-sm text-gray-500 font-medium">₹{item.price.toLocaleString('en-IN')} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <MapPin className="w-5 h-5 text-orange-600" />
                                <h3 className="font-black text-gray-900">Delivery Address</h3>
                            </div>
                            <div className="text-sm space-y-1">
                                <p className="font-black text-gray-900">{order.address.name}</p>
                                <p className="text-gray-600 font-medium">{order.address.street}</p>
                                <p className="text-gray-600 font-medium">
                                    {order.address.city}, {order.address.state} {order.address.zip}
                                </p>
                                <p className="text-gray-600 font-medium">{order.address.country}</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard className="w-5 h-5 text-orange-600" />
                                <h3 className="font-black text-gray-900">Payment</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Method</span>
                                    <span className="font-black text-gray-900">Cash on Delivery</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-medium">Status</span>
                                    <span className={`font-black ${order.paymentStatus === 'PAID' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-white rounded-3xl p-6 shadow-lg">
                            <h3 className="font-black text-gray-900 mb-4">Price Details</h3>
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex justify-between text-sm font-bold text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{order.total.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-black text-lg text-gray-900 mt-4">
                                <span>Total</span>
                                <span>₹{order.total.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
