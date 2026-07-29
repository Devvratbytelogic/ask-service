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
  /** When not ACTIVE, vendor cannot purchase leads (e.g. documents under review). */
  key_status?: string;
  canPurchaseLeads: boolean;
}


//  vendor available leads  API response
export interface IVendorAvailableLeadsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IVendorAvailableLeadsData;
  message: string;
  timestamp: string;
}
export interface IVendorAvailableLeadsData {
  items?: (IVendorAvailableLeadsItemsEntity)[] | null;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export interface IVendorAvailableLeadsItemsEntity {
  city: string;
  pincode: string;
  _id: string;
  reference_no: string;
  user: string;
  service_category: IVendorAvailableLeadsServiceCategory;
  parent_service_category: IVendorAvailableLeadsServiceCategory;
  child_category?: null;
  manual_child_category?: null;
  selected_options?: (null)[] | null;
  preferred_start_date?: null;
  preferred_time_of_day?: null;
  start_date?: null;
  start_time?: null;
  end_date?: null;
  end_time?: null;
  note?: string | null;
  contact_details: IVendorAvailableLeadsContactDetails;
  status: string;
  deletedAt?: null;
  reason?: null;
  dynamic_answers?: (IVendorAvailableLeadsDynamicAnswersEntity)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  unlocked: boolean;
  creditsToUnlock: number;
  quotes_count: number;
  lead_status?: string;
  lead_status_label?: string;
  lead_status_message?: string;
  cityOrPostalCode?: string;
  desiredDate?: string;
  timeSlot?: string;
  additionalDetails?: string;
}
export interface IVendorAvailableLeadsServiceCategory {
  _id: string;
  title: string;
  company_credit: number;
  credit: number;
}
export interface IVendorAvailableLeadsContactDetails {
  first_name: string;
  last_name: string;
  client_type: string;
  phone: string;
  email: string;
}
export interface IVendorAvailableLeadsDynamicAnswersEntity {
  question_id: string;
  key: string;
  label: string;
  value: string;
  _id: string;
}
