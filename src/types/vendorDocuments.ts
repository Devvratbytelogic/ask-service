export interface IAllVendorDocumentsAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllVendorDocumentsData;
    message: string;
    timestamp: string;
  }
  export interface IAllVendorDocumentsData {
    documents?: (IAllVendorDocumentsDocumentsEntity)[] | null;
  }
  export interface IAllVendorDocumentsDocumentsEntity {
    document_id: string;
    name: string;
    description?: null;
    allowed_formats: string;
    type: string;
    is_required: boolean;
    status: string;
    file?: File | null;
    uploadedAt?: string | null;
  }
  export interface IAllVendorDocumentsFile {
    path: string;
    file_name: string;
    url: string;
  }
  