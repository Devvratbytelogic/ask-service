import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import { IAllTransactionHistoryAPIResponse } from '@/types/allTransactionHistory';
import { IAllRequestsAPIResponse } from '@/types/allRequests';
import { IAllServicesDocumentsRequiredAPIResponse } from '@/types/requiredDocument';
import { IAllVendorReviewsAPIResponse } from '@/types/review';
import { IAllServiceCategoriesAPIResponse } from '@/types/services';
import { ISingleLeadAPIResponse } from '@/types/singleLead';
import { IUserProfileInfoAPIResponse } from '@/types/userProfile';
import { IAllQuotesAPIResponse } from '@/types/allquotes';
import { IVendorAvailableLeadsAPIResponse, IVendorDashboardDataAPIResponse } from '@/types/vendorDashboard';
import { IVendorDashboardTransactionAPIResponse } from '@/types/vendorDashboardTransaction';
import { IAllVendorDocumentsAPIResponse } from '@/types/vendorDocuments';
import { IVendorProfileInfoAPIResponse } from '@/types/vendorProfile';
import type { IUserNotificationAPIResponse } from '@/types/notifications';
import type { IAllCreditsAPIResponse } from '@/types/allCredits';
import { IServiceRequestQuotesAPIResponse } from '@/types/serviceRequestQuotes';
import { IServiceRequestQuotesDetailAPIResponse } from '@/types/serviceReuestQuotesDetails';
import { ISingleServiceAPIResponse } from '@/types/singleService';
import { IAllChatListAPIResponse } from '@/types/allChatList';
import { IAllChatsMessagesAPIResponse } from '@/types/allChatsMessages';
import { IAllTestimonialsAPIResponse } from '@/types/testimonial';
import { IAllFaqsAPIResponse } from '@/types/faqs';
import { IAllServiceQuestionsAPIResponse } from '@/types/serviceQuestions';
import { IPopupNotificationsAPIResponse } from '@/types/popupNotifications';
import { IGlobalSettingsAPIResponse } from '@/types/global';
import { IVendorDetailsAPIResponse } from '@/types/vendorDetails';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        getGlobalSettings: builder.query<IGlobalSettingsAPIResponse, void>({
            query: () => ({
                url: `/user/get-global`,
                method: 'GET',
            }),
        }),
        getServiceCategories: builder.query<IAllServiceCategoriesAPIResponse, void>({
            query: () => ({
                url: `/user/service-categories`,
                method: 'GET',
            }),
        }),
        getServiceCategory: builder.query<ISingleServiceAPIResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/user/service-category/${id}`,
                method: 'GET',
            }),
        }),
        getServicesQuetions: builder.query<IAllServiceQuestionsAPIResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/user/service-questions/${id}`,
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
        getVendorDetailsById: builder.query<IVendorDetailsAPIResponse, { vendorId: string }>({
            query: ({ vendorId }) => ({
                url: `/user/vendor-details/${vendorId}`,
                method: 'GET',
            }),
        }),
        getUserProfileInfo: builder.query<IUserProfileInfoAPIResponse, void>({
            query: () => ({
                url: `/user/get-profile`,
                method: 'GET',
            }),
            providesTags: ['UserProfile'],
        }),
        getUserNotification: builder.query<IUserNotificationAPIResponse, void>({
            query: () => ({
                url: `/user/notification`,
                method: 'GET',
            }),
            providesTags: ['UserNotification'],
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
        getVendorDashboardData: builder.query<IVendorDashboardDataAPIResponse, void>({
            query: () => ({
                url: `/vendor/dashboard`,
                method: 'GET',
            }),
            providesTags: ['VendorDashboard'],
        }),
        getVendorAvailableLeads: builder.query<IVendorAvailableLeadsAPIResponse, { service?: string; sort?: string; page?: number; limit?: number; quoted?: boolean, unlocked?: boolean } | void>({
            query: (arg) => ({
                url: `/vendor/available-leads`,
                method: 'GET',
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
            providesTags: ['VendorAvailableLeads'],
        }),
        getVendorAllQuotes: builder.query<IAllQuotesAPIResponse, void>({
            query: () => ({
                url: `/vendor/all-quotes`,
                method: 'GET',
            }),
            providesTags: ['VendorAllQuotes'],
        }),
        getSingleLead: builder.query<ISingleLeadAPIResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/vendor/leads/${id}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, { id }) => [{ type: 'VendorAvailableLeads', id }],
        }),
        getVendorDashboardTransactionHistory: builder.query<IVendorDashboardTransactionAPIResponse, { page?: number; limit?: number; startDate?: string; endDate?: string } | void>({
            query: (arg) => ({
                url: `/vendor/transactions`,
                method: 'GET',
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
            providesTags: ['VendorTransactions'],
        }),
        getCreditsTransactionHistoryExportCSV: builder.query<Blob, { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string } | void>({
            query: (arg) => ({
                url: `/vendor/all-transaction/export/csv`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
        }),
        getCreditsTransactionHistoryExportPDF: builder.query<Blob, { page?: number; limit?: number; startDate?: string; endDate?: string; status?: string } | void>({
            query: (arg) => ({
                url: `/vendor/all-transaction/export/pdf`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
                ...(arg && typeof arg === 'object' && Object.keys(arg).length > 0 && { params: arg }),
            }),
        }),
        getCreditsTransactionInvoice: builder.query<Blob, { transactionId: string }>({
            query: ({ transactionId }) => ({
                url: `/vendor/credits/invoice/${transactionId}`,
                method: 'GET',
                responseHandler: (response) => response.blob(),
            }),
        }),
        getCreditsPackages: builder.query<IAllCreditsAPIResponse, void>({
            query: () => ({
                url: `/vendor/credits/packages`,
                method: 'GET',
            }),
        }),
        getCreatedServices: builder.query<IAllRequestsAPIResponse, { search?: string | null; service?: string | null; status?: string; fromDate?: string | null; toDate?: string | null; page?: number; limit?: number } | void>({
            query: (arg) => {
                const params: Record<string, string | number> = {
                    page: arg?.page ?? 1,
                    limit: arg?.limit ?? 10,
                };
                if (arg?.status != null && String(arg.status).trim() !== '') params.status = String(arg.status).trim();
                if (arg?.search != null && String(arg.search).trim() !== '') params.search = String(arg.search).trim();
                if (arg?.service != null && String(arg.service).trim() !== '') params.service = String(arg.service).trim();
                if (arg?.fromDate != null && String(arg.fromDate).trim() !== '') params.fromDate = String(arg.fromDate).trim();
                if (arg?.toDate != null && String(arg.toDate).trim() !== '') params.toDate = String(arg.toDate).trim();
                return {
                    url: `/user/get-created-services`,
                    method: 'GET',
                    params,
                };
            },
            providesTags: ['CreatedServices', 'ServiceRequestQuotes'],
        }),
        getServiceRequestQuotes: builder.query<IServiceRequestQuotesAPIResponse, { requestId: string; sort?: string }>({
            query: ({ requestId, sort }) => ({
                url: `/user/service-requests/${requestId}/quotes`,
                method: 'GET',
                ...(sort != null && sort !== '' && { params: { sort } }),
            }),
            providesTags: ['ServiceRequestQuotes'],
        }),
        getServiceRequestQuotesDetail: builder.query<IServiceRequestQuotesDetailAPIResponse, { requestId: string; quoteId: string }>({
            query: ({ requestId, quoteId }) => ({
                url: `/user/service-requests/${requestId}/quotes/${quoteId}`,
                method: 'GET',
            }),
            providesTags: ['ServiceRequestQuotes'],
        }),
        getUserChats: builder.query<IAllChatListAPIResponse, void>({
            query: () => ({
                url: `/user/fetch-chats`,
                method: 'GET',
            }),
            providesTags: ['UserChats'],
        }),
        getUserAllMessages: builder.query<IAllChatsMessagesAPIResponse, { chatId: string; index?: number; limit?: number }>({
            query: ({ chatId, index = 1, limit = 10 }) => ({
                url: `/user/all-messages/${chatId}?index=${index}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['UserChats'],
        }),
        getVendorChats: builder.query<IAllChatListAPIResponse, void>({
            query: () => ({
                url: `/vendor/fetch-chats`,
                method: 'GET',
            }),
            providesTags: ['VendorChats'],
        }),
        getVendorAllMessages: builder.query<IAllChatsMessagesAPIResponse, { chatId: string; index?: number; limit?: number }>({
            query: ({ chatId, index = 1, limit = 10 }) => ({
                url: `/vendor/all-messages/${chatId}?index=${index}&limit=${limit}`,
                method: 'GET',
            }),
            providesTags: ['VendorChats'],
        }),
        getTestimonials: builder.query<IAllTestimonialsAPIResponse, void>({
            query: () => ({
                url: `/user/testimonials`,
                method: 'GET',
            }),
        }),
        getFaqs: builder.query<IAllFaqsAPIResponse, { type?: string } | void>({
            query: (arg) => ({
                url: `/user/faqs`,
                method: 'GET',
                ...(arg?.type != null && arg.type !== '' && { params: { type: arg.type } }),
            }),
        }),
        getVendorNotifications: builder.query<IPopupNotificationsAPIResponse, void>({
            query: () => ({
                url: `/vendor/notification/all`,
                method: 'GET',
            }),
            providesTags: ['VendorNotifications'],
        }),
        getUserNotifications: builder.query<IPopupNotificationsAPIResponse, void>({
            query: () => ({
                url: `/user/notification/all`,
                method: 'GET',
            }),
            providesTags: ['UserNotifications'],
        }),
    }),
});

export const {
    useGetGlobalSettingsQuery,
    useGetServiceCategoriesQuery,
    useGetServiceCategoryQuery,
    useGetServicesQuetionsQuery,
    useGetAllServicesQuery,
    useGetAllServicesDocumentsRequiredQuery,
    useGetVendorProfileInfoQuery,
    useGetVendorDetailsByIdQuery,
    useGetUserProfileInfoQuery,
    useGetUserNotificationQuery,
    useGetAllVendorDocumentsQuery,
    useGetAllVendorReviewsQuery,
    useGetAllTransactionHistoryQuery,
    useGetTransactionHistoryExportCSVQuery,
    useGetTransactionHistoryExportPDFQuery,
    useLazyGetTransactionHistoryExportCSVQuery,
    useLazyGetTransactionHistoryExportPDFQuery,
    useGetVendorDashboardDataQuery,
    useGetVendorAvailableLeadsQuery,
    useGetVendorAllQuotesQuery,
    useGetSingleLeadQuery,
    useGetVendorDashboardTransactionHistoryQuery,
    useLazyGetCreditsTransactionHistoryExportCSVQuery,
    useLazyGetCreditsTransactionHistoryExportPDFQuery,
    useLazyGetCreditsTransactionInvoiceQuery,
    useGetCreditsPackagesQuery,
    useGetCreatedServicesQuery,
    useGetServiceRequestQuotesQuery,
    useGetServiceRequestQuotesDetailQuery,
    // User Chat APIs
    useGetUserChatsQuery,
    useGetUserAllMessagesQuery,
    // Vendor Chat APIs
    useGetVendorChatsQuery,
    useGetVendorAllMessagesQuery,
    useGetTestimonialsQuery,
    useGetFaqsQuery,
    useGetVendorNotificationsQuery,
    useGetUserNotificationsQuery,
} = clientSideGetApis;
