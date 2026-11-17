import { baseApi } from "../../api/baseApi";

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  icon?: string | null;
  displayOrder?: number;
  order?: number;
  isActive?: boolean;
  items?: FoodItem[];
}

export interface FoodItem {
  id: string;
  categoryId: string;
  category?: FoodCategory | null;
  name: string;
  slug: string;
  description?: string | null;
  pricePerPerson: number;
  isVegetarian?: boolean;
  minGuests?: number;
  minOrderQuantity?: number;
  maxOrderQuantity?: number | null;
  allowQuantityOverride?: boolean;
  isActive: boolean;
  coverImage?: string | null;
  images?: string[];
  dietaryLabels?: string[];
}

const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFoodCategories: builder.query<
      { success: boolean; data: FoodCategory[] },
      { includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: params?.includeInactive
          ? "/food/categories?includeInactive=true"
          : "/food/categories",
        method: "GET",
      }),
      providesTags: ["food"],
    }),
    createFoodCategory: builder.mutation({
      query: (body) => ({
        url: "/food/categories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["food"],
    }),
    getAllFoodItems: builder.query<
      { success: boolean; data: FoodItem[] },
      { includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: params?.includeInactive
          ? "/food/items?includeInactive=true"
          : "/food/items",
        method: "GET",
      }),
      providesTags: ["food"],
    }),
    getFoodByEventType: builder.query<{ success: boolean; data: any[] }, string>({
      query: (eventTypeId) => ({
        url: `/food/assignments/${eventTypeId}`,
        method: "GET",
      }),
      providesTags: ["food"],
    }),
    createFoodItem: builder.mutation({
      query: (body) => ({
        url: "/food/items",
        method: "POST",
        body,
      }),
      invalidatesTags: ["food"],
    }),
    updateFoodItem: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/food/items/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["food"],
    }),
    deleteFoodItem: builder.mutation({
      query: (id) => ({
        url: `/food/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["food"],
    }),
    toggleActiveFoodItem: builder.mutation({
      query: (id) => ({
        url: `/food/items/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["food"],
    }),
  }),
});

export const {
  useGetAllFoodCategoriesQuery,
  useCreateFoodCategoryMutation,
  useGetAllFoodItemsQuery,
  useGetFoodByEventTypeQuery,
  useCreateFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation,
  useToggleActiveFoodItemMutation,
} = foodApi;
