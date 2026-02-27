import { rtkQuerieSetup } from '@/redux/services/rtkQuerieSetup';

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
      query: (value) => ({
        url: `/vendor/upload-service-selection-document`,
        method: 'POST',
        body: value,
      }),
    }),

  }),
});

export const {
  useUploadPrescriptionMutation,
  useCreateServiceRequestMutation,
  useUpdateVendorServicesMutation,
  useUploadVendorDocumentsMutation,
} = postApi;
