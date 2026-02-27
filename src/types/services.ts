export interface IAllServiceCategoriesAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllServiceCategoriesDataEntity)[] | null;
    message: string;
    timestamp: string;
}
export interface IAllServiceCategoriesDataEntity {
    _id: string;
    title: string;
    description: string;
    image: string;
    options?: (IAllServiceCategoriesOptionsEntity)[] | null;
    child_categories?: (IAllServiceCategoriesChildCategoriesEntity)[] | null;
}
export interface IAllServiceCategoriesOptionsEntity {
    label: string;
    status: string;
}
export interface IAllServiceCategoriesChildCategoriesEntity {
    _id: string;
    title: string;
    description: string;
    image: string;
    options?: (IAllServiceCategoriesOptionsEntity)[] | null;
}
