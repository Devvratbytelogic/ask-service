export interface IAllQuotesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllQuotes)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllQuotes {
    availability_text?: null;
    _id: string;
    vendor_id: string;
    service_request_id: string;
    quote_price: number;
    currency: string;
    service_description: string;
    available_start_date: string;
    quote_valid_days: number;
    attachment_url?: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    excluded_items?: (null)[] | null;
    included_items?: (null)[] | null;
    id: string;
  }
  