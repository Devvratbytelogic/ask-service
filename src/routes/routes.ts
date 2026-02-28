// Vendor dashboard & leads
export function generateLeadDetailRoutePath(id: string) {
    return `/vendor/dashboard/lead/${id}`;
}
export function getVendorDashboardRoutePath() {
    return `/vendor/dashboard`;
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
