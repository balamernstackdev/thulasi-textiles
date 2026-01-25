'use server';

import prismadb from '@/lib/prisma';

export async function getCustomers(options: {
    page?: number,
    pageSize?: number
} = {}) {
    try {
        const { page = 1, pageSize = 10 } = options;
        const skip = (page - 1) * pageSize;

        const [customers, total] = await Promise.all([
            prismadb.user.findMany({
                where: { role: 'CUSTOMER' },
                skip,
                take: pageSize,
                orderBy: { createdAt: 'desc' },
            }),
            prismadb.user.count({
                where: { role: 'CUSTOMER' }
            })
        ]);

        return {
            success: true,
            data: customers,
            pagination: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        };
    } catch (error) {
        console.error('Fetch customers error:', error);
        return { success: false, error: 'Failed to fetch customers' };
    }
}
