import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';
import Cookies from "js-cookie";
import { addToast } from '@heroui/react';
import { API_BASE_URL } from '@/utils/config';
import { getAndClearResetTokenForNextRequest, isUnauthorizedError } from '@/utils/authCookies';

const mutex = new Mutex();

interface IAPIResponse<T = unknown> {
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
    baseUrl: API_BASE_URL,
    prepareHeaders: async (headers) => {
        const resetToken = getAndClearResetTokenForNextRequest()
        const token = resetToken ?? Cookies.get("auth_token") ?? null
        const deviceId = Cookies.get("device") || ''
        const userId = Cookies.get("userID") || ''
        const userRole = Cookies.get("user_role") || ''
        headers.set('device', deviceId);
        headers.set('userID', userId);
        if (userRole) headers.set('user_role', userRole);
        headers.set('Authorization', `Bearer ${token}`);
        return headers;
    },
});


//  with all response data
const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    IAPIResponse,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock();
    try {
        const result = await baseQuery(args, api, extraOptions);
        const res = result.data as IAPIResponse;
        if (result.error) {
            const errorData = result.error as IAPIError & { status?: number; data?: { data?: { flow?: string }; message?: string } };
            const status = errorData?.status;
            const responseData = errorData?.data;
            const message = (responseData as { message?: string })?.message || "Unknown API error";
            // Let login handle 403 EMAIL_VERIFICATION_REQUIRED by returning the response body
            if (status === 403 && responseData?.data?.flow === 'EMAIL_VERIFICATION_REQUIRED') {
                return { data: responseData as IAPIResponse };
            }
            console.error(`API: ${args}, Failed to fetch data`);
            return {
                error: {
                    status: "CUSTOM_ERROR",
                    data: { message, httpStatus: status },
                    error: message,
                },
            };
        } else {
            return { data: res };
        }

    } catch (error: unknown) {
        let errorResponse: FetchBaseQueryError;
        if (error instanceof Error) {
            errorResponse = {
                status: "CUSTOM_ERROR",
                data: { message: error.message },
                error: error.message,
            };
            if (!isUnauthorizedError(error.message)) {
                addToast({ title: errorResponse?.error, color: 'danger', timeout: 2000 });
            }
        } else {
            errorResponse = {
                status: "CUSTOM_ERROR",
                data: { message: "An unexpected error occurred" },
                error: "Unknown error",
            };
        }

        return { error: errorResponse };
    }
};



export const rtkQuerieSetup = createApi({
    reducerPath: 'RTKServices',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['UserProfile', 'UserNotification', 'VendorProfile', 'VendorDocuments', 'VendorReviews', 'VendorAvailableLeads', 'VendorDashboard', 'VendorTransactions', 'VendorAllQuotes', 'CreatedServices', 'ServiceRequestQuotes'],
    endpoints: () => ({}),
});