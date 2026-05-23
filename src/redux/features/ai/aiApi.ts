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
      invalidatesTags: ["photo"],
    }),
    reprocessEvent: builder.mutation({
      query: (eventId) => ({
        url: "/ai/reprocess-event",
        method: "POST",
        body: { eventId },
      }),
      invalidatesTags: ["photo"],
    }),
  }),
  overrideExisting: true,
});

export const { useSearchFaceMutation, useReprocessEventMutation } = aiApi;
