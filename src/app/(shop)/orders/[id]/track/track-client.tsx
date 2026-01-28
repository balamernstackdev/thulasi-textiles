'use client';

import { format } from 'date-fns';
import { Package, Truck, CheckCircle2, Clock, MapPin, Copy, ExternalLink, ChevronRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface OrderTrackingClientProps {
    order: any;
}

const statusMap = {
    PENDING: { step: 0, label: 'Order Placed', desc: 'We have received your heritage order' },
    PROCESSING: { step: 1, label: 'Processing', desc: 'Our artisans are preparing your masterpieces' },
    SHIPPED: { step: 2, label: 'Shipped', desc: 'Your package is on its way to you' },
    DELIVERED: { step: 3, label: 'Delivered', desc: 'Heritage has arrived at your doorstep' },
    CANCELLED: { step: -1, label: 'Cancelled', desc: 'This order has been cancelled' },
};

export default function OrderTrackingClient({ order }: OrderTrackingClientProps) {
    const currentStatus = order.status as keyof typeof statusMap;
    const config = statusMap[currentStatus];
    const currentStep = config.step;

    const steps = [
        { id: 0, label: 'Placed', icon: Clock },
        { id: 1, label: 'Preparing', icon: Package },
        { id: 2, label: 'Shipped', icon: Truck },
        { id: 3, label: 'Delivered', icon: CheckCircle2 },
    ];

    const copyTracking = () => {
        if (order.trackingNumber) {
            navigator.clipboard.writeText(order.trackingNumber);
            toast.success('Tracking number copied');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 md:py-20 px-4 sm:px-8 md:px-12 lg:px-20">
            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header Bag */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Link href="/orders" className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors">Orders</Link>
                            <ChevronRight className="w-3 h-3 text-gray-300" />
                            <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Tracking</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase leading-none italic">
                            Track <span className="text-orange-600">Masterpiece</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Order ID: #{order.id.slice(0, 12).toUpperCase()}</p>
                    </div>
                    {order.trackingNumber && (
                        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Tracking Number</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-gray-900">{order.trackingNumber}</span>
                                    <button onClick={copyTracking} className="text-gray-400 hover:text-orange-600 transition-colors">
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-gray-200/50 border border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full translate-x-32 -translate-y-32 blur-3xl opacity-50" />

                    <div className="relative space-y-16">
                        {/* Summary */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b border-gray-50">
                            <div className="flex items-center gap-6">
                                <div className={`w-20 h-20 rounded-[2.5rem] flex items-center justify-center shadow-xl ${currentStatus === 'CANCELLED' ? 'bg-rose-50 text-rose-600' : 'bg-orange-600 text-white shadow-orange-200'}`}>
                                    {currentStatus === 'CANCELLED' ? (
                                        <Package className="w-8 h-8" />
                                    ) : (
                                        (() => {
                                            const Icon = steps[Math.max(0, currentStep)].icon;
                                            return <Icon className="w-8 h-8" />;
                                        })()
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter leading-none mb-2">{config.label}</h2>
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wide">{config.desc}</p>
                                </div>
                            </div>
                            <div className="text-left md:text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                                <p className="text-xl font-black text-gray-900 italic">By {format(new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy')}</p>
                            </div>
                        </div>

                        {/* Visual Timeline */}
                        {currentStatus !== 'CANCELLED' && (
                            <div className="relative px-4">
                                <div className="absolute top-5 left-8 right-8 h-1 bg-gray-100 rounded-full">
                                    <div
                                        className="h-full bg-orange-600 transition-all duration-1000 ease-out rounded-full shadow-[0_0_15px_rgba(234,88,12,0.4)]"
                                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                                    />
                                </div>
                                <div className="relative flex justify-between">
                                    {steps.map((step) => {
                                        const isCompleted = currentStep >= step.id;
                                        const isCurrent = currentStep === step.id;
                                        const StepIcon = step.icon;
                                        return (
                                            <div key={step.id} className="flex flex-col items-center gap-4 group">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 z-10 ${isCompleted ? 'bg-orange-600 text-white shadow-lg shadow-orange-200 scale-110' : 'bg-white border-2 border-gray-100 text-gray-300'}`}>
                                                    <StepIcon className={`w-5 h-5 ${isCurrent ? 'animate-bounce' : ''}`} />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Shipping Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Delivery Vault</h3>
                        </div>
                        <div className="space-y-4">
                            <p className="text-sm font-black text-gray-900 uppercase tracking-tight">{order.address.name}</p>
                            <p className="text-xs font-bold text-gray-500 leading-relaxed uppercase tracking-wide">
                                {order.address.street}<br />
                                {order.address.city}, {order.address.state}<br />
                                {order.address.zip}, {order.address.country}
                            </p>
                            <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Thulasi Delivery
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Activity Log</h3>
                        </div>
                        <div className="space-y-6">
                            {[
                                { status: order.status, date: order.updatedAt, desc: config.desc },
                                { status: 'PENDING', date: order.createdAt, desc: 'Your masterpiece order was successfully placed in the vault' }
                            ].map((log, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2 h-2 rounded-full mt-1 ${i === 0 ? 'bg-orange-600' : 'bg-gray-200'}`} />
                                        {i === 0 && <div className="w-px flex-1 bg-gray-100 my-1" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{log.status}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{format(new Date(log.date), 'MMMM dd, HH:mm')}</p>
                                        <p className="text-xs font-medium text-gray-500">{log.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support Card */}
                <div className="bg-gray-900 text-white rounded-[3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/20 rounded-full translate-x-32 -translate-y-32 blur-3xl" />
                    <div className="space-y-4 relative z-10">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Need Assistance?</h3>
                        <p className="text-sm font-medium text-gray-400 max-w-sm">Our heritage consultants are available 24/7 to help you with your order journey.</p>
                    </div>
                    <Link
                        href="/support"
                        className="bg-orange-600 hover:bg-white hover:text-orange-600 text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-[0.2em] transition-all relative z-10 shadow-2xl shadow-orange-900/50"
                    >
                        Talk to an Expert
                    </Link>
                </div>
            </div>
        </div>
    );
}
