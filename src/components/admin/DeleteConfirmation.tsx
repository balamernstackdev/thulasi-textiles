'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react';

interface DeleteConfirmationProps {
    onConfirm: () => Promise<void>;
    title: string;
    description: string;
    trigger?: React.ReactNode;
}

export default function DeleteConfirmation({
    onConfirm,
    title,
    description,
    trigger
}: DeleteConfirmationProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
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

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            setOpen(false);
        } catch (error) {
            console.error('Delete failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const modalContent = (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity animate-in fade-in duration-300"
                onClick={() => !loading && setOpen(false)}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-[450px] bg-gray-950 rounded-[2.5rem] shadow-[0_0_50px_-12px_rgba(220,38,38,0.3)] overflow-hidden animate-in fade-in zoom-in duration-200 border border-white/5">
                {/* Close Button */}
                <button
                    onClick={() => !loading && setOpen(false)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-10"
                    disabled={loading}
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="bg-red-950/20 p-10 flex justify-center border-b border-white/5">
                    <div className="bg-red-600/10 p-6 rounded-full shadow-inner border border-red-500/20">
                        <AlertTriangle className="h-12 w-12 text-red-500" />
                    </div>
                </div>

                <div className="p-10 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-3xl font-black text-white uppercase tracking-tight italic leading-none">
                            {title}
                        </h3>
                        <p className="text-gray-400 font-bold leading-relaxed pt-2 text-sm">
                            {description}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-gray-500 hover:text-white border-2 border-transparent hover:bg-white/5 transition-all"
                            disabled={loading}
                        >
                            No, Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={loading}
                            className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_-10px_rgba(220,38,38,0.5)] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5" />
                                    <span>Yes, Delete</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Trigger */}
            <div onClick={() => setOpen(true)} className="cursor-pointer inline-block">
                {trigger || (
                    <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Modal Portal */}
            {open && mounted && createPortal(modalContent, document.body)}
        </>
    );
}
