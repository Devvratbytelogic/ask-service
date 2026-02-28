import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import { IAllTransactionHistoryAPIResponse } from '@/types/allTransactionHistory';
import { IAllServicesDocumentsRequiredAPIResponse } from '@/types/requiredDocument';
import { IAllVendorReviewsAPIResponse } from '@/types/review';
import { IAllServiceCategoriesAPIResponse } from '@/types/services';
import { IAllVendorDocumentsAPIResponse } from '@/types/vendorDocuments';
import { IVendorProfileInfoAPIResponse } from '@/types/vendorProfile';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        getServiceCategories: builder.query<IAllServiceCategoriesAPIResponse, void>({
            query: () => ({
                url: `/user/service-categories`,
                method: 'GET',
            }),
        }),
        getAllServices: builder.query<IAllServiceCategoriesAPIResponse, void>({
            query: () => ({
                url: `/vendor/get-all-services`,
                method: 'GET',
            }),
        }),
        getAllServicesDocumentsRequired: builder.query<IAllServicesDocumentsRequiredAPIResponse, void>({
            query: () => ({
                url: `/vendor/get-all-services-document-required`,
                method: 'GET',
            }),
        }),
        getVendorProfileInfo: builder.query<IVendorProfileInfoAPIResponse, void>({
            query: () => ({
                url: `/vendor/get-profile`,
                method: 'GET',
            }),
            providesTags: ['VendorProfile'],
        }),
        getAllVendorDocuments: builder.query<IAllVendorDocumentsAPIResponse, void>({
            query: () => ({
                url: `/vendor/verification-documents`,
                method: 'GET',
            }),
            providesTags: ['VendorDocuments'],
        }),
        getAllVendorReviews: builder.query<IAllVendorReviewsAPIResponse, void>({
            query: () => ({
                url: `/vendor/all-review`,
                method: 'GET',
            }),
            providesTags: ['VendorReviews'],
        }),
        getAllTransactionHistory: builder.query<IAllTransactionHistoryAPIResponse, { page?: number; limit?: number; startDate?: string; endDate?: string } | void>({
            query: (arg) => ({
                url: `/vendor/all-transaction`,
                method: 'GET',
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
        }),
        getTransactionHistoryExportCSV: builder.query<Blob, { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string } | void>({
            query: (arg) => ({
                url: `/vendor/all-transaction/export/csv`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
        }),
        getTransactionHistoryExportPDF: builder.query<Blob, { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string } | void>({
            query: (arg) => ({
                url: `/vendor/all-transaction/export/pdf`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
        }),
    }),
});

export const {
    useGetServiceCategoriesQuery,
    useGetAllServicesQuery,
    useGetAllServicesDocumentsRequiredQuery,
    useGetVendorProfileInfoQuery,
    useGetAllVendorDocumentsQuery,
    useGetAllVendorReviewsQuery,
    useGetAllTransactionHistoryQuery,
    useGetTransactionHistoryExportCSVQuery,
    useGetTransactionHistoryExportPDFQuery,
    useLazyGetTransactionHistoryExportCSVQuery,
    useLazyGetTransactionHistoryExportPDFQuery,
} = clientSideGetApis;
