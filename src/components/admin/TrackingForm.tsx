'use client';

import { useState } from 'react';
import { Truck, Save, Loader2 } from 'lucide-react';
import { updateOrderTracking } from '@/lib/actions/order';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface TrackingFormProps {
    orderId: string;
    initialCourier?: string | null;
    initialTracking?: string | null;
}

export default function TrackingForm({ orderId, initialCourier, initialTracking }: TrackingFormProps) {
    const [loading, setLoading] = useState(false);
    const [courier, setCourier] = useState(initialCourier || '');
    const [tracking, setTracking] = useState(initialTracking || '');

    async function handleSave() {
        if (!courier || !tracking) {
            toast.error('Please enter both courier name and tracking number');
            return;
        }

        setLoading(true);
        const result = await updateOrderTracking(orderId, courier, tracking);
        setLoading(false);

        if (result.success) {
            toast.success('Tracking details updated');
        } else {
            toast.error('Failed to update tracking');
        }
    }

    return (
        <div className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-500" /> Fulfillment
            </h3>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Courier Service</label>
                    <input
                        value={courier}
                        onChange={(e) => setCourier(e.target.value)}
                        placeholder="e.g. DHL, BlueDart"
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 transition-all placeholder:text-gray-300"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking Number</label>
                    <input
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="e.g. 1234567890"
                        className="w-full bg-gray-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-0 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 transition-all placeholder:text-gray-300"
                    />
                </div>

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest h-9"
                >
                    {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Update Tracking'}
                </Button>
            </div>
        </div>
    );
}
