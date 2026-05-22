import { baseApi } from "../../api/baseApi";

const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    searchFace: builder.mutation({
      query: (formData) => ({
        url: "/ai/search-face",
        method: "POST",
        body: formData,
        // RTK Query automatically sets standard multi-part boundary headers for FormData
      }),
      invalidatesTags: ["ai"],
    }),
  }),
});

export const { useSearchFaceMutation } = aiApi;
