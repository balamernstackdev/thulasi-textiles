'use client';

import { useState } from 'react';
import { X, Ruler, Sparkles, Check, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoryName: string;
}

export default function SizeGuideModal({ isOpen, onClose, categoryName }: SizeGuideModalProps) {
    const [view, setView] = useState<'CHART' | 'ASSISTANT'>('CHART');

    // Fit Assistant State
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [recommendation, setRecommendation] = useState<string | null>(null);

    if (!isOpen) return null;

    const isSaree = categoryName.toLowerCase().includes('saree');

    const handleCalculate = () => {
        const h = parseInt(height);
        const w = parseInt(weight);
        if (!h || !w) return;

        // Simple logic for demonstration
        let size = 'M';
        if (w < 55) size = 'S';
        else if (w > 75) size = 'XL';
        else if (w > 65) size = 'L';

        setRecommendation(size);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

            <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <Ruler className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter italic">{isSaree ? 'Drape & Fabric Guide' : 'Size Matrix'}</h3>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{categoryName} Collection</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all active:scale-95">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* View Toggles */}
                    {!isSaree && (
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
                            <button
                                onClick={() => setView('CHART')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'CHART' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Size Chart
                            </button>
                            <button
                                onClick={() => setView('ASSISTANT')}
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'ASSISTANT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Fit Assistant
                            </button>
                        </div>
                    )}

                    {isSaree ? (
                        <div className="space-y-8">
                            <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100">
                                <h4 className="flex items-center gap-2 text-sm font-black text-orange-900 uppercase tracking-tighter mb-4">
                                    <Sparkles className="w-4 h-4" /> The Perfect Drape
                                </h4>
                                <p className="text-sm text-orange-800 leading-relaxed font-medium">
                                    Standard Saree length: 5.5 meters. Includes matching unstitched blouse piece (0.8 meters).
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { title: 'Tucking', desc: 'Ensure smooth tucking at the waist for a sleek fall.' },
                                    { title: 'Pleating', desc: 'Create 5-7 pleats for a traditional heritage look.' },
                                    { title: 'Pallu Fall', desc: 'Secure at shoulder for a graceful, semi-pinned fall.' },
                                    { title: 'Ironing', desc: 'Steam iron only for silk weaves to maintain luster.' },
                                ].map((tip, i) => (
                                    <div key={i} className="p-5 border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors">
                                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{tip.title}</h5>
                                        <p className="text-xs font-bold text-gray-700">{tip.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : view === 'CHART' ? (
                        <div className="space-y-8">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Size</th>
                                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Chest (in)</th>
                                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Waist (in)</th>
                                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Length (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-bold text-gray-900">
                                    {[
                                        { s: 'XS', c: '32', w: '26', l: '44' },
                                        { s: 'S', c: '34', w: '28', l: '44.5' },
                                        { s: 'M', c: '36', w: '30', l: '45' },
                                        { s: 'L', c: '38', w: '32', l: '45.5' },
                                        { s: 'XL', c: '40', w: '34', l: '46' },
                                        { s: 'XXL', c: '42', w: '36', l: '46' },
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-orange-600 font-black">{row.s}</td>
                                            <td className="py-4">{row.c}</td>
                                            <td className="py-4">{row.w}</td>
                                            <td className="py-4">{row.l}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-blue-700 leading-relaxed uppercase tracking-wide">
                                    Measured in inches (in). All products have a 1-inch heritage margin for customization.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="text-center space-y-2">
                                <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none italic uppercase">Don't guess, let us help.</h4>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recommended size based on statistics</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Height (cm)</label>
                                    <input
                                        type="number"
                                        placeholder="165"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Weight (kg)</label>
                                    <input
                                        type="number"
                                        placeholder="60"
                                        value={weight}
                                        onChange={(e) => setWeight(e.target.value)}
                                        className="w-full bg-gray-50 border-0 rounded-2xl p-4 text-sm font-black focus:ring-2 focus:ring-orange-500/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={handleCalculate}
                                className="w-full bg-black hover:bg-orange-600 text-white py-8 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-gray-200"
                            >
                                Calculate My Matrix Size
                            </Button>

                            {recommendation && (
                                <div className="bg-orange-600 text-white rounded-[2.5rem] p-8 text-center animate-in slide-in-from-bottom duration-500 shadow-2xl shadow-orange-200">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-3 opacity-80">Recommended Size</p>
                                    <h5 className="text-6xl font-black italic tracking-tighter leading-none mb-4">{recommendation}</h5>
                                    <p className="text-xs font-bold leading-relaxed opacity-90 italic">
                                        "Based on your stats, Size {recommendation} will provide the perfect heritage drape."
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heritage Cut • Artisanal Fit</p>
                    <button onClick={onClose} className="text-[10px] font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 group">
                        Done <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
