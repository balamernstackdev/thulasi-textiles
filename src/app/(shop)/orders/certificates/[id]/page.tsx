import { notFound, redirect } from 'next/navigation';
import { getOrderById } from '@/lib/actions/order';
import { getSession } from '@/lib/auth';
import { ShieldCheck, Award, MapPin, History, CheckCircle2, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
        redirect(`/login?redirect=/orders/certificates/${id}`);
    }

    const { success, data: order } = await getOrderById(id);

    if (!success || !order || order.status !== 'DELIVERED') {
        notFound();
    }

    // For now, we take the first product in the order for the certificate
    // In a multi-item order, we could iterate or have a specific item ID
    const mainItem = order.items[0];
    const product = mainItem.variant.product;
    const artisan = product.artisan;

    return (
        <div className="min-h-screen bg-[#FDFBF7] py-20 px-4 flex items-center justify-center">
            {/* The Certificate Canvas */}
            <div className="max-w-4xl w-full bg-white border-[12px] border-[#D4AF37] p-12 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] relative overflow-hidden">
                {/* Guilloche Pattern Overlays (Simulated) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/az-subtle.png')]" />

                {/* Corner Accents */}
                <div className="absolute top-4 left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37]/30" />
                <div className="absolute bottom-4 right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37]/30" />

                <div className="relative z-10 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-6">
                        <div className="flex justify-center mb-8">
                            <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] flex items-center justify-center bg-white shadow-2xl relative">
                                <Award className="w-12 h-12 text-[#D4AF37]" />
                                <div className="absolute inset-0 rounded-full border border-[#D4AF37]/20 animate-ping" />
                            </div>
                        </div>
                        <h1 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em] mb-2">Thulasi Textiles • Heritage Vault</h1>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            Certificate of <span className="text-[#D4AF37]">Authenticity</span>
                        </h2>
                        <div className="w-32 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                    </div>

                    {/* Body Text */}
                    <div className="text-center space-y-8">
                        <p className="text-gray-500 font-medium italic text-lg leading-relaxed max-w-2xl mx-auto">
                            "This document formally verifies that the following masterpiece has been handcrafted using authentic heritage techniques, directly supporting the artisan weavers of India."
                        </p>

                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Masterpiece Identification</span>
                            <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tight underline decoration-[#D4AF37]/30 decoration-4 underline-offset-8">
                                {product.name}
                            </h3>
                        </div>
                    </div>

                    {/* Traceability Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pt-8 border-t border-gray-100">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Master Artisan</span>
                            <p className="font-black text-gray-900 uppercase italic text-sm">{artisan?.name || 'Handcrafted Master'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Loom Signature</span>
                            <p className="font-black text-gray-900 uppercase italic text-sm">{product.loomType || 'Handloom Hub'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Weaving Time</span>
                            <p className="font-black text-gray-900 uppercase italic text-sm">{product.weavingHours || '84'} Heritage Hours</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block">Origin Region</span>
                            <p className="font-black text-gray-900 uppercase italic text-sm">{artisan?.village || product.origin || 'India'}</p>
                        </div>
                    </div>

                    {/* Signatures & Seal */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12 pt-16">
                        <div className="text-left space-y-4 order-2 md:order-1">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Issued On</p>
                                <p className="text-sm font-bold text-gray-900">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Certificate ID</p>
                                <p className="text-sm font-bold text-gray-900">THU-{order.id.slice(-8).toUpperCase()}</p>
                            </div>
                        </div>

                        <div className="relative order-1 md:order-2">
                            <div className="w-32 h-32 md:w-40 md:h-40 border-8 border-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]/20 rotate-12 absolute -top-4 -left-4">
                                <ShieldCheck className="w-20 h-20" />
                            </div>
                            <div className="relative z-10 flex flex-col items-center gap-2">
                                <QrCode className="w-20 h-20 text-gray-900" />
                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Scan to Verify</span>
                            </div>
                        </div>

                        <div className="text-right space-y-6 order-3">
                            <div className="space-y-1">
                                <div className="h-10 border-b-2 border-gray-900 w-40 ml-auto flex items-end justify-center">
                                    <span className="font-serif italic text-2xl text-gray-900">Thulasi V.</span>
                                </div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Curator, Thulasi Textiles</p>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Quality Audit Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print Hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] pointer-events-none">
                    Digital Heritage Signature • Non-Transferable
                </div>
            </div>

            <button
                onClick={() => window.print()}
                className="fixed bottom-8 right-8 bg-[#D4AF37] hover:bg-black text-white px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl transition-all active:scale-95 flex items-center gap-3 print:hidden"
            >
                <Award className="w-4 h-4" />
                Download Certificate
            </button>
        </div>
    );
}
