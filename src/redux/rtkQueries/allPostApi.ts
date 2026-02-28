import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';
import type { VendorNotificationPreferencesPayload } from '@/types/notifications';

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
      query: (formData) => ({
        url: `/user/notification`,
        method: 'PUT',
        body: formData,
      }),
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
  }),
});

export const {
  useUploadPrescriptionMutation,
  useCreateServiceRequestMutation,
  useUpdateVendorServicesMutation,
  useUploadVendorDocumentsMutation,
  useUpdateVendorProfileInfoMutation,
  useChangeVendorPasswordMutation,
  useChangeUserPasswordMutation,
  useDeleteVendorAccountMutation,
  useDeleteUserAccountMutation,
  useVendorNotificationPreferencesMutation,
  useUserNotificationPreferencesMutation,
  useVendorLeaveReviewMutation,
  useUnlockLeadMutation,
  useSubmitQuoteMutation,
} = postApi;
