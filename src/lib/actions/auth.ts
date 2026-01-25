'use server';

import bcrypt from 'bcryptjs';
import prismadb from '@/lib/prisma';
import { login as setSession, logout as destroySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { error: 'Please fill in all fields' };
    }

    try {
        const existingUser = await prismadb.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prismadb.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CUSTOMER'
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        await setSession(userWithoutPassword);

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Something went wrong during registration' };
    }

    redirect('/');
}

export async function login(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please fill in all fields' };
    }

    try {
        const user = await prismadb.user.findUnique({
            where: { email }
        });

        if (!user) {
            return { error: 'Invalid credentials' };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { error: 'Invalid credentials' };
        }

        const { password: _, ...userWithoutPassword } = user;
        await setSession(userWithoutPassword);

    } catch (error) {
        console.error('Login error:', error);
        return { error: 'Something went wrong during login' };
    }

    redirect('/');
}

export async function logout() {
    await destroySession();
}
