import { baseApi } from "../../api/baseApi";
import { setTokenCookie } from "../../server/storeCookies";
import { login } from "./authSlice";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const token = data.data.accessToken;
            const user = data.data.user;
            dispatch(login({ user, token }));
            await setTokenCookie(token);
          }
        } catch (error) {
          console.error("Login mutation failed:", error);
        }
      },
      invalidatesTags: ["user"],
    }),
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success && data.data) {
            const token = data.data.accessToken;
            const user = data.data.user;
            dispatch(login({ user, token }));
            await setTokenCookie(token);
          }
        } catch (error) {
          console.error("Registration mutation failed:", error);
        }
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
