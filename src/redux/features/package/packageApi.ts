import { baseApi } from "../../api/baseApi";

const packageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPackages: builder.query({
      query: () => ({
        url: "/packages",
        method: "GET",
      }),
      providesTags: ["package"],
    }),
    createPackage: builder.mutation({
      query: (body) => ({
        url: "/packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["package"],
    }),
    updatePackage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/packages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["package"],
    }),
    deletePackage: builder.mutation({
      query: (id) => ({
        url: `/packages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["package"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packageApi;
