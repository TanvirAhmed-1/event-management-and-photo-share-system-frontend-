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
  }),
});

export const { useGetAllPackagesQuery } = packageApi;
