import { format } from 'date-fns';
import Image from 'next/image';

export default function PackingSlip({ order }: { order: any }) {
    if (!order) return null;

    return (
        <div className="bg-white p-8 mb-10 border-2 border-gray-100 rounded-3xl print:p-0 print:m-0 print:border-0 print:shadow-none break-after-page">
            {/* Header / Dispatch From */}
            <div className="flex justify-between items-start border-b-2 border-gray-900 pb-8 mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter">Thulasi Textiles</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black bg-orange-600 text-white px-2 py-0.5 rounded tracking-widest uppercase italic">Women's World</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heritage Handloom Collective</p>
                    </div>

                    {/* Return Address */}
                    <div className="mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
                        <p className="text-gray-900 font-black mb-1">Dispatch From:</p>
                        <p>4/7 V. O. C STREET, PASUMPON NAGAR,</p>
                        <p>PALAGANATHAM, Madurai - 625003</p>
                        <p>Phone: +91 97905 07173</p>
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-black uppercase italic border-b-2 border-gray-900 inline-block pb-1">Packing Slip</h2>
                    <p className="text-sm font-black text-gray-900 mt-4 italic">Order #{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                </div>
            </div>

            {/* Address Grid */}
            <div className="grid grid-cols-2 gap-12 mb-10">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        Ship To:
                    </h3>
                    <div className="font-bold text-gray-900">
                        <p className="text-xl font-black">{order.address.name}</p>
                        <div className="mt-2 space-y-1 text-sm">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} - {order.address.zip}</p>
                            <p>{order.address.country}</p>
                            <p className="pt-2 text-[10px] font-black uppercase text-gray-400">Contact: <span className="text-gray-900">{order.address.phone}</span></p>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Order Details:
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Customer</p>
                            <p className="text-sm font-bold text-gray-900">{order.user.name || order.user.email}</p>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Payment</p>
                                <span className={`inline-block px-2 py-0.5 rounded uppercase text-[10px] font-black ${order.paymentStatus === 'PAID' ? 'bg-teal-50 text-teal-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Investment</p>
                                <p className="text-xl font-black text-gray-900 italic">₹{Math.round(Number(order.total)).toLocaleString()}</p>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mt-0.5">(Incl. 18% GST)</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left mb-10 border-collapse">
                <thead>
                    <tr className="border-y-2 border-gray-900/10">
                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-16">Qty</th>
                        <th className="py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Masterpiece & Details</th>
                        <th className="py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">SKU / Origin</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {order.items.map((item: any, idx: number) => (
                        <tr key={idx} className="group">
                            <td className="py-6 font-black text-2xl align-top text-gray-900">
                                {item.quantity.toString().padStart(2, '0')}
                            </td>
                            <td className="py-6">
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-14 h-14 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 overflow-hidden relative">
                                        {item.variant.product.images?.[0] ? (
                                            <img src={item.variant.product.images[0].url} alt="" className="object-cover w-full h-full" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] font-black text-gray-300 uppercase">No Img</div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-black text-gray-900 uppercase italic text-sm">{item.variant.product.name}</div>

                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                                            {item.variant.product.fabric && (
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    <span className="text-gray-300 mr-1">Fabric:</span> {item.variant.product.fabric}
                                                </div>
                                            )}
                                            {item.variant.size && (
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    <span className="text-gray-300 mr-1">Size:</span> {item.variant.size}
                                                </div>
                                            )}
                                            {item.variant.color && (
                                                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                                                    <span className="text-gray-300 mr-1">Color:</span> {item.variant.color}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-6 text-right align-top">
                                <div className="font-mono text-[10px] font-bold text-gray-900 uppercase tracking-tighter">
                                    {item.variant.sku || `TH-${item.variantId.slice(-4).toUpperCase()}`}
                                </div>
                                {item.variant.product.origin && (
                                    <div className="text-[9px] font-black text-teal-600 uppercase tracking-widest mt-1">
                                        {item.variant.product.origin}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Footer / Notes */}
            <div className="border-t-2 border-dashed border-gray-200 pt-8 mt-auto">
                <div className="grid grid-cols-2 items-end">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 italic max-w-sm leading-relaxed">
                            Certified Heritage Handloom. This masterpiece was crafted with centuries of tradition.
                            Your purchase supports the authentic artisan community of India.
                        </p>
                        <div className="flex items-center gap-6 mt-6">
                            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded-2xl border border-gray-100 p-2">
                                <div className="w-8 h-8 border-2 border-gray-200 rotate-45" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Authorized Dispatch</p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">Thulasi Textiles Operations</p>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em]">www.thulasitextiles.com</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase">Support: +91 97905 07173</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
