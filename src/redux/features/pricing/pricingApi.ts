import { baseApi } from "../../api/baseApi";

export interface PricingCalculationPayload {
  guestCount: number;
  services: { serviceId: string; quantity?: number; durationHours?: number; durationDays?: number }[];
  foodItems: { foodItemId: string; customServingCount?: number }[];
}

const pricingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    calculatePricePreview: builder.mutation({
      query: (body: PricingCalculationPayload) => ({
        url: "/pricing/preview",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useCalculatePricePreviewMutation } = pricingApi;

