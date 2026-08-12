export interface IAvailableLeadByCategoryAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAvailableLeadByCategoryData;
  message: string;
  language: string;
  timestamp: string;
}
export interface IAvailableLeadByCategoryData {
  summary: IAvailableLeadByCategorySummary;
  data?: (IAvailableLeadByCategoryDataEntity)[] | null;
  pagination?: IAvailableLeadByCategoryPagination;
  total_categories: number;
  total_leads: number;
}
export interface IAvailableLeadByCategorySummary {
  availableLeadsCount: number;
  purchasedLeadsCount: number;
  creditBalance: number;
  quotesSentCount: number;
  kyc_status: string;
  document_verified: boolean;
  document_verification_message: string;
  canPurchaseLeads: boolean;
}
export interface IAvailableLeadByCategoryDataEntity {
  service_category: IAvailableLeadByCategoryServiceCategory;
  parent_service_category: IAvailableLeadByCategoryServiceCategory;
  leads_count: number;
  status: string | null;
  status_label: string | null;
  leads?: (IAvailableLeadByCategoryLeadsEntity)[] | null;
  pagination?: IAvailableLeadByCategoryPagination;
}
export interface IAvailableLeadByCategoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface IAvailableLeadByCategoryServiceCategory {
  _id: string;
  title: string;
  description: string;
  image?: null;
  company_credit: number;
  credit: number;
}
export interface IAvailableLeadByCategoryLeadsEntity {
  _id: string;
  reference_no: string;
  user: string;
  service_category: IAvailableLeadByCategoryServiceCategory1;
  child_category?: string | null;
  manual_child_category?: string | null;
  selected_options?: (string | null)[] | null;
  preferred_start_date?: string | null;
  preferred_time_of_day?: string | null;
  start_date?: string | null;
  start_time?: string | null;
  end_date?: string | null;
  end_time?: string | null;
  note?: string | null;
  pincode?: string | null;
  contact_details: IAvailableLeadByCategoryContactDetailsEntity;
  status: string;
  deletedAt?: null;
  reason?: null;
  dynamic_answers?: (IAvailableLeadByCategoryDynamicAnswersEntity)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lead_status: string;
  lead_status_label: string;
  quote_id?: string | null;
  unlocked: boolean;
  creditsToUnlock: number;
  quotes_count: number;
  address_1?: string | null;
  address_2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  frequency?: string | null;
  cityOrPostalCode?: string | null;
  desiredDate?: string | null;
  timeSlot?: string | null;
}
export interface IAvailableLeadByCategoryServiceCategory1 {
  _id: string;
  title: string;
  company_credit: number;
  credit: number;
  image?: string | null;
}
export interface IAvailableLeadByCategoryContactDetailsEntity {
  first_name: string;
  last_name: string;
  client_type: string;
  phone: string;
  email: string;
}
export interface IAvailableLeadByCategoryDynamicAnswersEntity {
  question_id: string;
  key: string;
  label: string;
  value: string;
  type: string;
  _id: string;
}
