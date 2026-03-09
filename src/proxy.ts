import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VENDOR_DASHBOARD_PATH = '/vendor/dashboard';
const USER_DASHBOARD_PATH = '/my-request';

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const authToken = request.cookies.get('auth_token')?.value?.trim();
    const userRole = request.cookies.get('user_role')?.value?.trim();

    const isHomePage = pathname === '/' || pathname === '';
    const isLoggedIn = !!authToken;
    const isVendor = userRole?.toLowerCase() === 'vendor';

    if (isHomePage && isLoggedIn) {
        const redirectPath = isVendor ? VENDOR_DASHBOARD_PATH : USER_DASHBOARD_PATH;
        return NextResponse.redirect(new URL(redirectPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};