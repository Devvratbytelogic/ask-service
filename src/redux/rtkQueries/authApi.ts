import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';

export interface IGoogleLoginAPIResponse {
    http_status_code: number;
    status: boolean;
    data: unknown;
    timestamp: string;
    message: string;
}

export const authApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        // Shared login / forgot-password flow (customers and vendors)
        login: builder.mutation({
            query: (formData) => ({
                url: `/user/login`,
                method: 'POST',
                body: formData,
            }),
        }),

        loginPhoneEmail: builder.mutation({
            query: (formData) => ({
                url: `/user/login-phone-email`,
                method: 'POST',
                body: formData,
            }),
        }),

        verifyPhone: builder.mutation({
            query: (formData) => ({
                url: `/user/verify-phone`,
                method: 'POST',
                body: formData,
            }),
        }),

        verifyEmail: builder.mutation({
            query: (formData) => ({
                url: `/user/verify-email`,
                method: 'POST',
                body: formData,
            }),
        }),

        resendPhoneOtp: builder.mutation({
            query: (formData) => ({
                url: `/user/resend-phone-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        /** Send phone OTP when user completed Google login but phone verification is required (403 PHONE_VERIFICATION_REQUIRED). */
        resendPhoneOtpGoogleLogin: builder.mutation({
            query: (formData: { phone: string; email: string }) => ({
                url: `/user/google-login-send-phone-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        resendEmailVerification: builder.mutation({
            query: (formData) => ({
                url: `/user/resend-email-verification`,
                method: 'POST',
                body: formData,
            }),
        }),

        forgotPassword: builder.mutation({
            query: (formData) => ({
                url: `/user/forgot-password`,
                method: 'POST',
                body: formData,
            }),
        }),

        newPassword: builder.mutation({
            query: (formData) => ({
                url: `/user/new-password`,
                method: 'PUT',
                body: formData,
            }),
        }),

        signup: builder.mutation({
            query: (formData) => ({
                url: `/user/signup`,
                method: 'POST',
                body: formData,
            }),
        }),

        // Vendor signup (login/forgot use user APIs above)
        vendorRegister: builder.mutation({
            query: (formData) => ({
                url: `/vendor/register`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorVerifyOtp: builder.mutation({
            query: (formData) => ({
                url: `/vendor/verify-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorResendOtp: builder.mutation({
            query: (formData) => ({
                url: `/vendor/resend-otp`,
                method: 'POST',
                body: formData,
            }),
        }),
        
        vendorNewPassword: builder.mutation({
            query: (formData) => ({
                url: `/vendor/new-password`,
                method: 'PUT',
                body: formData,
            }),
        }),

        googleLogin: builder.mutation<IGoogleLoginAPIResponse, { idToken: string; role_type: 'User' | 'Vendor' }>({
            query: ({ idToken, role_type }) => ({
                url: `/user/google-login`,
                method: 'POST',
                body: { idToken, role_type },
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLoginPhoneEmailMutation,
    useVerifyPhoneMutation,
    useVerifyEmailMutation,
    useResendPhoneOtpMutation,
    useResendPhoneOtpGoogleLoginMutation,
    useResendEmailVerificationMutation,
    useForgotPasswordMutation,
    useNewPasswordMutation,
    useSignupMutation,
    useGoogleLoginMutation,

    useVendorRegisterMutation,
    useVendorVerifyOtpMutation,
    useVendorResendOtpMutation,
    useVendorNewPasswordMutation,
} = authApi;
