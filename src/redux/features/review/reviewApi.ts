import { baseApi } from "../../api/baseApi";

export interface IReview {
  id: string;
  name: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  createdAt: string;
}

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query<{ success: boolean; message: string; data: IReview[] }, void>({
      query: () => ({
        url: "/reviews",
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    createReview: builder.mutation<{ success: boolean; message: string; data: IReview }, FormData>({
      query: (formData) => ({
        url: "/reviews",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["review"],
    }),
  }),
});

export const { useGetAllReviewsQuery, useCreateReviewMutation } = reviewApi;
