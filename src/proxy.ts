import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VENDOR_DASHBOARD_PATH = '/vendor/dashboard';

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const userRole = request.cookies.get('user_role')?.value?.trim();

    const isHomePage = pathname === '/' || pathname === '';
    const isVendor = userRole?.toLowerCase() === 'vendor';

    if (isHomePage && isVendor) {
        return NextResponse.redirect(new URL(VENDOR_DASHBOARD_PATH, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/'],
};