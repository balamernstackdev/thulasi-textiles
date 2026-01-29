'use client';

import { format } from 'date-fns';

export default function PackingSlip({ order }: { order: any }) {
    if (!order) return null;

    return (
        <div className="bg-white p-8 mb-10 border-2 border-gray-100 rounded-3xl print:p-0 print:m-0 print:border-0 print:shadow-none break-after-page">
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Thulasi Textiles</h1>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Heritage Handloom Collective</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-black uppercase italic">Packing Slip</h2>
                    <p className="text-sm font-bold text-gray-900 mt-2">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ship To:</h3>
                    <div className="font-bold text-gray-900">
                        <p className="text-lg">{order.address.name}</p>
                        <p className="mt-1">{order.address.street}</p>
                        <p>{order.address.city}, {order.address.state}</p>
                        <p>{order.address.zip}, {order.address.country}</p>
                        <p className="mt-2 text-sm">Phone: {order.address.phone}</p>
                    </div>
                </div>
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Order Details:</h3>
                    <div className="space-y-2">
                        <p className="text-sm font-bold">Customer: <span className="text-gray-500">{order.user.name || order.user.email}</span></p>
                        <p className="text-sm font-bold">Payment: <span className="bg-gray-100 px-2 py-0.5 rounded uppercase text-[10px]">{order.paymentStatus}</span></p>
                        <p className="text-sm font-bold">Total: <span className="text-gray-900">₹{order.total.toLocaleString()}</span></p>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-10 border-collapse">
                <thead className="border-y border-gray-100">
                    <tr>
                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Qty</th>
                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Item & Description</th>
                        <th className="py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {order.items.map((item: any, idx: number) => (
                        <tr key={idx}>
                            <td className="py-4 font-black text-lg align-top">{item.quantity}</td>
                            <td className="py-4">
                                <div className="font-bold text-gray-900 capitalize">{item.variant.product.name}</div>
                                {item.variant.color && <div className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">Color: {item.variant.color}</div>}
                            </td>
                            <td className="py-4 text-right align-top font-mono text-[10px] font-bold text-gray-500 uppercase">
                                {item.variant.sku || `TH-${item.variantId.slice(-4).toUpperCase()}`}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer / Notes */}
            <div className="border-t border-gray-100 pt-8 mt-auto">
                <p className="text-[10px] font-bold text-gray-400 italic">
                    Thank you for supporting handloom artisans. Your purchase helps preserve a centuries-old heritage.
                </p>
                <div className="flex justify-between items-end mt-6">
                    <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-xl border border-gray-100">
                        {/* Placeholder for QR code or Company Logo */}
                        <div className="w-8 h-8 border-2 border-gray-200 rotate-45" />
                    </div>
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">www.thulasitextiles.com</p>
                </div>
            </div>
        </div>
    );
}
