// Vendor dashboard & leads
export function generateLeadDetailRoutePath(id: string) {
    return `/vendor/dashboard/lead/${id}`;
}
export function getVendorDashboardRoutePath(params?: { leads?: 'purchased' }) {
    const search = params?.leads === 'purchased' ? '?leads=purchased' : ''
    return `/vendor/dashboard${search}`;
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
export function getVendorMessageRoutePath() {
    return `/vendor/message`;
}
export function getVendorProfileRoutePath() {
    return `/vendor/profile`;
}
export function getVendorAccountRoutePath() {
    return `/vendor/account`;
}
export function getMyAccountRoutePath() {
    return `/my-account`;
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
    return `/vendor-support`;
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
