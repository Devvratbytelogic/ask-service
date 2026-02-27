import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import { IAllServiceCategoriesAPIResponse } from '@/types/services';

export const clientSideGetApis = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        getServiceCategories: builder.query<IAllServiceCategoriesAPIResponse, void>({
            query: () => ({
                url: `/user/service-categories`,
                method: 'GET',
            }),
        }),

    }),
});

export const {
    useGetServiceCategoriesQuery,
} = clientSideGetApis;
