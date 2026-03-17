// Vendor dashboard & leads
export function generateLeadDetailRoutePath(
    id: string,
    params?: { from?: 'purchased' | 'quoted' | 'available' },
) {
    const fromParam = params?.from ? `?from=${params.from}` : ''
    return `/vendor/dashboard/lead/${id}${fromParam}`
}
export function getVendorDashboardRoutePath(params?: { leads?: 'purchased' | 'quoted' | 'available' }) {
    const leadsParam = params?.leads === 'purchased' ? 'purchased' : params?.leads === 'quoted' ? 'quoted' : params?.leads === 'available' ? 'available' : undefined
    const search = leadsParam ? `?leads=${leadsParam}` : ''
    return `/vendor/dashboard${search}`;
}
export function getVendorAllQuotesRoutePath() {
    return `/vendor/all-quotes`;
}
export function getCreditsRoutePath() {
    return `/vendor/credits`;
}

// General app routes
export function getHomeRoutePath() {
    return `/`;
}
export function getMyRequestRoutePath() {
    return `/my-request`;
}
export function getCreateRequestRoutePath() {
    return `/create-request`;
}
export function getVendorMessageRoutePath() {
    return `/vendor/message`;
}
export function getMessageRoutePath() {
    return `/message`;
}
export function getVendorProfileRoutePath() {
    return `/vendor/profile`;
}
export function getVendorAccountRoutePath(params?: { section?: string }) {
    const search = params?.section ? `?section=${params.section}` : ''
    return `/vendor/account${search}`;
}
export function getMyAccountRoutePath(params?: { section?: string }) {
    const search = params?.section ? `?section=${params.section}` : ''
    return `/my-account${search}`;
}

/** Dashboard path for the given role (User → my-request, Vendor → vendor/dashboard). */
export function getDashboardPathForRole(
    role: string | { name?: string; id?: string; _id?: string } | undefined | null
): string {
    const r =
        role == null
            ? ''
            : typeof role === 'string'
              ? role
              : String(role.name ?? role.id ?? role._id ?? '');
    const rLower = r.toLowerCase();
    if (rLower === 'vendor') return getVendorDashboardRoutePath({ leads: 'purchased' });
    return getMyRequestRoutePath();
}
export function getContactUsRoutePath() {
    return `/contact-us`;
}
export function getHelpCenterRoutePath() {
    return `/help-center`;
}
export function getFaqRoutePath() {
    return `/faq`;
}
export function getVendorSupportRoutePath() {
    return `/vendor/support`;
}
export function getTermsRoutePath() {
    return `/terms`;
}
export function getPrivacyRoutePath() {
    return `/privacy`;
}

// External / social links (for footer etc.)
export function getFacebookUrl() {
    return `https://facebook.com`;
}
export function getTwitterUrl() {
    return `https://x.com`;
}
export function getInstagramUrl() {
    return `https://instagram.com`;
}
