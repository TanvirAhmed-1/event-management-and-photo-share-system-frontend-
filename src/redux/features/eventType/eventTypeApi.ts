import { baseApi } from "../../api/baseApi";

export interface EventType {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  coverImage?: string | null;
  isActive: boolean;
  minGuests?: number;
  maxGuests?: number | null;
  defaultGuests?: number | null;
  allowServiceSelection?: boolean;
  allowFoodSelection?: boolean;
  displayOrder?: number;
  customFields?: any[];
  fields?: any[];
  services?: any[];
  foodAssignments?: any[];
  _count?: {
    services?: number;
    foods?: number;
    events?: number;
  };
}

const eventTypeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEventTypes: builder.query<
      { success: boolean; data: EventType[] },
      { includeInactive?: boolean } | void
    >({
      query: (params) => ({
        url: params?.includeInactive
          ? "/event-types?includeInactive=true"
          : "/event-types",
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
