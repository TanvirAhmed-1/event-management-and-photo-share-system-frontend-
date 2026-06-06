import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setToken } from "../features/auth/authSlice";
import { removeTokenCookie } from "../server/storeCookies";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ;
    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    });

    let result = await rawBaseQuery(args, api, extraOptions);

    if (result?.error) {
      if (result.error.status === 401) {
        // Clear token and logout
        api.dispatch(logout());
        await removeTokenCookie();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Unexpected API Error:", error);
    return {
      error: { status: "FETCH_ERROR", data: "Unexpected error occurred" },
    };
  }
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: dynamicBaseQuery,
  tagTypes: ["user", "package", "event", "photo", "ai", "review"],
  endpoints: () => ({}),
});
