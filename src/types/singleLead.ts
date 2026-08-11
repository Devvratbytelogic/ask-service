export interface ISingleLeadAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: ISingleLeadAPIResponseData;
  message: string;
  timestamp: string;
}
export interface ISingleLeadAPIResponseData {
  _id: string;
  reference_no: string;
  user: User;
  service_category: ServiceCategory;
  parent_service_category: ServiceCategory;
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
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  contact_details: ContactDetails;
  status: string;
  deletedAt?: null;
  reason?: null;
  dynamic_answers?: (DynamicAnswersEntity)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  canQuote: boolean;
  unlocked: boolean;
  document_verified?: boolean;
  creditsToUnlock?: number;
  quotes_count?: number;
  quote_id?: string;
  lead_status?: string;
  lead_status_label?: string;
  lead_stars_label?: string;
  lead_stars?: number;
  lead_status_message?: string;
  cityOrPostalCode?: string;
  desiredDate?: string;
  timeSlot?: string;
  additionalDetails?: string;
}
export interface User {
  _id: string;
  first_name: string;
  profile_pic?: string | null;
  last_name: string;
  email: string;
  phone: string;
  createdAt: string;
}
export interface ServiceCategory {
  _id: string;
  title: string;
  image?: string | null;
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
  type: string;
  value: string;
  _id: string;
}
