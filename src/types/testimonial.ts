export interface IAllTestimonialsAPIResponse {
  http_status_code: number;
  http_status_msg: string;
  success: boolean;
  data?: (IAllTestimonialsData)[] | null;
  message: string;
  timestamp: string;
}
export interface IAllTestimonialsData {
  _id: string;
  name: string;
  designation: string;
  company_name?: string | null;
  message: string;
  rating: number;
  status: string;
  createdBy: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
