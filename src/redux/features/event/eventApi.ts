import { baseApi } from "../../api/baseApi";

const eventApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEvents: builder.query({
      query: () => ({
        url: "/events",
        method: "GET",
      }),
      providesTags: ["event"],
    }),
    getEventById: builder.query({
      query: (id) => ({
        url: `/events/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "event", id }],
    }),
    createEvent: builder.mutation({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["event", "user"],
    }),
    updateEvent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/events/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["event", { type: "event", id }, "user"],
    }),
    selectServices: builder.mutation({
      query: ({ id, services }) => ({
        url: `/events/${id}/services`,
        method: "PUT",
        body: { services },
      }),
      invalidatesTags: (result, error, { id }) => ["event", { type: "event", id }],
    }),
    selectFood: builder.mutation({
      query: ({ id, items }) => ({
        url: `/events/${id}/food`,
        method: "PUT",
        body: { items },
      }),
      invalidatesTags: (result, error, { id }) => ["event", { type: "event", id }],
    }),
    previewEventBudget: builder.query({
      query: (id) => ({
        url: `/events/${id}/budget-preview`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "event", id }],
    }),
    confirmEvent: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/events/${id}/confirm`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["event", { type: "event", id }],
    }),
    updateGuestCount: builder.mutation({
      query: ({ id, guestCount }) => ({
        url: `/events/${id}/guest-count`,
        method: "PATCH",
        body: { guestCount },
      }),
      invalidatesTags: (result, error, { id }) => ["event", { type: "event", id }],
    }),
    deleteEvent: builder.mutation({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["event", "user"],
    }),
    toggleEventActiveAdmin: builder.mutation({
      query: (id) => ({
        url: `/events/admin/events/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["event"],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useSelectServicesMutation,
  useSelectFoodMutation,
  usePreviewEventBudgetQuery,
  useConfirmEventMutation,
  useUpdateGuestCountMutation,
  useDeleteEventMutation,
  useToggleEventActiveAdminMutation,
} = eventApi;
