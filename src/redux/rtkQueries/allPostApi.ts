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
      invalidatesTags: ['VendorAvailableLeads'],
    }),
    submitQuote: builder.mutation({
      query: ({ leadId, formData }: { leadId: string; formData: FormData }) => ({
        url: `/vendor/leads/${leadId}/quotes`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['VendorAvailableLeads'],
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
      invalidatesTags: ['ServiceRequestQuotes'],
    }),
  }),
});

export const {
  useUploadPrescriptionMutation,
  useCreateServiceRequestMutation,
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
} = postApi;
