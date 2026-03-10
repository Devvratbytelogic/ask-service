/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import { GEO_LOCATION_API } from '@/utils/config';

const mutex = new Mutex();

interface IAPIResponse<T = any> {
    http_status_code: number;
    status: boolean;
    data: T;
    timestamp: string;
    message: string;
}

interface IAPIError {
    data: {
        message?: string;
    };
    error?: string;
}


const baseQuery = fetchBaseQuery({
    baseUrl: GEO_LOCATION_API,
    prepareHeaders: async (headers,) => {
        return headers;
    },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, IAPIResponse<any>, FetchBaseQueryError> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    try {
        const result = await baseQuery(args, api, extraOptions);
        const res = result.data as IAPIResponse<any>;
        if (result.error) {
            const errorData = result.error as IAPIError;
            throw new Error(errorData?.data?.message)
        } else {
            return { data: res };
        }
    } catch (error: any) {
        return { error: error.message || 'error geo' };
    }
};

export const geoLocationApiService = createApi({
    reducerPath: 'geoLocationApiService',
    baseQuery: baseQueryWithAuth,
    endpoints: () => ({}),
});
