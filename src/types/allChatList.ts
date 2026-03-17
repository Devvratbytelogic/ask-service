export interface IAllChatListAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IAllChatListData)[] | null;
  message: string;
  timestamp: string;
}
export interface IAllChatListData {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users?: (UsersEntity)[] | null;
  groupAdmin?: (null)[] | null;
  quote_id?: QuoteId | null;
  unreadCounts?: (UnreadCountsEntity | null)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage?: LatestMessage | null;
  unreadCount: number;
}
export interface UsersEntity {
  _id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  kyc_status: string;
  role: Role;
  itsMe: boolean;
  totalReviews?: number | null;
  averageRating?: number | null;
}
export interface Role {
  _id: string;
  name: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface QuoteId {
  _id: string;
  vendor_id: string;
  service_request_id: ServiceRequestId;
  quote_price: number;
  currency: string;
  service_description: string;
  available_start_date: string;
  quote_valid_days: number;
  attachment_url?: null;
  included_items?: (null)[] | null;
  excluded_items?: (null)[] | null;
  availability_text?: null;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ServiceRequestId {
  _id: string;
  reference_no: string;
  user: string;
  service_category: string;
  child_category: string;
  manual_child_category?: null;
  frequency: string;
  selected_options?: (null)[] | null;
  preferred_start_date?: null;
  preferred_time_of_day?: null;
  start_date: string;
  start_time: string;
  end_date: string;
  end_time: string;
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
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface ContactDetails {
  first_name: string;
  last_name: string;
  client_type: string;
  phone: string;
  email: string;
}
export interface UnreadCountsEntity {
  user: string;
  count: number;
  _id: string;
}
export interface LatestMessage {
  _id: string;
  sender: Sender;
  content: string;
  chat: string;
  type: string;
  media_url?: string | null;
  readBy?: (null)[] | null;
  reactions?: (null)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface Sender {
  _id: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  id: string;
}
