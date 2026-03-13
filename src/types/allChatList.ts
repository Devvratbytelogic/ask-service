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
  unreadCounts?: (null)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage?: null;
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
  service_request_id: string;
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
