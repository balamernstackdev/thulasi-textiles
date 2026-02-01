'use client';

import { useState, useTransition, useMemo } from 'react';
import {
    Package,
    Truck,
    Clock,
    CheckCircle2,
    Printer,
    MoreHorizontal,
    AlertCircle,
    Search,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { bulkUpdateOrders } from '@/lib/actions/order';
import { toast } from 'sonner';
import { format } from 'date-fns';
import PackingSlip from '@/components/admin/PackingSlip';

export default function FulfillmentClient({ initialOrders }: { initialOrders: any[] }) {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [isPrinting, setIsPrinting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = useMemo(() => orders.filter(o =>
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    ), [orders, searchQuery]);

    const toggleOrderSelection = (id: string) => {
        setSelectedOrderIds(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const handleBulkAction = async (status: string) => {
        if (selectedOrderIds.length === 0) return;

        startTransition(async () => {
            const res = await bulkUpdateOrders(selectedOrderIds, status);
            if (res.success) {
                toast.success(res.message);
                // Refresh local state (remove updated if they no longer match PENDING/PROCESSING)
                if (status === 'SHIPPED' || status === 'CANCELLED' || status === 'DELIVERED') {
                    setOrders(prev => prev.filter(o => !selectedOrderIds.includes(o.id)));
                } else {
                    setOrders(prev => prev.map(o => selectedOrderIds.includes(o.id) ? { ...o, status } : o));
                }
                setSelectedOrderIds([]);
            } else {
                toast.error(res.error || 'Failed to update orders');
            }
        });
    };

    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setIsPrinting(false);
        }, 1200);
    };

    // If printing, render only the packing slips
    if (isPrinting) {
        const ordersToPrint = orders.filter(o => selectedOrderIds.includes(o.id));
        return (
            <div className="fixed inset-0 bg-white z-[9999] overflow-auto p-0 m-0 print:static print:bg-transparent print:z-auto print:overflow-visible">
                {ordersToPrint.map(order => (
                    <PackingSlip key={order.id} order={order} />
                ))}
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-gray-900 uppercase italic tracking-tighter">Fulfillment Hub</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded tracking-widest uppercase">Operations</span>
                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Managed {orders.length} active shipments</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handlePrint}
                        disabled={selectedOrderIds.length === 0}
                        className="h-12 px-6 rounded-2xl bg-white border-2 border-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest hover:border-gray-900 transition-all flex items-center gap-2 group disabled:opacity-50"
                    >
                        <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Print Slips ({selectedOrderIds.length})
                    </button>
                    <div className="relative group">
                        <button
                            disabled={selectedOrderIds.length === 0 || isPending}
                            className="h-12 px-8 rounded-2xl bg-orange-600 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-all flex items-center gap-2 shadow-xl shadow-orange-600/20 disabled:opacity-50"
                        >
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                            Ship Selected
                        </button>
                        {selectedOrderIds.length > 0 && !isPending && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 hidden group-hover:block z-50">
                                <button onClick={() => handleBulkAction('PROCESSING')} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50">Mark Processing</button>
                                <button onClick={() => handleBulkAction('SHIPPED')} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 text-orange-600">Ship Orders</button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button onClick={() => handleBulkAction('CANCELLED')} className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 text-red-500">Cancel Selected</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats / Alerts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-orange-600">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Waiting</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">{orders.length}</h3>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-1">Orders in Queue</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                            <AlertCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Aging Over 3d</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">
                        {orders.filter(o => o.daysOpen >= 3).length}
                    </h3>
                    <p className="text-xs font-bold text-red-500 uppercase mt-1">Urgent Fulfillment</p>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-xl border-l-4 border-black">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-black">
                            <Package className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ready to Pack</span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900">
                        {orders.filter(o => o.status === 'PROCESSING').length}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase mt-1">Assigned for Processing</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                    placeholder="Search by Order ID, Customer Name or Email..."
                    className="w-full h-16 pl-16 pr-6 bg-white rounded-3xl shadow-lg border-2 border-transparent focus:border-orange-600 transition-all font-bold text-gray-900 outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                    <div
                        key={order.id}
                        className={`group bg-white rounded-3xl p-6 border-2 transition-all cursor-pointer ${selectedOrderIds.includes(order.id) ? 'border-orange-600 bg-orange-50/30' : 'border-white hover:border-orange-100 shadow-xl shadow-gray-200/50'
                            }`}
                        onClick={() => toggleOrderSelection(order.id)}
                    >
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            {/* Selection Checkbox */}
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors ${selectedOrderIds.includes(order.id) ? 'bg-orange-600 border-orange-600 text-white' : 'border-gray-200'
                                }`}>
                                {selectedOrderIds.includes(order.id) && <CheckCircle2 className="w-4 h-4" />}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-black text-gray-900 uppercase italic tracking-tighter">Order #{order.id.slice(-6).toUpperCase()}</h4>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${order.status === 'PENDING' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                    {order.daysOpen >= 3 && (
                                        <div className="flex items-center gap-1 text-[9px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded uppercase animate-pulse">
                                            <AlertCircle className="w-3 h-3" />
                                            Aging {order.daysOpen}d
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer: <span className="text-gray-900">{order.user.name || order.user.email}</span></p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Placed: <span className="text-gray-900">{format(new Date(order.createdAt), 'MMM dd, p')}</span></p>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Items: <span className="text-gray-900">{order.items.length}</span></p>
                                </div>
                            </div>

                            {/* Item Previews */}
                            <div className="flex -space-x-3 overflow-hidden shrink-0">
                                {order.items.slice(0, 3).map((item: any, idx: number) => (
                                    <div key={idx} className="w-12 h-12 rounded-xl bg-gray-100 border-2 border-white overflow-hidden relative shadow-sm">
                                        {item.variant.product.images?.[0] && (
                                            <img src={item.variant.product.images[0].url} alt="" className="object-cover w-full h-full" />
                                        )}
                                    </div>
                                ))}
                                {order.items.length > 3 && (
                                    <div className="w-12 h-12 rounded-xl bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-500">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>

                            {/* Actions Right */}
                            <div className="flex items-center gap-4 shrink-0 md:border-l border-gray-100 md:pl-6">
                                <span className="text-lg font-black text-gray-900">₹{Math.round(Number(order.total)).toLocaleString()}</span>
                                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center bg-white rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter">Queue is Clear</h3>
                        <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2 px-10">No orders currently require fulfillment. High five! 🖐️</p>
                    </div>
                )}
            </div>
        </div>
    );
}
