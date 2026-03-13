export interface IAllRequestsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllRequestsData;
    message: string;
    timestamp: string;
  }
  export interface IAllRequestsData {
    data?: (DataEntity)[] | null;
    pagination: Pagination;
  }
  export interface DataEntity {
    _id: string;
    reference_no: string;
    user: string;
    service_category: ServiceCategoryOrChildCategory;
    child_category: ServiceCategoryOrChildCategory;
    manual_child_category?: null;
    frequency: string;
    selected_options?: (string)[] | null;
    preferred_start_date: string;
    preferred_time_of_day: string;
    start_date?: string;
    start_time?: string;
    end_date?: string;
    end_time?: string;
    note: string;
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
    request_id: string;
    quotes_count: number;
    status_label: string;
    location: string;
  }
  export interface ServiceCategoryOrChildCategory {
    _id: string;
    title: string;
    description: string;
    image: string;
    options?: (OptionsEntity)[] | null;
  }
  export interface OptionsEntity {
    label: string;
    status: string;
    _id: string;
  }
  export interface ContactDetails {
    first_name: string;
    last_name: string;
    client_type: string;
    phone: string;
    email: string;
  }
  export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
  