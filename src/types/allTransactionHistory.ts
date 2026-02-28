export interface IAllTransactionHistoryAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllTransactionHistoryData;
    message: string;
    timestamp: string;
  }
  export interface IAllTransactionHistoryData {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    transactions?: (IAllTransactionHistoryTransactionsEntity)[] | null;
  }
  export interface IAllTransactionHistoryTransactionsEntity {
    _id: string;
    transaction_id: string;
    date_time: string;
    payment_method?: null;
    amount_paid?: null;
    currency: string;
    credit_added?: string | null;
    status: string;
    receipt_url?: null;
    description: string;
  }
  