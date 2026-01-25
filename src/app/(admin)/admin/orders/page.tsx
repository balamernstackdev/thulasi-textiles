import { ShoppingBag, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/shared/Pagination';
import Link from 'next/link';
import { getAdminOrders } from '@/lib/actions/order';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const result = await getAdminOrders({ page });
    const orders = result.success ? result.data : [];
    const pagination = result.pagination;

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Orders</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">Track and manage customer orders</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            placeholder="Search orders..."
                            className="pl-12 pr-4 h-12 w-full border-2 border-gray-50 bg-gray-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all font-bold text-gray-900"
                        />
                    </div>
                    <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 border-transparent">
                        <Filter className="w-4 h-4 mr-2" /> Filter catalog
                    </Button>
                </div>

                {(!orders || orders.length === 0) ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-blue-500/10">
                            <ShoppingBag className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">Queue is Empty</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-sm">Orders will appear here once customers start purchasing from your store.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                                <tr>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Order ID</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {orders?.map((order: any) => (
                                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5 font-black text-gray-900">
                                            #{order.id.slice(-6).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-xs font-bold text-gray-500">{format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
                                            <p className="text-[10px] text-gray-400">{format(new Date(order.createdAt), 'HH:mm')}</p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm font-black text-gray-900">{order.user?.name || 'Guest'}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-5 font-black text-gray-900 italic">
                                            ₹{order.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                                                order.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-black transition-colors">Details</Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {pagination && (
                <Pagination
                    currentPage={page}
                    totalPages={pagination?.totalPages || 1}
                    baseUrl="/admin/orders"
                />
            )}
        </div>
    );
}
