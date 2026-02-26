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
    
  }),
});

export const {
  useUploadPrescriptionMutation,
} = postApi;
