'use client';

import { motion } from 'framer-motion';

const Shimmer = () => (
    <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
    />
);

const PulsingLogo = () => (
    <motion.div
        animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.95, 1.05, 0.95]
        }}
        transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut"
        }}
        className="font-serif italic text-4xl md:text-6xl text-gray-200 select-none pointer-events-none"
    >
        T
    </motion.div>
);

export function ProductSectionSkeleton() {
    return (
        <section className="py-8 md:py-12 bg-white overflow-hidden">
            <div className="max-w-[1700px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="space-y-4">
                        <div className="h-12 w-96 bg-gray-50 rounded-[2rem] relative overflow-hidden flex items-center px-6">
                            <Shimmer />
                            <div className="h-4 w-40 bg-gray-100 rounded-full" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[10/14] bg-gray-100 rounded-[2rem] relative overflow-hidden">
                                <Shimmer />
                            </div>
                            <div className="space-y-2 px-1">
                                <div className="h-3 w-3/4 bg-gray-50 rounded-full relative overflow-hidden">
                                    <Shimmer />
                                </div>
                                <div className="h-5 w-1/2 bg-gray-100 rounded-full relative overflow-hidden">
                                    <Shimmer />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function BannerSkeleton() {
    return (
        <div className="w-full h-[400px] md:h-[600px] bg-gray-100 relative overflow-hidden my-4 rounded-[3rem] mx-auto max-w-[1700px]">
            <Shimmer />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                <PulsingLogo />
                <div className="space-y-4 text-center">
                    <div className="h-12 w-80 md:w-[500px] bg-gray-200/40 rounded-[2rem] mx-auto" />
                    <div className="h-4 w-48 md:w-64 bg-gray-200/20 rounded-full mx-auto" />
                </div>
            </div>
        </div>
    );
}

export function HomeSkeleton() {
    return (
        <div className="flex flex-col gap-12 bg-gray-50/50 pb-20">
            <BannerSkeleton />
            <div className="translate-y-[-100px] relative z-20 space-y-12">
                <div className="max-w-[1700px] mx-auto px-6 grid grid-cols-4 md:grid-cols-8 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-square bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
                            <Shimmer />
                        </div>
                    ))}
                </div>
                <ProductSectionSkeleton />
                <ProductSectionSkeleton />
            </div>
        </div>
    );
}
