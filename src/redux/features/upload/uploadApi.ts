import { baseApi } from "../../api/baseApi";

const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadSingleImage: builder.mutation<
      {
        success: boolean;
        data: { url: string; publicId: string };
      },
      FormData
    >({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
      }),
    }),
    uploadMultipleImages: builder.mutation<
      {
        success: boolean;
        data: {
          urls: string[];
          files: { url: string; publicId: string }[];
        };
      },
      FormData
    >({
      query: (formData) => ({
        url: "/upload/images",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
} = uploadApi;
