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





export interface IAllServicesGroupedByParentCategoryAPIResponse {
    http_status_code: number;
    http_status_msg: string;
    success: boolean;
    data?: (IAllServicesGroupedByParentCategoryDataEntity)[] | null;
    message: string;
    language: string;
    timestamp: string;
}
export interface IAllServicesGroupedByParentCategoryDataEntity {
    _id: string;
    title: string;
    description: string;
    image?: string | null;
    options?: (IAllServicesGroupedByParentCategoryOptionsEntity | null)[] | null;
    child_categories?: (IAllServicesGroupedByParentCategoryChildCategoriesEntity | null)[] | null;
}
export interface IAllServicesGroupedByParentCategoryOptionsEntity {
    _id: string;
    label: string;
    status: string;
}

export interface IAllServicesGroupedByParentCategoryChildCategoriesEntity {
    _id: string;
    title: string;
    description: string;
    image?: null;
    company_credit: number;
    credit: number;
    options?: (IAllServicesGroupedByParentCategoryOptionsEntity | null)[] | null;
}


