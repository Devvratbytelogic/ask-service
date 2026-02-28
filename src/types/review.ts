export interface IAllVendorReviewsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllVendorReviewsData;
    message: string;
    timestamp: string;
  }
  export interface IAllVendorReviewsData {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: RatingDistribution;
    reviews?: (IAllVendorReviewsReviewsEntity)[] | null;
  }
  export interface RatingDistribution {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  }
  export interface IAllVendorReviewsReviewsEntity {
    _id: string;
    user: IAllVendorReviewsUser;
    service_request_id: string;
    vendor: string;
    rating: number;
    review: string;
    status: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
    likes?: (null)[] | null;
    likes_count: number;
  }
  export interface IAllVendorReviewsUser {
    _id: string;
    first_name: string;
    last_name: string;
    profile_pic?: null;
    email: string;
  }
  