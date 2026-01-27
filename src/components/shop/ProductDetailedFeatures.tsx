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
    CheckCircle2
} from 'lucide-react';
import Image from 'next/image';

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
        <section className="space-y-16 mt-16 mb-24">
            {/* The Thulasi Promise - Visual Banner */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gray-950 p-8 md:p-16 group">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-orange-600/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-orange-600/20 px-4 py-2 rounded-full border border-orange-600/30">
                            <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Quality Assurance</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[0.9]">
                            {heritageTitle.split(' ').map((word: string, i: number) => (
                                <span key={i} className={word.toLowerCase() === 'thulasi' ? 'text-orange-600' : ''}>
                                    {word}{' '}
                                    {i === 1 && <br />}
                                </span>
                            ))}
                        </h2>
                        <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg">
                            {heritageDesc}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-xs">Silk Mark</p>
                                    <p className="text-gray-500 text-[10px] font-bold">100% Certified</p>
                                </div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-white font-black uppercase text-xs">Handloom</p>
                                    <p className="text-gray-500 text-[10px] font-bold">Artisan Made</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden relative border border-white/5 group-hover:border-orange-600/30 transition-colors">
                            <Image
                                src="/auth_textile_bg.png"
                                alt="Heritage Detail"
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-950 to-transparent">
                                <p className="text-white font-black text-[10px] uppercase tracking-widest">Premium Weave</p>
                            </div>
                        </div>
                        <div className="aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden relative translate-y-8 border border-white/5 group-hover:border-orange-600/30 transition-colors">
                            <Image
                                src="/placeholder-product.png"
                                alt="Heritage Detail"
                                fill
                                className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2000ms]"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-950 to-transparent">
                                <p className="text-white font-black text-[10px] uppercase tracking-widest">Handcrafted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quality Audit Section - Market Differentiation */}
            <div className="bg-orange-600 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="lg:max-w-xl space-y-6">
                        <h3 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Our 5-Point <br /> <span className="text-black">Quality Audit</span>
                        </h3>
                        <p className="font-bold opacity-90 leading-relaxed text-sm">
                            Before any Thulasi textile reaches your doorstep, it undergoes a rigorous inspection process to ensure perfection in every stitch and weave.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 justify-center">
                        {auditData.map((audit: any, i: number) => (
                            <div key={i} className="bg-black/20 backdrop-blur-xl border border-white/20 p-4 rounded-2xl min-w-[120px] text-center">
                                <p className="text-[8px] font-black uppercase tracking-widest opacity-60 mb-1">{audit.label}</p>
                                <p className="text-lg font-black italic">{audit.val}</p>
                            </div>
                        ))}
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
            <div className="bg-gray-50 rounded-[2.5rem] p-8 md:p-12">
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
