import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import type { UserNotificationPreferencesPayload, VendorNotificationPreferencesPayload } from '@/types/notifications';

export const postApi = rtkQuerieSetup.injectEndpoints({
  endpoints: (builder) => ({
    uploadPrescription: builder.mutation({
      query: (value) => ({
        url: `/upload-prescription`,
        method: 'POST',
        body: value,
      }),
    }),
    createServiceRequest: builder.mutation({
      query: (value) => ({
        url: `/user/service-request`,
        method: 'POST',
        body: value,
      }),
      invalidatesTags: ['CreatedServices'],
    }),
    updateServiceRequest: builder.mutation({
      query: ({ id, value }) => ({
        url: `/user/service-request/${id}`,
        method: 'PUT',
        body: value,
      }),
      invalidatesTags: ['CreatedServices'],
    }),
    updateVendorServices: builder.mutation({
      query: (value) => ({
        url: `/vendor/update-service-data`,
        method: 'PUT',
        body: value,
      }),
    }),
    uploadVendorDocuments: builder.mutation({
      query: (formData) => ({
        url: `/vendor/upload-service-selection-document`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['VendorDocuments'],
    }),
    updateVendorProfileInfo: builder.mutation({
      query: (formData) => ({
        url: `/vendor/update-profile`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    updateUserProfileInfo: builder.mutation({
      query: (formData) => ({
        url: `/user/update-profile`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['UserProfile'],
    }),
    changeVendorPassword: builder.mutation({
      query: (formData) => ({
        url: `/vendor/change-password`,
        method: 'PUT',
        body: formData,
      }),
    }),
    changeUserPassword: builder.mutation({
      query: (formData) => ({
        url: `/user/change-password`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteVendorAccount: builder.mutation({
      query: (formData) => ({
        url: `/vendor/delete-account`,
        method: 'PUT',
        body: formData,
      }),
    }),
    deleteUserAccount: builder.mutation({
      query: (formData) => ({
        url: `/user/delete-account`,
        method: 'PUT',
        body: formData,
      }),
    }),
    vendorNotificationPreferences: builder.mutation({
      query: (payload: VendorNotificationPreferencesPayload) => ({
        url: `/vendor/notification`,
        method: 'PUT',
        body: payload,
      }),
    }),
    userNotificationPreferences: builder.mutation({
      query: (payload: UserNotificationPreferencesPayload) => ({
        url: `/user/notification`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['UserNotification'],
    }),
    vendorLeaveReview: builder.mutation({
      query: (formData) => ({
        url: `/vendor/leave-review`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['VendorReviews'],
    }),
    unlockLead: builder.mutation({
      query: (leadId: string) => ({
        url: `/vendor/leads/${leadId}/unlock`,
        method: 'POST',
      }),
      invalidatesTags: ['VendorAvailableLeads', 'VendorDashboard'],
    }),
    submitQuote: builder.mutation({
      query: ({ leadId, formData }: { leadId: string; formData: FormData }) => ({
        url: `/vendor/leads/${leadId}/quotes`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['VendorAvailableLeads', 'VendorDashboard', 'VendorAllQuotes'],
    }),
    closeServiceRequest: builder.mutation({
      query: ({ id, body }: { id: string; body: { reason: string; reason_comment: string } }) => ({
        url: `/user/close-service-request/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['CreatedServices'],
    }),
    ignoreQuote: builder.mutation({
      query: ({ requestId, quoteId }: { requestId: string; quoteId: string }) => ({
        url: `/user/service-requests/${requestId}/quotes/${quoteId}/ignore`,
        method: 'POST',
      }),
      // invalidatesTags: ['ServiceRequestQuotes'],
      invalidatesTags: ['CreatedServices']
    }),
    postContactUs: builder.mutation({
      query: (payload: { name: string; email: string; message: string }) => ({
        url: `/user/post-contact-us`,
        method: 'POST',
        body: payload,
      }),
    }),
    purchaseCredits: builder.mutation<unknown, { package_id: string }>({
      query: (payload) => ({
        url: `/vendor/credits/purchase`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['VendorTransactions', 'VendorDashboard'],
    }),
    // User Chat APIs
    userSendMessage: builder.mutation({
      query: (body) => ({
        url: `/user/send-msg`,
        method: 'POST',
        body,
      }),
      // No invalidatesTags: cache is updated manually in useChatSocket.addSentMessageToCache
    }),
    userAccessChat: builder.mutation({
      query: (body) => ({
        url: `/user/access-chat`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserChats'],
    }),
    // Vendor Chat APIs
    vendorSendMessage: builder.mutation({
      query: (body) => ({
        url: `/vendor/send-msg`,
        method: 'POST',
        body,
      }),
      // No invalidatesTags: cache is updated manually in useChatSocket.addSentMessageToCache
    }),
    vendorAccessChat: builder.mutation({
      query: (body) => ({
        url: `/vendor/access-chat`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['VendorChats'],
    }),

    stripePayment: builder.mutation({
      query: (body) => ({
        url: `/vendor/stipe-checkout`,
        method: 'POST',
        body,
      }),
    }),
    verifyStripePayment: builder.mutation({
      query: ({ transactionId }) => ({
        url: `/vendor/verify-payment/${transactionId}`,
        method: 'PUT',
      }),
      invalidatesTags: ['VendorTransactions', 'VendorDashboard'],
    }),
  }),
});

export const {
  useUploadPrescriptionMutation,
  useCreateServiceRequestMutation,
  useUpdateServiceRequestMutation,
  useUpdateVendorServicesMutation,
  useUploadVendorDocumentsMutation,
  useUpdateVendorProfileInfoMutation,
  useUpdateUserProfileInfoMutation,
  useChangeVendorPasswordMutation,
  useChangeUserPasswordMutation,
  useDeleteVendorAccountMutation,
  useDeleteUserAccountMutation,
  useVendorNotificationPreferencesMutation,
  useUserNotificationPreferencesMutation,
  useVendorLeaveReviewMutation,
  useUnlockLeadMutation,
  useSubmitQuoteMutation,
  useCloseServiceRequestMutation,
  useIgnoreQuoteMutation,
  usePostContactUsMutation,
  usePurchaseCreditsMutation,
  // User Chat APIs
  useUserSendMessageMutation,
  useUserAccessChatMutation,
  // Vendor Chat APIs
  useVendorSendMessageMutation,
  useVendorAccessChatMutation,
  useStripePaymentMutation,
  useVerifyStripePaymentMutation,
} = postApi;
