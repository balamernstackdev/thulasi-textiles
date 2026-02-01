'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, Info, Check } from 'lucide-react';

interface SizeAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    category?: string;
}

export default function SizeAssistant({ isOpen, onClose, category }: SizeAssistantProps) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const sizeData = [
        { size: 'S', chest: '38"', length: '40"', shoulder: '17"' },
        { size: 'M', chest: '40"', length: '42"', shoulder: '18"' },
        { size: 'L', chest: '42"', length: '44"', shoulder: '19"' },
        { size: 'XL', chest: '44"', length: '45"', shoulder: '20"' },
        { size: 'XXL', chest: '46"', length: '46"', shoulder: '21"' },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="bg-gray-50 px-8 py-6 flex items-center justify-between border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-200">
                                    <Ruler className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Size Assistant</h2>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Finding your perfect heritage fit</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Measurement Guide */}
                            <div className="grid md:grid-cols-2 gap-8 items-center bg-orange-50/50 p-6 rounded-3xl border border-orange-100">
                                <div className="relative aspect-square bg-white rounded-2xl border border-orange-100 p-4 flex items-center justify-center">
                                    <img src="https://illustrations.popsy.co/amber/measuring-tape.svg" alt="How to measure" className="w-48 h-48 opacity-80" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-black text-gray-900 uppercase text-sm tracking-tight flex items-center gap-2">
                                        <Info className="w-4 h-4 text-orange-600" /> How to Measure
                                    </h3>
                                    <ul className="text-xs space-y-3 text-gray-600 font-bold">
                                        <li className="flex gap-2">
                                            <span className="text-orange-600">01.</span>
                                            Measure around the fullest part of your chest.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-orange-600">02.</span>
                                            Measurement should be taken while standing naturally.
                                        </li>
                                        <li className="flex gap-2">
                                            <span className="text-orange-600">03.</span>
                                            Keep the tape parallel to the floor.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Size Table */}
                            <div>
                                <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-4">International Conversion (Inches)</h3>
                                <div className="border border-gray-100 rounded-2xl overflow-hidden">
                                    <table className="w-full text-left text-xs font-bold">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-4 text-gray-400 uppercase tracking-widest">Size</th>
                                                <th className="p-4 text-gray-400 uppercase tracking-widest">Chest</th>
                                                <th className="p-4 text-gray-400 uppercase tracking-widest">Shoulder</th>
                                                <th className="p-4 text-gray-400 uppercase tracking-widest">Length</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {sizeData.map((row) => (
                                                <tr
                                                    key={row.size}
                                                    className={`hover:bg-orange-50/30 cursor-pointer transition-colors ${selectedSize === row.size ? 'bg-orange-50' : ''}`}
                                                    onClick={() => setSelectedSize(row.size)}
                                                >
                                                    <td className="p-4 font-black text-orange-600 text-sm">{row.size}</td>
                                                    <td className="p-4 text-gray-700">{row.chest}</td>
                                                    <td className="p-4 text-gray-700">{row.shoulder}</td>
                                                    <td className="p-4 text-gray-700">{row.length}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Footer Advice */}
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4" />
                                </div>
                                <p className="text-[11px] text-gray-500 font-bold leading-relaxed">
                                    <span className="text-gray-900">Pro Tip:</span> Our heritage kurtas feature a "Comfort Fit." If you prefer a tailored look, we recommend choosing one size smaller than your usual international brand size.
                                </p>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full bg-black text-white py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                            >
                                Got it, Thanks!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
