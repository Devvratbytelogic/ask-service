import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';


export const authApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        // Customer auth APIs
        login: builder.mutation({
            query: (formData) => ({
                url: `/login`,
                method: 'POST',
                body: formData,
            }),
        }),

        signup: builder.mutation({
            query: (formData) => ({
                url: `/signup`,
                method: 'POST',
                body: formData,
            }),
        }),

        verifyPhoneLogin: builder.mutation({
            query: (formData) => ({
                url: `/user/verify-phone-login`,
                method: 'POST',
                body: formData,
            }),
        }),

        resendPhoneOtp: builder.mutation({
            query: (formData) => ({
                url: `/resend-phone-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        resendEmailVerification: builder.mutation({
            query: (formData) => ({
                url: `/resend-email-verification`,
                method: 'POST',
                body: formData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useVerifyPhoneLoginMutation,
    useResendPhoneOtpMutation,
    useResendEmailVerificationMutation,
} = authApi;
