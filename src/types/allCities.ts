export interface IAllCitiesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data: IAllCitiesAPIResponseData;
    message: string;
    timestamp: string;
  }
  export interface IAllCitiesAPIResponseData {
    cities?: (string)[] | null;
  }
  