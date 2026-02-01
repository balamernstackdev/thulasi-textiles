'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Clock, Truck, CheckCircle, XCircle, MapPin,
    CreditCard, ArrowLeft, Receipt, ShieldCheck, Award,
    Scissors, Heart, Sparkles, Box
} from 'lucide-react';
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
        PENDING: { label: 'Handloom Reserved', color: 'bg-yellow-100 text-yellow-700', icon: Clock, desc: 'Your artisan is preparing the loom' },
        PROCESSING: { label: 'Artisan Crafting', color: 'bg-orange-100 text-orange-700', icon: Scissors, desc: 'Final hand-touches and quality weaving' },
        SHIPPED: { label: 'In Transit', color: 'bg-blue-100 text-blue-700', icon: Truck, desc: 'Your heritage piece is on its way' },
        DELIVERED: { label: 'Legacy Delivered', color: 'bg-emerald-100 text-emerald-700', icon: Sparkles, desc: 'Enjoy your Thulasi masterpiece' },
        CANCELLED: { label: 'Release Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle, desc: 'This piece was returned to the archives' },
    };

    const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.PENDING;
    const StatusIcon = config.icon;

    const statusSteps = [
        { key: 'PENDING', label: 'Loom Selection', icon: Clock },
        { key: 'PROCESSING', label: 'Hand-Finish', icon: Scissors },
        { key: 'SHIPPED', label: 'Global Voyage', icon: Truck },
        { key: 'DELIVERED', label: 'Heritage Home', icon: Heart },
    ];

    const currentStepIndex = statusSteps.findIndex(s => s.key === order.status);

    return (
        <div className="min-h-screen py-12 px-4 sm:px-8 bg-gray-50/50 pt-32">
            <AnimatePresence>
                {showSuccessModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseSuccess} />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[3rem] p-12 max-w-md w-full relative z-10 text-center shadow-2xl">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                <CheckCircle className="w-12 h-12" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Masterpiece Secured</h2>
                            <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed uppercase tracking-widest">Your heritage selection is being prepared by our master weavers.</p>
                            <button onClick={handleCloseSuccess} className="w-full bg-black text-white h-16 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-colors">Start the Journey</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Modern Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-6">
                        <Link href="/orders" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-orange-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back to Archives
                        </Link>
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter uppercase italic leading-[0.8] mb-4">
                                Pursuit <span className="text-orange-600">#{order.id.slice(0, 6).toUpperCase()}</span>
                            </h1>
                            <div className="flex items-center gap-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                                <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> {order.paymentStatus}</span>
                            </div>
                        </div>
                    </div>
                    <div className={`px-8 py-4 rounded-[2rem] border-2 flex items-center gap-3 ${config.color.replace('bg-', 'border-').split(' ')[0]} ${config.color}`}>
                        <StatusIcon className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">{config.label}</span>
                    </div>
                </div>

                {/* The Heritage Journey */}
                <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-50 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                        {statusSteps.map((step, idx) => {
                            const StepIcon = step.icon;
                            const isActive = idx <= currentStepIndex;
                            const isCurrent = idx === currentStepIndex;

                            return (
                                <div key={step.key} className="flex flex-col items-center flex-1 relative z-10 w-full group">
                                    {idx < statusSteps.length - 1 && (
                                        <div className="absolute top-8 left-1/2 w-full h-1 bg-gray-50 md:block hidden">
                                            <div
                                                className="h-full bg-orange-600 transition-all duration-1000"
                                                style={{ width: idx < currentStepIndex ? '100%' : '0%' }}
                                            />
                                        </div>
                                    )}
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-xl ${isActive ? 'bg-orange-600 text-white shadow-orange-200 scale-110' : 'bg-gray-50 text-gray-300 border border-gray-100'
                                        }`}>
                                        <StepIcon className={`w-7 h-7 ${isCurrent ? 'animate-pulse' : ''}`} />
                                    </div>
                                    <div className="mt-6 text-center">
                                        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-gray-900' : 'text-gray-300'}`}>{step.label}</p>
                                        {isCurrent && <p className="text-[8px] font-bold text-orange-400 uppercase mt-1 tracking-widest">In Motion</p>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 items-start">
                    {/* Left: Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-10 flex items-center gap-3">
                                <Box className="w-6 h-6 text-orange-600" /> Curated Selection
                            </h2>
                            <div className="space-y-10">
                                {order.items.map((item: any) => (
                                    <div key={item.id} className="flex gap-8 group">
                                        <div className="w-24 h-32 md:w-32 md:h-44 bg-gray-50 rounded-3xl overflow-hidden relative shrink-0 border border-gray-100">
                                            {item.variant?.product?.images?.[0] && (
                                                <Image src={item.variant.product.images[0].url} alt={item.variant.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase italic group-hover:text-orange-600 transition-colors">{item.variant?.product?.name}</h3>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">{item.variant.size} • {item.quantity} Unit(s)</p>
                                            <div className="mt-6 flex items-center gap-4">
                                                <span className="text-2xl font-black text-gray-900 tracking-tighter italic">₹{(item.price * item.quantity).toLocaleString()}</span>
                                                <Award className="w-5 h-5 text-emerald-500 opacity-50" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-gray-100 space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Destination
                                </h3>
                                <p className="font-black text-gray-900 uppercase italic mb-2">{order.address.name}</p>
                                <p className="text-xs text-gray-500 font-bold leading-relaxed">{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</p>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-4 flex items-center gap-2">
                                    <Receipt className="w-3.5 h-3.5" /> Investment
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Subtotal</span><span className="text-gray-900">₹{order.total.toLocaleString()}</span></div>
                                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest"><span>Heritage Logistics</span><span className="text-emerald-600">COMPLIMENTARY</span></div>
                                    <div className="pt-6 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Total</span>
                                        <span className="text-4xl font-black text-gray-900 tracking-tighter italic">₹{order.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-6 flex items-center justify-center grayscale opacity-30 mt-10">
                                <ShieldCheck className="w-5 h-5 mr-3" />
                                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Thulasi Secure Heritage</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
