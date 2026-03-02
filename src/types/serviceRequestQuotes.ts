export interface IServiceRequestQuotesAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data: IServiceRequestQuotesData;
  message: string;
  timestamp: string;
}
export interface IServiceRequestQuotesData {
  request: Request;
  quotes?: (QuotesEntity)[] | null;
}
export interface Request {
  _id: string;
  request_id: string;
  service_title: string;
  date: string;
  location: string;
  quotes_count: number;
}
export interface QuotesEntity {
  _id: string;
  quote_id: string;
  vendor_id: string;
  provider_name: string;
  rating: number;
  reviews_count: number;
  service_description: string;
  responded_in_hours: string;
  price: number;
  currency: string;
  price_display: string;
  available_start_date: string;
  status: string;
}
