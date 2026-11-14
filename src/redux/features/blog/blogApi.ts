import { baseApi } from "../../api/baseApi";

export const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBlogs: builder.query<
      any,
      { includeDrafts?: boolean; category?: string; search?: string } | void
    >({
      query: (params) => {
        const query = new URLSearchParams();
        if (params?.includeDrafts) query.set("includeDrafts", "true");
        if (params?.category && params.category !== "all") {
          query.set("category", params.category);
        }
        if (params?.search) query.set("search", params.search);
        const qs = query.toString();
        return {
          url: `/blogs${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["blog"],
    }),
    getBlogBySlug: builder.query<any, { slug: string; includeDrafts?: boolean }>({
      query: ({ slug, includeDrafts }) => ({
        url: `/blogs/${slug}${includeDrafts ? "?includeDrafts=true" : ""}`,
        method: "GET",
      }),
      providesTags: ["blog"],
    }),
    createBlog: builder.mutation<any, Record<string, any>>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    updateBlog: builder.mutation<any, { id: string; data: Record<string, any> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["blog"],
    }),
    togglePublishBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}/toggle-publish`,
        method: "PATCH",
      }),
      invalidatesTags: ["blog"],
    }),
    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["blog"],
    }),
  }),
});

export const {
  useGetAllBlogsQuery,
  useGetBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useTogglePublishBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
