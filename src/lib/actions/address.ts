'use server';

import prismadb from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserAddresses() {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const addresses = await prismadb.address.findMany({
            where: { userId: session.user.id },
            orderBy: { isDefault: 'desc' },
        });

        return { success: true, data: addresses };
    } catch (error) {
        console.error('Fetch addresses error:', error);
        return { success: false, error: 'Failed to fetch addresses' };
    }
}

export async function createAddress(formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const street = formData.get('street') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const zip = formData.get('zip') as string;
        const country = formData.get('country') as string;
        const isDefault = formData.get('isDefault') === 'true';

        if (!name || !street || !city || !state || !zip || !country) {
            return { success: false, error: 'All fields are required' };
        }

        // If setting as default, unset other defaults first
        if (isDefault) {
            await prismadb.address.updateMany({
                where: { userId: session.user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prismadb.address.create({
            data: {
                userId: session.user.id,
                name,
                phone,
                street,
                city,
                state,
                zip,
                country,
                isDefault,
            },
        });

        revalidatePath('/checkout');
        revalidatePath('/profile');
        return { success: true, data: address };
    } catch (error) {
        console.error('Create address error:', error);
        return { success: false, error: 'Failed to create address' };
    }
}

export async function updateAddress(id: string, formData: FormData) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const street = formData.get('street') as string;
        const city = formData.get('city') as string;
        const state = formData.get('state') as string;
        const zip = formData.get('zip') as string;
        const country = formData.get('country') as string;
        const isDefault = formData.get('isDefault') === 'true';

        // Verify ownership
        const existingAddress = await prismadb.address.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existingAddress) {
            return { success: false, error: 'Address not found' };
        }

        // If setting as default, unset other defaults first
        if (isDefault) {
            await prismadb.address.updateMany({
                where: { userId: session.user.id, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const address = await prismadb.address.update({
            where: { id },
            data: { name, phone, street, city, state, zip, country, isDefault },
        });

        revalidatePath('/checkout');
        revalidatePath('/profile');
        return { success: true, data: address };
    } catch (error) {
        console.error('Update address error:', error);
        return { success: false, error: 'Failed to update address' };
    }
}

export async function deleteAddress(id: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        // Verify ownership
        const existingAddress = await prismadb.address.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existingAddress) {
            return { success: false, error: 'Address not found' };
        }

        await prismadb.address.delete({
            where: { id },
        });

        revalidatePath('/checkout');
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Delete address error:', error);
        return { success: false, error: 'Failed to delete address' };
    }
}

export async function setDefaultAddress(id: string) {
    const session = await getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    try {
        // Verify ownership
        const existingAddress = await prismadb.address.findFirst({
            where: { id, userId: session.user.id },
        });

        if (!existingAddress) {
            return { success: false, error: 'Address not found' };
        }

        // Unset other defaults
        await prismadb.address.updateMany({
            where: { userId: session.user.id, isDefault: true },
            data: { isDefault: false },
        });

        // Set this as default
        await prismadb.address.update({
            where: { id },
            data: { isDefault: true },
        });

        revalidatePath('/checkout');
        revalidatePath('/profile');
        return { success: true };
    } catch (error) {
        console.error('Set default address error:', error);
        return { success: false, error: 'Failed to set default address' };
    }
}
