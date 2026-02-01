'use client';

import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ShieldCheck, Award, Zap, Sparkles, MapPin, Calendar, CheckCircle2, QrCode } from 'lucide-react';
import Image from 'next/image';

interface CertificatePreviewDialogProps {
    product: any;
    children: React.ReactNode;
}

export default function CertificatePreviewDialog({ product, children }: CertificatePreviewDialogProps) {
    const today = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    const auditData = product.qualityAudit
        ? (typeof product.qualityAudit === 'string' ? JSON.parse(product.qualityAudit) : product.qualityAudit)
        : [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-none">
                <div className="relative aspect-[1/1.414] w-full max-w-[600px] mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border-[12px] border-double border-orange-900/20 p-8 md:p-12">
                    {/* Background Texture */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-orange-50 to-transparent opacity-50" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/auth_textile_bg.png")', backgroundSize: '200px' }} />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col items-center text-center border border-orange-900/10 p-4 md:p-8">
                        <div className="mb-6">
                            <Image src="/logo.png" alt="Thulasi Textiles" width={120} height={40} className="mx-auto grayscale opacity-80" onError={(e) => (e.currentTarget.src = "/placeholder-user.png")} />
                        </div>

                        <div className="space-y-2 mb-8">
                            <h1 className="text-3xl md:text-4xl font-serif text-orange-900 uppercase tracking-widest italic">Certificate of Authenticity</h1>
                            <div className="h-px w-24 bg-orange-900/30 mx-auto" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-900/50 pt-2">Digital Verification ID: {product.id.slice(-8).toUpperCase()}-TH-2026</p>
                        </div>

                        <div className="w-full space-y-8 flex-1">
                            <div className="space-y-4">
                                <p className="text-sm font-medium text-gray-600 italic leading-relaxed">
                                    This document certifies that the following textile is an authentic
                                    <span className="text-orange-900 font-black not-italic px-1 uppercase tracking-tight">{product.name}</span>
                                    handcrafted by master artisans under the Thulasi Heritage guild.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 pt-4 text-left">
                                <div>
                                    <p className="text-[9px] font-black text-orange-900/40 uppercase tracking-widest mb-1 leading-none">Weave Type</p>
                                    <p className="text-sm font-black text-gray-900 uppercase">{product.weave || 'Traditional Handloom'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-orange-900/40 uppercase tracking-widest mb-1 leading-none">Fabric Purity</p>
                                    <p className="text-sm font-black text-gray-900 uppercase">{product.fabric || 'Pure Heritage Silk'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-orange-900/40 uppercase tracking-widest mb-1 leading-none">Origin Cluster</p>
                                    <p className="text-sm font-black text-gray-900 uppercase">{product.origin || 'South India'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-orange-900/40 uppercase tracking-widest mb-1 leading-none">Artisan Guild</p>
                                    <p className="text-sm font-black text-gray-900 uppercase">{product.artisan?.name || 'Master Guild'}</p>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-orange-900/10">
                                <h4 className="text-[10px] font-black text-orange-900 uppercase tracking-widest mb-4">Quality Assurance Audit</h4>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {auditData.map((audit: any, i: number) => (
                                        <div key={i} className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-900/5">
                                            <CheckCircle2 className="w-3 h-3 text-orange-600" />
                                            <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter">{audit.label}: {audit.val}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 w-full flex items-end justify-between px-4">
                            <div className="text-left space-y-4">
                                <div>
                                    <Image src="/signature.png" alt="Signature" width={80} height={30} className="opacity-60 mix-blend-multiply" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    <div className="w-32 h-px bg-orange-900/30 mb-1" />
                                    <p className="text-[8px] font-black text-orange-900 uppercase tracking-widest">Master Loom Supervisor</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-orange-900/30" />
                                    <p className="text-[10px] font-bold text-gray-400">{today}</p>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-2">
                                <div className="p-2 bg-orange-900/5 rounded-xl border border-orange-900/10">
                                    <QrCode className="w-12 h-12 text-orange-900/40" />
                                </div>
                                <p className="text-[8px] font-black text-orange-900 uppercase tracking-widest opacity-30">Scan to Verify</p>
                            </div>
                        </div>

                        {/* Seal */}
                        <div className="absolute top-12 right-12 w-20 h-20 opacity-10 rotate-12 pointer-events-none">
                            <ShieldCheck className="w-full h-full text-orange-900" />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
