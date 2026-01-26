import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, Ticket, Calendar, BarChart3, Trash2 } from 'lucide-react';
import { getCoupons } from '@/lib/actions/coupon';
import ToggleCouponStatus from '@/components/admin/ToggleCouponStatus';
import DeleteCouponButton from '@/components/admin/DeleteCouponButton';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
    const { data: coupons } = await getCoupons();

    return (
        <div className="space-y-8 p-4 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Coupons & Discounts</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Manage promotional codes and offers</p>
                </div>
                <Link href="/admin/coupons/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto bg-orange-600 text-white hover:bg-orange-700 font-black text-[10px] uppercase tracking-widest px-8 py-6 sm:py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95">
                        <Plus className="w-4 h-4 mr-2" /> Create Coupon
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coupons?.map((coupon: any) => (
                    <div key={coupon.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                        <div className="p-6 space-y-6">
                            {/* Header: Code and Status */}
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4 text-orange-600" />
                                        <span className="text-lg font-black text-gray-900 tracking-tighter uppercase">{coupon.code}</span>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${coupon.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                        {coupon.isActive ? 'Active' : 'Draft'}
                                    </span>
                                </div>
                                <ToggleCouponStatus id={coupon.id} isActive={coupon.isActive} />
                            </div>

                            {/* Value & Details */}
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-gray-900">
                                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                    </span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Off</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-2 leading-relaxed">
                                    Min Order: ₹{Number(coupon.minOrderAmount).toLocaleString()}
                                    {coupon.maxDiscount && ` • Max Discount: ₹${Number(coupon.maxDiscount).toLocaleString()}`}
                                </p>
                            </div>

                            {/* Usage & Expiry */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <BarChart3 className="w-3.3 h-3.3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Usage</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-900">
                                        {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'Redemptions'}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-gray-400">
                                        <Calendar className="w-3.3 h-3.3" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Expiry</span>
                                    </div>
                                    <p className="text-xs font-black text-gray-900">
                                        {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'MMM dd, yyyy') : 'No Expiry'}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-50 flex justify-end">
                                <DeleteCouponButton id={coupon.id} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!coupons || coupons.length === 0) && (
                <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                        <Ticket className="w-10 h-10 text-gray-200" />
                    </div>
                    <div className="max-w-xs mx-auto space-y-2">
                        <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-tighter">No Active Campaigns</h3>
                        <p className="text-sm font-medium text-gray-400">Start driving sales by creating your first promotional coupon code.</p>
                    </div>
                    <Link href="/admin/coupons/new" className="inline-block">
                        <Button className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl">
                            Create First Coupon
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
