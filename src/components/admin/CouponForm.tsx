'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCoupon } from '@/lib/actions/coupon';
import { Button } from '@/components/ui/button';
import { Loader2, Ticket, Percent, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { CouponType } from '@prisma/client';

export default function CouponForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'PERCENTAGE' as CouponType,
        discountValue: '',
        minOrderAmount: '',
        maxDiscount: '',
        usageLimit: '',
        expiryDate: '',
        isActive: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await createCoupon({
                code: formData.code,
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                minOrderAmount: formData.minOrderAmount ? Number(formData.minOrderAmount) : 0,
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
                expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
                isActive: formData.isActive
            });

            if (res.success) {
                router.push('/admin/coupons');
                router.refresh();
            } else {
                setError(res.error || 'Failed to create coupon');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            {error && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-600 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <span className="w-2 h-2 bg-rose-600 rounded-full animate-pulse" />
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info Section */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Ticket className="w-3 h-3 text-orange-600" /> Coupon Code
                        </label>
                        <input
                            required
                            placeholder="e.g. WELCOME10"
                            className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all uppercase placeholder:text-gray-400 text-gray-900"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <TrendingUp className="w-3 h-3 text-blue-500" /> Type
                            </label>
                            <select
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold appearance-none transition-all text-gray-900"
                                value={formData.discountType}
                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as CouponType })}
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount (₹)</option>
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                {formData.discountType === 'PERCENTAGE' ? <Percent className="w-3 h-3 text-teal-500" /> : <DollarSign className="w-3 h-3 text-teal-500" />}
                                Value
                            </label>
                            <input
                                required
                                type="number"
                                placeholder={formData.discountType === 'PERCENTAGE' ? "10" : "500"}
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all placeholder:text-gray-400 text-gray-900"
                                value={formData.discountValue}
                                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                            />
                        </div>
                    </div>
                </div>

                {/* Limits & Expiry Section */}
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Min Order (₹)</label>
                            <input
                                type="number"
                                placeholder="0"
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all placeholder:text-gray-400 text-gray-900"
                                value={formData.minOrderAmount}
                                onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Max Discount (₹)</label>
                            <input
                                type="number"
                                placeholder="No limit"
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all placeholder:text-gray-400 text-gray-900"
                                value={formData.maxDiscount}
                                onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                                disabled={formData.discountType === 'FIXED'}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usage Limit</label>
                            <input
                                type="number"
                                placeholder="Total uses"
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all placeholder:text-gray-400 text-gray-900"
                                value={formData.usageLimit}
                                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Calendar className="w-3 h-3 text-rose-500" /> Expiry Date
                            </label>
                            <input
                                type="date"
                                className="w-full h-14 bg-gray-50 border-2 border-transparent focus:border-orange-600 focus:bg-white rounded-2xl px-6 text-sm font-bold transition-all text-gray-900"
                                value={formData.expiryDate}
                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black text-white hover:bg-orange-600 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-gray-200 hover:shadow-orange-500/20 transition-all active:scale-95"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Activate Campaign'}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-2 border-gray-100 hover:bg-gray-50 transition-all"
                >
                    Discard Changes
                </Button>
            </div>
        </form>
    );
}
