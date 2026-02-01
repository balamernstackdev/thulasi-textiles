import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret'; // In production, use env variable
const key = new TextEncoder().encode(process.env.JWT_SECRET || secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function login(user: any) {
    // Create the session
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

    // Sanitize user object to remove non-serializable data (like Prisma Decimals)
    const sanitizedUser = JSON.parse(JSON.stringify(user));
    const session = await encrypt({ user: sanitizedUser, expires });

    // Save the session in a cookie
    const cookieStore = await cookies();
    cookieStore.set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production' });
}

export async function logout() {
    // Destroy the session
    const cookieStore = await cookies();
    cookieStore.delete('session');
}

import { cache } from 'react';

export const getSession = cache(async () => {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    try {
        return await decrypt(session);
    } catch {
        return null;
    }
});

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    try {
        // Refresh the session so it doesn't expire
        const parsed = await decrypt(session);
        parsed.expires = new Date(Date.now() + 2 * 60 * 60 * 1000);
        const res = NextResponse.next();
        res.cookies.set({
            name: 'session',
            value: await encrypt(parsed),
            httpOnly: true,
            expires: parsed.expires,
            secure: process.env.NODE_ENV === 'production'
        });
        return res;
    } catch (error) {
        // If session is invalid, clear it
        console.error('Session update failed, clearing cookie:', error);
        const res = NextResponse.next();
        res.cookies.delete('session');
        return res;
    }
}
