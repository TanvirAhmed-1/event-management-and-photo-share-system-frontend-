import { baseApi } from "../../api/baseApi";

export interface FoodCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  order: number;
  items?: FoodItem[];
}

export interface FoodItem {
  id: string;
  categoryId: string;
  category?: FoodCategory;
  name: string;
  slug: string;
  description?: string;
  pricePerPerson: number;
  isVegetarian: boolean;
  minGuests?: number;
  isActive: boolean;
  coverImage?: string;
}

const foodApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFoodCategories: builder.query<{ success: boolean; data: FoodCategory[] }, void>({
      query: () => ({
        url: "/food/categories",
        method: "GET",
      }),
      providesTags: ["food"],
    }),
    getAllFoodItems: builder.query<{ success: boolean; data: FoodItem[] }, void>({
      query: () => ({
        url: "/food/items",
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
  useGetAllFoodItemsQuery,
  useGetFoodByEventTypeQuery,
  useCreateFoodItemMutation,
  useUpdateFoodItemMutation,
  useDeleteFoodItemMutation,
  useToggleActiveFoodItemMutation,
} = foodApi;

