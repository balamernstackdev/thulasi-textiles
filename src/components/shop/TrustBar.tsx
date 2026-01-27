'use client';

import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

const benefits = [
    {
        icon: <Award className="w-6 h-6" />,
        title: "Authentic Handloom",
        description: "100% genuine artisan crafts"
    },
    {
        icon: <Truck className="w-6 h-6" />,
        title: "Free Shipping",
        description: "On all orders above ₹1999"
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: "Secure Payments",
        description: "Safe & encrypted transactions"
    },
    {
        icon: <RotateCcw className="w-6 h-6" />,
        title: "Easy Returns",
        description: "7-day hassle-free returns"
    }
];

export default function TrustBar() {
    return (
        <section className="w-full px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-12">
            <div className="max-w-[1700px] mx-auto">
                <div className="bg-black text-white py-10 md:py-16 px-8 md:px-16 lg:px-24 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden group/trust">
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-20 group-hover/trust:bg-orange-600/10 transition-colors duration-700" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl opacity-20" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 relative z-10">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-4 md:gap-6 group">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-600 group-hover:text-white group-hover:scale-110 transition-all duration-500 flex-shrink-0 shadow-lg">
                                    {benefit.icon}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-[11px] md:text-sm font-black uppercase tracking-widest italic truncate mb-1">{benefit.title}</h3>
                                    <p className="text-[9px] md:text-[11px] text-gray-400 font-bold uppercase tracking-tight opacity-80 group-hover:opacity-100 transition-opacity">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
