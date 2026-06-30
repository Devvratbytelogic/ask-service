export interface IAllRequestsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllRequestsData;
  message: string;
  timestamp: string;
}
export interface IAllRequestsData {
  data?: (IAllRequestsDataEntity)[] | null;
  pagination: Pagination;
  summary: Summary;
}
export interface IAllRequestsDataEntity {
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
  quotes_status: string;
  quotes_status_label: string;
  new_quotes_count: number;
  total_quotes_count?: number;
  accepted_quotes_count?: number;
  ignored_quotes_count?: number;
  contact_details: ContactDetails;
  cityOrPostalCode: string;
  desiredDate: string;
  timeSlot: string;
  additionalDetails: string;
  deletedAt?: null;
  reason?: null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  request_id: string;
  quotes_count: number;
  quotes?: (QuotesEntity | null)[] | null;
  status_label: string;
  location: string;
}
export interface QuotesEntity {
  _id: string;
  quote_id: string;
  vendor_id: string;
  service_request_id: string;
  quote_price: number;
  currency: string;
  service_description: string;
  available_start_date: string;
  quote_valid_days: number;
  attachment_url: string;
  included_items?: (null)[] | null;
  excluded_items?: (null)[] | null;
  availability_text?: null;
  status: string;
  createdAt: string;
  updatedAt: string;
  vendor: Vendor;
  provider_name: string;
  rating?: null;
  reviews_count: number;
  price: number;
  price_display: string;
  responded_in_hours: number;
  preferred_time_of_day?: null;
}
export interface Vendor {
  _id: string;
  first_name: string;
  last_name: string;
  profile_pic?: null;
  email: string;
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
export interface Summary {
  active_requests_count: number;
  quotes_received_count: number;
  quotes_accepted_count: number;
  applications_closed_count: number;
}
