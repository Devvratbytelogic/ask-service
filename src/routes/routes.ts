// Vendor dashboard & leads
export function getVendorLeadsListRoutePath() {
    return `/vendor/dashboard/lead`
}
export function generateLeadDetailRoutePath(
    id: string,
    params?: { from?: 'purchased' | 'quoted' | 'available' },
) {
    const fromParam = params?.from ? `?from=${params.from}` : ''
    return `/vendor/dashboard/lead/${id}${fromParam}`
}
export function getVendorDashboardRoutePath(params?: { leads?: 'unlocked' | 'quoted' | 'locked' }) {
    const leadsParam = params?.leads === 'unlocked' ? 'unlocked' : params?.leads === 'quoted' ? 'quoted' : params?.leads === 'locked' ? 'locked' : undefined
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
export function getEditRequestRoutePath(id: string) {
    return `/client/dashboard/edit-service/${id}`;
}
export function getCreateRequestRoutePath() {
    return `/create-request`;
}
export function getVendorMessageRoutePath() {
    return `/vendor/message`;
}
export function getMessageRoutePath() {
    return `/client/message`;
}
export function getVendorProfileRoutePath(vendorId: string, requestRef?: string | null) {
    if (requestRef) {
        return `/vendor-profile?vendorId=${vendorId}&requestRef=${encodeURIComponent(requestRef)}`
    }
    return `/vendor-profile?vendorId=${vendorId}`
}
export type MyAccountSection = 'profile' | 'security' | 'notifications'
export type VendorAccountSection = MyAccountSection | 'documents' | 'reviews' | 'payment-history'

export function getVendorAccountRoutePath(section: VendorAccountSection = 'profile') {
    return `/vendor/dashboard/account/${section}`;
}
export function getMyAccountRoutePath(section: MyAccountSection = 'profile') {
    return `/client/dashboard/my-account/${section}`;
}

/** Dashboard path for the given role (User → client/dashboard, Vendor → vendor/dashboard). */
// Deprecated
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
    if (rLower === 'vendor') return getVendorDashboardRoutePath();
    return getClientDashboardPageRoutePath();
}

/** Profile / account settings path for the given role (User → client/dashboard/my-account, Vendor → vendor/dashboard/account). */
export function getProfilePathForRole(
    role: string | { name?: string; id?: string; _id?: string } | undefined | null,
): string {
    const r =
        role == null
            ? ''
            : typeof role === 'string'
                ? role
                : String(role.name ?? role.id ?? role._id ?? '');
    const rLower = r.toLowerCase();
    if (rLower === 'vendor') return getVendorAccountRoutePath();
    return getMyAccountRoutePath();
}
export function getContactUsRoutePath() {
    return `/contact-us`;
}
export function getServiceProviderRoutePath() {
    return `/service-provider`;
}
export function getRequestAServiceRoutePath(serviceId?: string) {
    if (serviceId) return `/request-a-service?service=${encodeURIComponent(serviceId)}`;
    return `/request-a-service`;
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
export function getCookiesRoutePath() {
    return `/cookies`;
}

export function getRegistrationPageRoutePath(params?: { role?: 'vendor' | 'customer' }) {
    const role = params?.role
    return role ? `/auth/registration?role=${role}` : `/auth/registration`;
}

export function getLoginPageRoutePath(params?: { role?: 'vendor' | 'customer' }) {
    const role = params?.role
    return role ? `/auth/login?role=${role}` : `/auth/login`;
}

export function getForgotPasswordRoutePath() {
    return `/auth/forgot-password`;
}

export function getClientDashboardPageRoutePath() {
    return '/client/dashboard';
}
export function getVendorDashboardPageRoutePath() {
    return '/vendor/dashboard';
}
export function getDashboardPageRoutePathForRole(
    role: string | { name?: string; } | undefined | null,
) {
    const r =
        role == null
            ? ''
            : typeof role === 'string'
                ? role
                : String(role.name ?? '')
    const rLower = r.toLowerCase()
    if (rLower === 'vendor') return getVendorDashboardPageRoutePath()
    if (rLower === 'user') return getClientDashboardPageRoutePath()
    return getHomeRoutePath()
}

export function getMyQuotesRoutePath() {
    return '/my-quotes';
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
export function getLinkedinUrl() {
    return `https://linkedin.com`;
}
