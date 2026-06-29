export interface ISingleRequestAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleRequestData;
    message: string;
    language: string;
    timestamp: string;
  }
  export interface ISingleRequestData {
    _id: string;
    reference_no: string;
    user: string;
    service_category: ServiceCategory;
    child_category?: null;
    manual_child_category?: null;
    selected_options?: (null)[] | null;
    preferred_start_date?: null;
    preferred_time_of_day?: null;
    start_date?: null;
    start_time?: null;
    end_date?: null;
    end_time?: null;
    note: string;
    pincode?: null;
    contact_details: ContactDetails;
    status: string;
    deletedAt?: null;
    reason?: null;
    dynamic_answers?: (DynamicAnswersEntity)[] | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    request_id: string;
    quotes_status: string;
    quotes_status_label: string;
    quotes_count: number;
    total_quotes_count: number;
    accepted_quotes_count: number;
    ignored_quotes_count: number;
    new_quotes_count: number;
    accepted_quote_message?: null;
    accepted_quote_sub_message?: null;
    quotes?: (null)[] | null;
    status_label: string;
  }
  export interface ServiceCategory {
    _id: string;
    title: string;
    description: string;
    image?: null;
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
  export interface DynamicAnswersEntity {
    question_id: string;
    key: string;
    label: string;
    value: string;
    _id: string;
  }
  