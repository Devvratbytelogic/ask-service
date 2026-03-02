export interface IServiceRequestQuotesDetailAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IServiceRequestQuotesDetailData;
    message: string;
    timestamp: string;
  }
  export interface IServiceRequestQuotesDetailData {
    quote: Quote;
    vendor: Vendor;
    request: Request;
  }
  export interface Quote {
    _id: string;
    quote_price: number;
    currency: string;
    service_description: string;
    available_start_date: string;
    quote_valid_days: number;
    attachment_url: string;
    preferred_time_of_day: string;
  }
  export interface Vendor {
    _id: string;
    provider_name: string;
    rating: number;
    reviews_count: number;
    years_in_business: string;
  }
  export interface Request {
    request_id: string;
    service_title: string;
  }
  