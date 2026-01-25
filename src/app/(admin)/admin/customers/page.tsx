import { Users } from 'lucide-react';
import Pagination from '@/components/shared/Pagination';

export default async function CustomersPage({
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
                <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
                <p className="text-gray-500">View your customer base</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No customers yet</h3>
                <p className="text-gray-500 max-w-md">Customer details will be listed here after they sign up or make a purchase.</p>
            </div>

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                baseUrl="/admin/customers"
            />
        </div>
    );
}
