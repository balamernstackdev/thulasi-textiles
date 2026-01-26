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
        <section className="bg-black text-white py-8 border-y border-white/10">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                                {benefit.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest italic">{benefit.title}</h3>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{benefit.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
