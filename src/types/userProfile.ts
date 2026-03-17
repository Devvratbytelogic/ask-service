export interface IUserProfileInfoAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IUserProfileInfoData;
    message: string;
    timestamp: string;
  }
  export interface IUserProfileInfoData {
    otp_for?: null;
    _id: string;
    first_name: string;
    last_name: string;
    profile_pic?: string | null;
    email: string;
    is_email_verified: boolean;
    phone?: string | null;
    is_phone_verified: boolean;
    otp?: null;
    otp_phone: string;
    otp_expires_at: string;
    otp_phone_expiry_at?: null;
    email_verification_token: string;
    password: string;
    status: string;
    kyc_status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
    street_address?: string;
    address?: string;
    postcode?: string;
    postal_code?: string;
    city?: string;
    is_vendor?: boolean;
  }
  