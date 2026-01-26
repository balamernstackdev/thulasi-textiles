import { getAdminOrderById } from '@/lib/actions/order';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { Metadata } from 'next';
import PrintInvoiceButton from '@/components/admin/PrintInvoiceButton';

export const metadata: Metadata = {
    title: 'Invoice - Thulasi Textiles',
    description: 'Official Order Invoice',
};

export default async function OrderInvoicePage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const result = await getAdminOrderById(id);

    if (!result.success || !result.data) {
        notFound();
    }

    const order = result.data;

    // Ensure all data is properly serialized for rendering
    const invoiceData = {
        id: order.id,
        total: Number(order.total),
        createdAt: order.createdAt,
        user: order.user,
        address: order.address,
        items: order.items.map((item: any) => ({
            id: item.id,
            quantity: item.quantity,
            price: Number(item.price),
            variant: {
                sku: item.variant.sku,
                size: item.variant.size,
                color: item.variant.color,
                product: {
                    name: item.variant.product.name,
                }
            }
        }))
    };

    return (
        <div className="bg-white min-h-screen p-4 md:p-8 text-black print:p-0">
            <style dangerouslySetInnerHTML={{
                __html: `
                @page { 
                    margin: 1cm; 
                }
                @media print {
                    body { margin: 0; padding: 0; }
                    .no-print { display: none; }
                }
            `}} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Print Action Bar - Hidden during print */}
                <div className="no-print flex justify-end mb-8 pt-4">
                    <PrintInvoiceButton />
                </div>

                {/* Invoice Header */}
                <div className="flex justify-between items-end border-b-2 border-black pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 relative shrink-0">
                            <Image
                                src="/logo.png"
                                alt="Thulasi Textiles Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div>
                            <span className="text-xl font-black tracking-tighter uppercase italic block leading-none">
                                <span className="text-gray-400">Thulasi</span> <span className="text-orange-600">Textiles</span>
                            </span>
                            <span className="text-[9px] font-black text-orange-600 tracking-[0.2em] uppercase mt-1 block leading-none">Women's World</span>
                            <h1 className="text-2xl font-black uppercase italic tracking-tighter mt-2">Invoice</h1>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-xl uppercase italic tracking-tighter mb-0">#{invoiceData.id.slice(-8).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Date: {format(new Date(invoiceData.createdAt), 'MMM dd, yyyy')}
                        </p>
                    </div>
                </div>

                {/* Billing & Shipping */}
                <div className="grid grid-cols-2 gap-8 py-4">
                    <div>
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Billed To</h3>
                        <div className="space-y-0.5">
                            <p className="font-black text-base leading-tight">{invoiceData.user?.name || 'Guest Customer'}</p>
                            <p className="text-xs font-semibold text-gray-500">{invoiceData.user?.email}</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 text-right">Shipping Address</h3>
                        <div className="space-y-0.5 text-right text-sm font-medium">
                            <p className="font-bold text-gray-900">{invoiceData.address.name}</p>
                            <p className="text-gray-600 text-xs">{invoiceData.address.street}</p>
                            <p className="text-gray-600 text-xs">{invoiceData.address.city}, {invoiceData.address.state} {invoiceData.address.zip}</p>
                        </div>
                    </div>
                </div>

                {/* Items Table */}
                <div className="pt-4">
                    <table className="w-full text-left border-collapse border-t border-black">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="py-3 text-[9px] font-black uppercase tracking-widest text-gray-400">Description</th>
                                <th className="py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 text-center">Qty</th>
                                <th className="py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Unit Price</th>
                                <th className="py-3 text-[9px] font-black uppercase tracking-widest text-gray-400 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {invoiceData.items.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="py-4">
                                        <p className="font-bold text-gray-900 text-sm">{item.variant.product.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5 tracking-widest">
                                            {item.variant.size} • {item.variant.color} • {item.variant.sku}
                                        </p>
                                    </td>
                                    <td className="py-4 text-center font-bold text-xs">{item.quantity}</td>
                                    <td className="py-4 text-right font-bold text-xs">₹{item.price.toLocaleString()}</td>
                                    <td className="py-4 text-right font-black text-sm">₹{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end pt-4">
                    <div className="w-full max-w-[200px] space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-gray-900">₹{invoiceData.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-t-2 border-black">
                            <span className="text-[10px] font-black uppercase tracking-widest">Grand Total</span>
                            <span className="text-2xl font-black italic tracking-tighter">₹{invoiceData.total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Footer Notes */}
                <div className="pt-8 border-t border-gray-100 flex justify-between items-start gap-12">
                    <div className="max-w-md">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Notes</h4>
                        <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                            Thank you for shopping. Quotes/Queries: support@thulasitextiles.com
                        </p>
                    </div>
                    <div className="text-right italic text-[10px] font-bold text-gray-300">
                        COMPUTER GENERATED INVOICE
                    </div>
                </div>
            </div>

            <script dangerouslySetInnerHTML={{ __html: 'window.onload = () => window.print()' }} />
        </div>
    );
}
