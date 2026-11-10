import { baseApi } from "../../api/baseApi";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  services?: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  category?: ServiceCategory;
  name: string;
  slug: string;
  description?: string;
  pricingModel: "FIXED" | "PER_PERSON" | "PER_HOUR" | "PER_DAY" | "PER_UNIT" | "CUSTOM_QUOTATION";
  basePrice: number;
  minGuests?: number;
  maxGuests?: number;
  isActive: boolean;
  coverImage?: string;
}

const serviceCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<{ success: boolean; data: ServiceCategory[] }, void>({
      query: () => ({
        url: "/services/categories",
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    createCategory: builder.mutation({
      query: (body) => ({
        url: "/services/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["service"],
    }),
    getAllServices: builder.query<{ success: boolean; data: ServiceItem[] }, void>({
      query: () => ({
        url: "/services",
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    getServicesByEventType: builder.query<{ success: boolean; data: any[] }, string>({
      query: (eventTypeId) => ({
        url: `/services/assignments/${eventTypeId}`,
        method: "GET",
      }),
      providesTags: ["service"],
    }),
    createService: builder.mutation({
      query: (body) => ({
        url: "/services",
        method: "POST",
        body,
      }),
      invalidatesTags: ["service"],
    }),
    updateService: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["service"],
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["service"],
    }),
    toggleActiveService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["service"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useGetAllServicesQuery,
  useGetServicesByEventTypeQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useToggleActiveServiceMutation,
} = serviceCatalogApi;

