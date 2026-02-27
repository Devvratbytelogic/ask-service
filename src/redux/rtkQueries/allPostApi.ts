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

  }),
});

export const {
  useUploadPrescriptionMutation,
  useCreateServiceRequestMutation,
} = postApi;
