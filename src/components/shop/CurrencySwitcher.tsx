'use client';

import { useCurrencyStore } from '@/lib/store/currency';
import { CURRENCIES, CurrencyCode } from '@/lib/currency';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function CurrencySwitcher() {
    const { currency, setCurrency, isHydrated } = useCurrencyStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (!isHydrated) return null; // Avoid mismatch

    const current = CURRENCIES[currency];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors text-xs font-bold text-gray-700 uppercase tracking-wide border border-transparent hover:border-gray-200"
            >
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>{current.code}</span>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 space-y-1">
                        <p className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">Select Currency</p>
                        {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                            <button
                                key={code}
                                onClick={() => {
                                    setCurrency(code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${currency === code ? 'bg-orange-50 text-orange-700' : 'hover:bg-gray-50 text-gray-700'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-white border border-gray-200 rounded-full flex items-center justify-center text-[10px] font-bold">
                                        {CURRENCIES[code].symbol}
                                    </span>
                                    <span>{CURRENCIES[code].name}</span>
                                </div>
                                {currency === code && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
