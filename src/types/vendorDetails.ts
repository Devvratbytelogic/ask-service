export interface IVendorDetailsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IVendorDetailsAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IVendorDetailsAPIResponseData {
    vendor: IVendorDetailsAPIResponseDataVendor;
    review: IVendorDetailsAPIResponseDataReview;
  }
  export interface IVendorDetailsAPIResponseDataVendor {
    _id: string;
    first_name: string;
    last_name: string;
    profile_pic?: null;
    email: string;
    is_email_verified: boolean;
    phone: string;
    is_phone_verified: boolean;
    otp_expires_at?: null;
    otp_phone_expiry_at: string;
    email_verification_token?: null;
    otp_for: string;
    status: string;
    kyc_status: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    service: Service;
    about_company: string;
    address: string;
    business_name: string;
    city: string;
    company_registration_number: string;
    company_size: string;
    response_time: string;
    website_link: string;
    postal_code: string;
    vat_number: string;
    years_of_activity: string;
    is_vendor: boolean;
    fcm_token?: (string)[] | null;
    id: string;
  }
  export interface Service {
    is_tasks_required_visible: boolean;
    _id: string;
    title: string;
    description: string;
    image?: null;
    status: string;
    parent_category?: null;
    createdBy: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    frequency?: (string)[] | null;
    is_end_date_visible: boolean;
    is_end_time_visible: boolean;
    is_frequency_visible: boolean;
    is_preferred_date_visible: boolean;
    is_preferred_time_visible: boolean;
    is_start_date_visible: boolean;
    is_start_time_visible: boolean;
    company_credit: number;
    credit: number;
    id: string;
  }
  export interface IVendorDetailsAPIResponseDataReview {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
    reviews?: (null)[] | null;
  }
  export interface RatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }
  