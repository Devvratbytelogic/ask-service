export interface IAllChatsMessagesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllChatsMessagesData;
    message: string;
    timestamp: string;
  }
  export interface IAllChatsMessagesData {
    messages?: (null)[] | null;
    lastIndex: number;
  }
  