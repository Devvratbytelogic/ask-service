export interface ISingleServiceAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: ISingleService;
    message: string;
    timestamp: string;
  }
  export interface ISingleService {
    _id: string;
    title: string;
    description: string;
    image?: null;
    status: string;
    parent_category?: null;
    options?: (null)[] | null;
    createdBy: string;
    credit: number;
    deletedAt?: null;
    frequency?: (string)[] | null;
    is_frequency_visible: boolean;
    is_start_date_visible: boolean;
    is_start_time_visible: boolean;
    is_end_date_visible: boolean;
    is_end_time_visible: boolean;
    is_preferred_time_visible: boolean;
    is_preferred_date_visible: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id: string;
  }
  