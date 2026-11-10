import { baseApi } from "../../api/baseApi";

export interface EventType {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  isActive: boolean;
  minGuests?: number;
  maxGuests?: number;
  customFields?: any[];
  services?: any[];
  foodAssignments?: any[];
}

const eventTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEventTypes: builder.query<{ success: boolean; data: EventType[] }, void>({
      query: () => ({
        url: "/event-types",
        method: "GET",
      }),
      providesTags: ["eventType"],
    }),
    getEventTypeById: builder.query<{ success: boolean; data: EventType }, string>({
      query: (id) => ({
        url: `/event-types/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "eventType", id }],
    }),
    createEventType: builder.mutation({
      query: (body) => ({
        url: "/event-types",
        method: "POST",
        body,
      }),
      invalidatesTags: ["eventType"],
    }),
    updateEventType: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/event-types/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["eventType", { type: "eventType", id }],
    }),
    deleteEventType: builder.mutation({
      query: (id) => ({
        url: `/event-types/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["eventType"],
    }),
    toggleActiveEventType: builder.mutation({
      query: (id) => ({
        url: `/event-types/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: ["eventType"],
    }),
  }),
});

export const {
  useGetAllEventTypesQuery,
  useGetEventTypeByIdQuery,
  useCreateEventTypeMutation,
  useUpdateEventTypeMutation,
  useDeleteEventTypeMutation,
  useToggleActiveEventTypeMutation,
} = eventTypeApi;

