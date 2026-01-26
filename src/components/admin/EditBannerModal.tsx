'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, X } from 'lucide-react';
import BannerForm from './BannerForm';

interface EditBannerModalProps {
    banner: any;
}

export default function EditBannerModal({ banner }: EditBannerModalProps) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                onClick={() => setOpen(false)}
            />

            {/* Modal Content - Reusing BannerForm which adapts to 'Edit' mode */}
            <div className="relative w-full max-w-5xl h-[90vh] bg-white rounded-[2.5rem] shadow-[#ea580c_0_0_50px_-20px] overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 flex flex-col">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 p-6 flex items-center justify-between shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                            <Pencil className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">Edit Promotion</h2>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Update assets & copy</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gray-50/30">
                    <BannerForm
                        initialData={banner}
                        onSuccess={() => {
                            setOpen(false);
                            // Router refresh handled by server action revalidatePath, 
                            // but we can force one if needed.
                        }}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="bg-gray-50 text-gray-300 hover:bg-orange-600 hover:text-white p-4 rounded-2xl transition-all active:scale-90 shadow-sm"
            >
                <Pencil className="w-5 h-5 transition-transform" />
            </button>

            {open && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
