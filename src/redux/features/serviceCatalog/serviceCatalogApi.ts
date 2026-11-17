import { baseApi } from "../../api/baseApi";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  icon?: string;
  displayOrder?: number;
  order?: number;
  isActive?: boolean;
  services?: ServiceItem[];
}

export interface ServicePackageItem {
  id: string;
  serviceId: string;
  vendorId?: string | null;
  name: string;
  description?: string | null;
  pricingModel: "FIXED" | "PER_PERSON" | "PER_HOUR" | "PER_DAY" | "PER_UNIT" | "CUSTOM_QUOTATION";
  price?: number | null;
  features: string[];
  isActive: boolean;
}

export interface ServiceItem {
  id: string;
  categoryId?: string | null;
  category?: ServiceCategory | null;
  name: string;
  slug: string;
  description?: string | null;
  pricingModel: "FIXED" | "PER_PERSON" | "PER_HOUR" | "PER_DAY" | "PER_UNIT" | "CUSTOM_QUOTATION";
  basePrice?: number | null;
  unitLabel?: string | null;
  minQuantity?: number;
  maxQuantity?: number | null;
  minHours?: number | null;
  maxHours?: number | null;
  minDays?: number | null;
  maxDays?: number | null;
  minGuests?: number;
  maxGuests?: number;
  isVendorBased?: boolean;
  isActive: boolean;
  coverImage?: string;
  images?: string[];
  aiPhotoShareMode?: "NONE" | "INCLUDED" | "ADDON";
  aiAddonPrice?: number | null;
  defaultStoragePlanId?: string | null;
  packages?: ServicePackageItem[];
  _count?: { eventTypes?: number };
}

const serviceCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<
      { success: boolean; data: ServiceCategory[] },
      { includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: params?.includeInactive
          ? "/services/categories?includeInactive=true"
          : "/services/categories",
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
    getAllServices: builder.query<
      { success: boolean; data: ServiceItem[] },
      { includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: params?.includeInactive
          ? "/services?includeInactive=true"
          : "/services",
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
    createServicePackage: builder.mutation({
      query: (body) => ({
        url: "/services/packages",
        method: "POST",
        body,
      }),
      invalidatesTags: ["service"],
    }),
    updateServicePackage: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/services/packages/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["service"],
    }),
    deleteServicePackage: builder.mutation({
      query: (id) => ({
        url: `/services/packages/${id}`,
        method: "DELETE",
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
  useCreateServicePackageMutation,
  useUpdateServicePackageMutation,
  useDeleteServicePackageMutation,
} = serviceCatalogApi;
