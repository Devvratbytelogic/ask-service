export interface IVendorDashboardTransactionAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IVendorDashboardTransactionData;
    message: string;
    timestamp: string;
  }
  export interface IVendorDashboardTransactionData {
    total: number;
    page: number;
    limit: number;
    transactions?: (TransactionsEntity)[] | null;
  }
  export interface TransactionsEntity {
    _id: string;
    type: string;
    description: string;
    credits: string;
    balanceAfter: number;
    date: string;
  }
  