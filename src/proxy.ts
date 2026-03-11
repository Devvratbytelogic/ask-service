import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VENDOR_DASHBOARD_PATH = '/vendor/dashboard';
const USER_DASHBOARD_PATH = '/my-request';

/** Paths that require auth token; children are blocked too (e.g. /vendor/dashboard). */
const PROTECTED_PATH_PREFIXES = ['/create-request', '/my-account', '/my-request', '/vendor'] as const;

/** User-only paths; vendors cannot access these. */
const USER_PATH_PREFIXES = ['/create-request', '/my-account', '/my-request'] as const;

/** Vendor-only paths; users cannot access these. */
const VENDOR_PATH_PREFIXES = ['/vendor'] as const;

function matchesPathPrefix(pathname: string, prefixes: readonly string[]): boolean {
    const normalized = pathname.replace(/\/+$/, '') || '/';
    return prefixes.some(
        (prefix) => normalized === prefix || normalized.startsWith(prefix + '/')
    );
}

function isProtectedPath(pathname: string): boolean {
    return matchesPathPrefix(pathname, PROTECTED_PATH_PREFIXES);
}

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const authToken = request.cookies.get('auth_token')?.value?.trim();
    const userRole = request.cookies.get('user_role')?.value?.trim();

    const isHomePage = pathname === '/' || pathname === '';
    const isLoggedIn = !!authToken;
    const isVendor = userRole?.toLowerCase() === 'vendor';

    // Block protected routes when there is no auth token
    if (!isLoggedIn && isProtectedPath(pathname)) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Role-based access: users cannot access vendor routes; vendors cannot access user routes
    if (isLoggedIn) {
        if (isVendor && matchesPathPrefix(pathname, USER_PATH_PREFIXES)) {
            return NextResponse.redirect(new URL(VENDOR_DASHBOARD_PATH, request.url));
        }
        if (!isVendor && matchesPathPrefix(pathname, VENDOR_PATH_PREFIXES)) {
            return NextResponse.redirect(new URL(USER_DASHBOARD_PATH, request.url));
        }
    }

    if (isHomePage && isLoggedIn) {
        const redirectPath = isVendor ? VENDOR_DASHBOARD_PATH : USER_DASHBOARD_PATH;
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/create-request/:path*', '/my-account/:path*', '/my-request/:path*', '/vendor/:path*'],
};