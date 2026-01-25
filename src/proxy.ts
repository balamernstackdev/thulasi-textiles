import { NextRequest, NextResponse } from 'next/server';
import { updateSession, getSession } from '@/lib/auth';

export async function proxy(request: NextRequest) {
    // Refresh the session if it exists
    const sessionRes = await updateSession(request);

    const session = await getSession();
    const { pathname } = request.nextUrl;

    // Protect admin routes
    if (pathname.startsWith('/admin')) {
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect authenticated users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
        if (session) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return sessionRes || NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
