import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prismadb from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { name, email } = await req.json();

        if (!name || !email) {
            return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
        }

        // Check if email is already taken by another user
        const existingUser = await prismadb.user.findFirst({
            where: {
                email,
                NOT: { id: session.user.id }
            }
        });

        if (existingUser) {
            return NextResponse.json({ success: false, error: 'Email already in use' }, { status: 400 });
        }

        // Update user profile
        await prismadb.user.update({
            where: { id: session.user.id },
            data: { name, email }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }
}
