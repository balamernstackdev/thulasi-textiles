import { ShoppingBag } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';

export const dynamic = 'force-dynamic';

export default async function OrdersPage({
    searchParams
}: {
    searchParams: Promise<{ page?: string }>
}) {
    const params = await searchParams;
    const page = parseInt(params.page || '1');
    const totalPages = 1; // Placeholder for now

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
                <p className="text-gray-500">Track and manage customer orders</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
                <p className="text-gray-500 max-w-md">Orders will appear here once customers start purchasing from your store.</p>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/admin/orders"
            />
        </div>
    );
}
