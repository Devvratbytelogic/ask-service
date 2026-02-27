import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';


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
    }),
});

export const {
    useLoginMutation,
    useLoginPhoneEmailMutation,
    useVerifyPhoneMutation,
    useVerifyEmailMutation,
    useResendPhoneOtpMutation,
    useResendEmailVerificationMutation,
    useForgotPasswordMutation,
    useNewPasswordMutation,
    useSignupMutation,

    useVendorRegisterMutation,
    useVendorVerifyOtpMutation,
    useVendorResendOtpMutation,
    useVendorNewPasswordMutation,
} = authApi;
