'use client';

import { useState } from 'react';
import { Plus, Minus, Send, Loader2, Star } from 'lucide-react';
import { adjustUserPoints } from '@/lib/actions/loyalty';
import { toast } from 'sonner';

export default function PointsAdjuster({ userId, currentPoints }: { userId: string, currentPoints: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (amount === 0) {
            toast.error('Please enter a non-zero amount');
            return;
        }
        if (!reason) {
            toast.error('Please provide a reason');
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await adjustUserPoints(userId, amount, reason);
            if (res.success) {
                toast.success('Points adjusted successfully');
                setIsOpen(false);
                setAmount(0);
                setReason('');
            } else {
                toast.error(res.error || 'Failed to adjust points');
            }
        } catch (error) {
            toast.error('An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative">
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors text-[10px] font-black uppercase tracking-widest"
                >
                    <Star className="w-3.5 h-3.5" />
                    {currentPoints.toLocaleString()} Points
                </button>
            ) : (
                <div className="absolute right-0 top-0 z-50 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 w-64 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Adjust Points</h4>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 text-xs font-bold">Cancel</button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setAmount(prev => prev - 100)}
                                className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                                className="flex-1 h-10 border-2 border-gray-50 bg-gray-50/50 rounded-lg text-center font-black text-sm focus:outline-none focus:border-orange-500 transition-all"
                            />
                            <button
                                onClick={() => setAmount(prev => prev + 100)}
                                className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-green-50 hover:text-green-500 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <input
                            placeholder="Reason for adjustment..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full h-10 px-3 border-2 border-gray-50 bg-gray-50/50 rounded-lg text-xs font-bold focus:outline-none focus:border-orange-500 transition-all"
                        />

                        <button
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                            className="w-full h-10 rounded-lg bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            Commit Points
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
