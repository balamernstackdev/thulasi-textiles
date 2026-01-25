import { Users, Mail, Calendar, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Pagination from '@/components/shared/Pagination';
import { getCustomers } from '@/lib/actions/customer';
import { format } from 'date-fns';

export default async function CustomersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const result = await getCustomers({ page });
    const customers = result.success ? result.data : [];
    const pagination = result.pagination;

    return (
        <div className="p-4 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase italic tracking-tighter">Customers</h1>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest font-bold">View your customer base</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                        <input
                            placeholder="Search customers..."
                            className="pl-12 pr-4 h-12 w-full border-2 border-gray-50 bg-gray-50/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-bold text-gray-900"
                        />
                    </div>
                    <Button className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black text-white hover:bg-gray-900 border-transparent">
                        <Filter className="w-4 h-4 mr-2" /> Filter catalog
                    </Button>
                </div>

                {customers.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                            <Users className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter mb-2">No customers yet</h3>
                        <p className="text-sm text-gray-400 font-medium max-w-sm">Customer details will be listed here after they sign up or make a purchase.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-[#f8fafc]/50 border-b border-gray-50">
                                <tr>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Email Address</th>
                                    <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Joined On</th>
                                    <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {customers.map((customer: any) => (
                                    <tr key={customer.id} className="hover:bg-gray-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-black shadow-sm">
                                                    {customer.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="font-black text-gray-900 group-hover:text-orange-600 transition-colors">{customer.name || 'Anonymous'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {customer.id.slice(-6).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                                                <Mail className="w-3.5 h-3.5 text-gray-300" />
                                                {customer.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-tighter">
                                                <Calendar className="w-3.5 h-3.5 text-gray-300" />
                                                {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-black text-gray-900 italic">
                                            Active User
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
                    totalPages={pagination.totalPages}
                    baseUrl="/admin/customers"
                />
            )}
        </div>
    );
}
