export interface IVendorProfileInfoAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IVendorProfileInfoData;
    message: string;
    timestamp: string;
}
export interface IVendorProfileInfoData {
    _id: string;
    first_name: string;
    last_name: string;
    profile_pic?: string | null;
    email: string;
    is_email_verified: boolean;
    phone: string;
    is_phone_verified: boolean;
    business_name?: string;
    address?: string;
    postal_code?: string;
    city?: string;
    vat_number?: string;
    company_registration_number?: string;
    years_of_activity?: string;
    company_size?: string;
    about_company?: string;
    website_link?: string;
    otp_expires_at?: null;
    otp_phone_expiry_at?: null;
    email_verification_token?: null;
    otp_for?: null;
    status: string;
    kyc_status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    service: IVendorProfileInfoService;
    id: string;
}
export interface IVendorProfileInfoService {
    _id: string;
    title: string;
    description: string;
    id: string;
}
