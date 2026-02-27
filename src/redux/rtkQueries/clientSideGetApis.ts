import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import { IAllServicesDocumentsRequiredAPIResponse } from '@/types/requiredDocument';
import { IAllServiceCategoriesAPIResponse } from '@/types/services';

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

    }),
});

export const {
    useGetServiceCategoriesQuery,
    useGetAllServicesQuery,
    useGetAllServicesDocumentsRequiredQuery,
} = clientSideGetApis;
