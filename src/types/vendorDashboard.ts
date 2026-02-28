export interface IVendorDashboardDataAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IVendorDashboardData;
    message: string;
    timestamp: string;
}
export interface IVendorDashboardData {
    availableLeadsCount: number;
    purchasedLeadsCount: number;
    creditBalance: number;
    quotesSentCount: number;
    kyc_status: string;
    canPurchaseLeads: boolean;
}


//  vendor available leads  API response
export interface IVendorAvailableLeadsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IVendorAvailableLeads)[] | null;
    message: string;
    timestamp: string;
}
export interface IVendorAvailableLeads {
    _id: string;
    reference_no: string;
    user: string;
    service_category: ServiceCategory;
    child_category: string;
    manual_child_category?: null;
    frequency: string;
    selected_options?: (string | null)[] | null;
    preferred_start_date: string;
    preferred_time_of_day: string;
    note?: string | null;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    status: string;
    contact_details: ContactDetails;
    deletedAt?: null;
    reason?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    unlocked: boolean;
    creditsToUnlock: number;
    quotes_count: number;
}
export interface ServiceCategory {
    _id: string;
    title: string;
}
export interface ContactDetails {
    first_name: string;
    last_name: string;
    client_type: string;
    phone: string;
    email: string;
}
