import { baseApi } from "../../api/baseApi";
import { updateUserPackage } from "../auth/authSlice";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserDashboard: builder.query({
      query: () => ({
        url: "/users/dashboard",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    selectPackage: builder.mutation({
      query: (body) => ({
        url: "/users/select-package",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const packageId = data.data.packageId;
            dispatch(updateUserPackage({ packageId }));
          }
        } catch (error) {
          console.error("Select package mutation failed:", error);
        }
      },
      invalidatesTags: ["user"],
    }),
    getAllUsersAdmin: builder.query({
      query: () => ({
        url: "/users/admin/users",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    toggleUserActiveAdmin: builder.mutation({
      query: (id) => ({
        url: `/users/admin/users/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["user"],
    }),
    updateUserPackageAdmin: builder.mutation({
      query: ({ id, packageId }) => ({
        url: `/users/admin/users/${id}/update-package`,
        method: "PATCH",
        body: { packageId },
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { 
  useGetUserDashboardQuery, 
  useSelectPackageMutation,
  useGetAllUsersAdminQuery,
  useToggleUserActiveAdminMutation,
  useUpdateUserPackageAdminMutation
} = userApi;
