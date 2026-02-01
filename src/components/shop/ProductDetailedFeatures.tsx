'use client';

import {
    Heart,
    Leaf,
    Zap,
    ShieldCheck,
    Truck,
    RotateCcw,
    Scissors,
    Sparkles,
    ChevronRight,
    MessageCircle,
    Globe,
    Lock,
    CheckCircle2,
    User
} from 'lucide-react';
import Image from 'next/image';
import CertificatePreviewDialog from './CertificatePreviewDialog';

const FEATURES = [
    {
        icon: Leaf,
        title: "100% Sustainable",
        desc: "Our textiles are made using eco-friendly processes and organic fibers."
    },
    {
        icon: Scissors,
        title: "Master Craftsmanship",
        desc: "Each piece is hand-selected and verified by master weavers."
    },
    {
        icon: Sparkles,
        title: "Handmade Heritage",
        desc: "Preserving traditional Indian weaving techniques for generations."
    },
    {
        icon: Globe,
        title: "Direct from Weaver",
        desc: "No middlemen. Direct procurement from artisanal clusters."
    }
];

const TRUST_ELEMENTS = [
    {
        icon: ShieldCheck,
        title: "Authentic Product",
        desc: "Verified Silk Mark / Handloom Mark quality assurance."
    },
    {
        icon: Lock,
        title: "Secure Payments",
        desc: "256-bit encrypted checkout with all major payment modes."
    },
    {
        icon: MessageCircle,
        title: "Expert Assistance",
        desc: "WhatsApp support for styling and order queries."
    }
];

export default function ProductDetailedFeatures({ product }: { product: any }) {
    // Parse dynamic quality audit from product or use defaults
    const auditData = product.qualityAudit
        ? (typeof product.qualityAudit === 'string' ? JSON.parse(product.qualityAudit) : product.qualityAudit)
        : [
            { label: "Fabric Purity", val: "100%" },
            { label: "Color Fastness", val: "Lab Tested" },
            { label: "Weave Density", val: "High" },
            { label: "Finishing", val: "Hand-rolled" },
            { label: "Eco-Grade", val: "A+" }
        ];

    const heritageTitle = product.heritageTitle || "The Thulasi Heritage Promise";
    const heritageDesc = product.artisanStory || "We don't just sell textiles; we deliver treasures. Every thread in our collection represents a commitment to ethical sourcing, premium quality, and the timeless artistry of Indian weavers.";

    return (
        <section className="space-y-8 md:space-y-16 mt-8 md:mt-16 mb-12 md:mb-24">
            {/* The Thulasi Promise - Visual Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-950 p-4 md:p-16 group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-600/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-orange-600/20 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-orange-600/30">
                            <Sparkles className="w-3 md:w-3.5 h-3 md:h-3.5 text-orange-500" />
                            <span className="text-[9px] md:text-[10px] font-black text-orange-500 uppercase tracking-widest">Quality Assurance</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {heritageTitle.split(' ').map((word: string, i: number) => (
                                <span key={i} className={word.toLowerCase() === 'thulasi' ? 'text-orange-600' : ''}>
                                    {word}{' '}
                                    {i === 1 && <br className="hidden md:block" />}
                                </span>
                            ))}
                        </h2>
                        <p className="text-gray-400 text-sm md:text-lg font-medium leading-relaxed max-w-lg">
                            {heritageDesc}
                        </p>
                        <div className="flex flex-wrap gap-3 md:gap-4 pt-4">
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-600 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-4 h-4 md:w-6 md:h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-[10px] md:text-xs">Silk Mark</p>
                                    <p className="text-gray-500 text-[9px] md:text-[10px] font-bold">100% Certified</p>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl border border-white/10 flex items-center gap-3 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <Zap className="w-4 h-4 md:w-6 md:h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-[10px] md:text-xs">Handloom</p>
                                    <p className="text-gray-500 text-[9px] md:text-[10px] font-bold">Artisan Made</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="aspect-[4/5] bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-orange-600/30 transition-colors">
                            <Image
                                src="/auth_textile_bg.png"
                                alt="Heritage Detail"
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-gray-950 to-transparent">
                                <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest">Premium Weave</p>
                            </div>
                        </div>
                        <div className="aspect-[4/5] bg-gray-900 rounded-xl md:rounded-2xl overflow-hidden relative translate-y-6 md:translate-y-8 border border-white/5 group-hover:border-orange-600/30 transition-colors">
                            <Image
                                src="/placeholder-product.png"
                                alt="Heritage Detail"
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 bg-gradient-to-t from-gray-950 to-transparent">
                                <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest">Handcrafted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Audit Section - Market Differentiation */}
            <div className="bg-gray-900 rounded-[2.5rem] p-4 md:p-16 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
                    <div className="lg:max-w-md space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Master Audit v2.1</span>
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.85]">
                            The <span className="text-orange-600">Premium</span> <br /> Heritage Audit
                        </h3>
                        <p className="font-bold text-gray-400 leading-relaxed text-sm md:text-base">
                            Every Thulasi textile undergoes a rigorous 5-point inspection. Trace your garment's journey from the artisan's loom to your wardrobe.
                        </p>
                        <div className="pt-4 flex flex-col items-center gap-4 justify-center lg:justify-start lg:flex-row lg:gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                                        <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                            <User className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-gray-500 text-center lg:text-left">
                                Verified by <span className="text-white">Master Weavers</span>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 w-full lg:w-auto">
                        {auditData.map((audit: any, i: number) => {
                            const icons: Record<string, any> = {
                                "Fabric Purity": Sparkles,
                                "Color Fastness": Leaf,
                                "Weave Density": Scissors,
                                "Finishing": Zap,
                                "Eco-Grade": Globe
                            };
                            const Icon = icons[audit.label] || ShieldCheck;

                            return (
                                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col items-center gap-2 md:gap-4 group/badge hover:bg-white/10 hover:border-orange-600/30 transition-all duration-500">
                                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-xl md:rounded-2xl flex items-center justify-center text-orange-600 group-hover/badge:scale-110 group-hover/badge:bg-orange-600 group-hover/badge:text-white transition-all">
                                        <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-widest text-gray-500 mb-0.5 md:mb-1">{audit.label}</p>
                                        <p className="text-sm md:text-xl font-black italic text-white">{audit.val}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Certificate Box */}
                        <CertificatePreviewDialog product={product}>
                            <div className="col-span-2 md:col-span-1 bg-orange-600 p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center text-center gap-2 md:gap-4 shadow-2xl shadow-orange-600/20 hover:scale-[1.02] transition-transform cursor-pointer">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-xl md:rounded-2xl flex items-center justify-center text-white">
                                    <Lock className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-black mb-0.5 md:mb-1">Authenticity</p>
                                    <p className="text-sm md:text-lg font-black italic text-white leading-tight">Digital Vault Certificate</p>
                                </div>
                            </div>
                        </CertificatePreviewDialog>
                    </div>
                </div>
            </div>

            {/* Marketplace Strategy: Features & Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {FEATURES.map((feature, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all mb-6">
                            <feature.icon className="w-6 h-6" />
                        </div>
                        <h4 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-3 leading-none">{feature.title}</h4>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            {feature.desc}
                        </p>
                    </div>
                ))}
            </div>

            {/* Marketplace Strategy: Trust & Guarantee Section */}
            <div className="bg-gray-50 rounded-[2.5rem] p-4 md:p-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-1/3 lg:border-r border-gray-200 lg:pr-12">
                        <h3 className="text-2xl font-black text-gray-900 uppercase italic tracking-tighter mb-4">Market Strategy Details</h3>
                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                            Every purchase at Thulasi Textiles is backed by our customer-first policy. We ensure that our premium collections meet the highest standards of luxury and durability.
                        </p>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Fast Delivery Globally</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <RotateCcw className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-black text-gray-700 uppercase tracking-widest">7 Days Easy Return</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {TRUST_ELEMENTS.map((trust, i) => (
                            <div key={i} className="space-y-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm">
                                    <trust.icon className="w-6 h-6" />
                                </div>
                                <h5 className="text-lg font-black text-gray-900 uppercase tracking-tight italic leading-none">{trust.title}</h5>
                                <p className="text-gray-500 text-xs font-medium leading-relaxed">
                                    {trust.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
