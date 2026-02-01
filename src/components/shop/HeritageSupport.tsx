'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeritageSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Disabled tooltip as per user request
        // const timer = setTimeout(() => setShowTooltip(true), 3000);
        // return () => clearTimeout(timer);
    }, []);

    const whatsappNumber = "+910000000000"; // Placeholder
    const message = "Namaste! I'm interested in learning more about your heritage weaves.";

    const openWhatsApp = () => {
        const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="fixed bottom-24 md:bottom-8 right-6 md:right-8 z-[100] flex flex-col items-end gap-3">
            <AnimatePresence>
                {showTooltip && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-white px-4 py-2 rounded-2xl shadow-2xl border border-orange-100 mb-2 relative"
                    >
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest whitespace-nowrap">
                            Heritage Assistant Online
                        </p>
                        <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white rotate-45 border-r border-b border-orange-100" />
                        <button
                            onClick={() => setShowTooltip(false)}
                            className="absolute -top-2 -left-2 bg-gray-900 text-white rounded-full p-0.5 hover:bg-black transition-colors"
                        >
                            <X className="w-2.5 h-2.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={openWhatsApp}
                className="w-16 h-16 bg-[#25D366] text-white rounded-[2rem] shadow-2xl shadow-green-200 flex items-center justify-center relative overflow-hidden group border-4 border-white"
            >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                <MessageCircle className="w-8 h-8 relative z-10" />

                {/* Visual pulse for awareness */}
                <div className="absolute inset-0 border-4 border-green-400 rounded-[2rem] animate-ping opacity-20 pointer-events-none" />
            </motion.button>
        </div>
    );
}
