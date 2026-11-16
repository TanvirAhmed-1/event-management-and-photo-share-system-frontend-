import { baseApi } from "../../api/baseApi";

export interface PlatformSettings {
  id: string;
  maxEventsPerDay: number;
  allowSameDateRequests: boolean;
  warnAdminOnSameDate: boolean;
  serviceCities: string[];
  updatedAt: string;
}

const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPlatformSettings: builder.query<{ success: boolean; data: PlatformSettings }, void>({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
      providesTags: ["settings"],
    }),
    updatePlatformSettings: builder.mutation<
      { success: boolean; data: PlatformSettings },
      Partial<
        Pick<
          PlatformSettings,
          "maxEventsPerDay" | "allowSameDateRequests" | "warnAdminOnSameDate" | "serviceCities"
        >
      >
    >({
      query: (body) => ({
        url: "/settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["settings", "event"],
    }),
  }),
});

export const { useGetPlatformSettingsQuery, useUpdatePlatformSettingsMutation } = settingsApi;
