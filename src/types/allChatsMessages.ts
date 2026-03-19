export interface IAllChatsMessagesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IAllChatsMessagesAPIResponseData;
  message: string;
  timestamp: string;
}
export interface IAllChatsMessagesAPIResponseData {
  messages?: (MessagesEntity)[] | null;
  lastIndex: number;
  totalPages?: number;
  totalMsg?: number;
}
export interface MessagesEntity {
  _id: string;
  sender: Sender;
  content: string;
  media_url?: string | null;
  chat: Chat;
  type: string;
  readBy?: (null)[] | null;
  reactions?: (null)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  reactionCounts: ReactionCounts;
}
export interface Sender {
  _id: string;
  first_name: string;
  last_name: string;
  profile_pic?: string | null;
  id: string;
}
export interface Chat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users?: (string)[] | null;
  groupAdmin?: (null)[] | null;
  quote_id: string;
  unreadCounts?: (UnreadCountsEntity)[] | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  latestMessage: string;
  id: string;
}
export interface UnreadCountsEntity {
  user: string;
  count: number;
  _id: string;
  id: string;
}
export interface ReactionCounts {
}
