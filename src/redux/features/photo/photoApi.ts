import { baseApi } from "../../api/baseApi";

const photoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPhotosByEvent: builder.query({
      query: (eventId) => ({
        url: `/photos/event/${eventId}`,
        method: "GET",
      }),
      providesTags: ["photo"],
    }),
    uploadPhotos: builder.mutation({
      query: (formData) => ({
        url: "/photos/upload",
        method: "POST",
        body: formData,
        // RTK Query automatically formats FormData request headers
      }),
      invalidatesTags: ["photo", "event", "user"],
    }),
    deletePhoto: builder.mutation({
      query: (id) => ({
        url: `/photos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["photo", "event", "user"],
    }),
  }),
});

export const {
  useGetPhotosByEventQuery,
  useUploadPhotosMutation,
  useDeletePhotoMutation,
} = photoApi;
