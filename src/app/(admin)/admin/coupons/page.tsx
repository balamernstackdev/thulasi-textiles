import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Search, Ticket } from 'lucide-react';
import { getCoupons } from '@/lib/actions/coupon';
import ToggleCouponStatus from '@/components/admin/ToggleCouponStatus';
import DeleteCouponButton from '@/components/admin/DeleteCouponButton';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
    const { data: coupons } = await getCoupons();

    return (
        <div className="space-y-6">
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

            <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                            <tr>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Code</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Discount</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Limits</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usage</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expiry</th>
                                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {coupons?.map((coupon: any) => (
                                <tr key={coupon.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                                                <Ticket className="w-5 h-5 text-orange-600" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors text-sm uppercase tracking-wider">{coupon.code}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Promo Code</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-lg font-black text-gray-900 italic">
                                                {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">
                                                {coupon.discountType === 'PERCENTAGE' ? 'Percentage Off' : 'Fixed Amount'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black text-gray-900">
                                                Min: ₹{Number(coupon.minOrderAmount).toLocaleString()}
                                            </span>
                                            {coupon.maxDiscount && (
                                                <span className="text-xs font-black text-gray-900">
                                                    Max: ₹{Number(coupon.maxDiscount).toLocaleString()}
                                                </span>
                                            )}
                                            {!coupon.maxDiscount && (
                                                <span className="text-[8px] text-gray-400 font-black uppercase">No Cap</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900">
                                                {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''}
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">
                                                {coupon.usageLimit ? 'Uses' : 'Redemptions'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900">
                                                {coupon.expiryDate ? format(new Date(coupon.expiryDate), 'MMM dd, yyyy') : 'Never'}
                                            </span>
                                            <span className="text-[8px] text-gray-400 font-black uppercase tracking-tighter">
                                                Expiry Date
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <ToggleCouponStatus id={coupon.id} isActive={coupon.isActive} />
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/coupons/${coupon.id}`}
                                                className="text-gray-300 hover:text-orange-500 p-3 hover:bg-orange-50 rounded-xl transition-all active:scale-90"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </Link>
                                            <DeleteCouponButton id={coupon.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!coupons || coupons.length === 0) && (
                                <tr>
                                    <td colSpan={7} className="p-24 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                                <Ticket className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="font-black text-gray-900 uppercase tracking-widest text-xs">No Active Campaigns</p>
                                            <p className="text-sm font-medium text-gray-400 mt-2">Start driving sales by creating your first promotional coupon code.</p>
                                            <Link href="/admin/coupons/new" className="mt-6 inline-block">
                                                <Button className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-orange-600 transition-all shadow-xl">
                                                    Create First Coupon
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
