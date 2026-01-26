import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CouponForm from '@/components/admin/CouponForm';

export const dynamic = 'force-dynamic';

export default function NewCouponPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Link href="/admin/coupons">
                    <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 shadow-sm transition-all active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-gray-900" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">New Campaign</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Configure your promotional discount code</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="relative z-10">
                    <CouponForm />
                </div>
            </div>
        </div>
    );
}
