export interface ISingleLeadAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleLead;
    message: string;
    timestamp: string;
  }
  export interface ISingleLead {
    _id: string;
    reference_no: string;
    user: User;
    service_category: ServiceCategory;
    child_category: string;
    manual_child_category?: null;
    frequency: string;
    selected_options?: (string)[] | null;
    preferred_start_date: string;
    preferred_time_of_day: string;
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
    unlocked: boolean;
  }
  export interface User {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    createdAt: string;
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
  