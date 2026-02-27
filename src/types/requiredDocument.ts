export interface IAllServicesDocumentsRequiredAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllServicesDocumentsRequiredDataEntity)[] | null;
    message: string;
    timestamp: string;
  }
  export interface IAllServicesDocumentsRequiredDataEntity {
    description?: null;
    allowed_formats: string;
    _id: string;
    service_category: string;
    name: string;
    type: string;
    is_required: boolean;
    status: string;
    createdBy: string;
    deletedAt?: null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  