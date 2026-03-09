export interface IAllCreditsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllCreditsDataEntity)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllCreditsDataEntity {
    _id: string;
    name: string;
    credits: number;
    bonus_credits: number;
    price: number;
    currency: string;
    per_credit_price: number;
    is_most_popular: boolean;
    sort_order: number;
    status: string;
    createdBy: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  