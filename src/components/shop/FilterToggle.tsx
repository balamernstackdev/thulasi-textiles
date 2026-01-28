'use client';

import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import ProductFilters from './ProductFilters';

interface FilterToggleProps {
    categories?: any[];
    filterAttributes?: any;
}

export default function FilterToggle({ categories, filterAttributes }: FilterToggleProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-white text-gray-900 px-5 py-3 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-gray-100 active:scale-95 shadow-sm"
            >
                <Filter className="w-3.5 h-3.5 text-orange-600" />
                Filters
            </button>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="fixed inset-0 z-[200] lg:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 top-20 bg-white rounded-t-[3rem] shadow-2xl overflow-hidden flex flex-col p-6 animate-in slide-in-from-bottom duration-500">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                                    <Filter className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter italic">Refine Matrix</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <ProductFilters
                                categories={categories}
                                filterAttributes={filterAttributes}
                                isMobile={true}
                                onClose={() => setIsOpen(false)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
