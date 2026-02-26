import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';


export const authApi = rtkQuerieSetup.injectEndpoints({
    endpoints: (builder) => ({
        // Customer auth APIs
        login: builder.mutation({
            query: (formData) => ({
                url: `/user/login`,
                method: 'POST',
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

        verifyPhoneLogin: builder.mutation({
            query: (formData) => ({
                url: `/user/verify-phone-login`,
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

        resendEmailVerification: builder.mutation({
            query: (formData) => ({
                url: `/user/resend-email-verification`,
                method: 'POST',
                body: formData,
            }),
        }),




        // Vendor auth APIs
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

        vendorLogin: builder.mutation({
            query: (formData) => ({
                url: `/vendor/login`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorVerifyForgotPasswordOtp: builder.mutation({
            query: (formData) => ({
                url: `/vendor/verify-forgot-password-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorForgotPassword: builder.mutation({
            query: (formData) => ({
                url: `/vendor/forgot-password`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorResendPhoneEmailOtp: builder.mutation({
            query: (formData) => ({
                url: `/vendor/resend-phone-email-otp`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorResetPassword: builder.mutation({
            query: (formData) => ({
                url: `/vendor/reset-password`,
                method: 'POST',
                body: formData,
            }),
        }),

        vendorChangePassword: builder.mutation({
            query: (formData) => ({
                url: `/vendor/change-password`,
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




    // Vendor auth APIs
    useVendorRegisterMutation,
    useVendorVerifyOtpMutation,
    useVendorResendOtpMutation,
    useVendorLoginMutation,
    useVendorVerifyForgotPasswordOtpMutation,
    useVendorForgotPasswordMutation,
    useVendorResendPhoneEmailOtpMutation,
    useVendorResetPasswordMutation,
    useVendorChangePasswordMutation,
} = authApi;
