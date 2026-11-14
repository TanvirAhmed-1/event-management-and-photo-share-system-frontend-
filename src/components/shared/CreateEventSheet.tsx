"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  useCreateEventMutation,
  useGetDateAvailabilityQuery,
} from "@/redux/features/event/eventApi";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";

interface CreateEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: () => void;
}

const INITIAL_FORM = {
  title: "",
  eventTypeId: "",
  eventDate: "",
  venue: "",
  guestCount: 100,
};

/**
 * Right-side shadcn Sheet drawer for creating a new event gallery and workspace,
 * complete with shadcn Calendar date picker and live capacity/conflict detection.
 */
export default function CreateEventSheet({
  open,
  onOpenChange,
  onCreated,
}: CreateEventSheetProps) {
  const { data: eventTypesRes } = useGetAllEventTypesQuery();
  const { data: availabilityRes } = useGetDateAvailabilityQuery(undefined, {
    skip: !open,
  });
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const eventTypes = eventTypesRes?.data || [];
  const settings = availabilityRes?.data?.settings || {
    maxEventsPerDay: 1,
    allowSameDateRequests: true,
    warnAdminOnSameDate: true,
  };
  const dateSummary: Record<
    string,
    { total: number; confirmed: number; pending: number; isFull: boolean }
  > = availabilityRes?.data?.dates || {};

  const selectedDateObj = formData.eventDate
    ? new Date(`${formData.eventDate}T00:00:00`)
    : undefined;

  const selectedDateStats = formData.eventDate
    ? dateSummary[formData.eventDate]
    : undefined;

  const isDateBlocked = Boolean(
    selectedDateStats?.isFull && !settings.allowSameDateRequests
  );
  const hasConflictWarning = Boolean(
    selectedDateStats &&
      selectedDateStats.total >= settings.maxEventsPerDay &&
      settings.allowSameDateRequests
  );

  // Build date modifiers for shadcn Calendar
  const fullDates = Object.entries(dateSummary)
    .filter(([, info]) => info.isFull)
    .map(([dateStr]) => new Date(`${dateStr}T00:00:00`));

  const busyDates = Object.entries(dateSummary)
    .filter(([, info]) => info.total > 0 && !info.isFull)
    .map(([dateStr]) => new Date(`${dateStr}T00:00:00`));

  const handleSelectDate = (date: Date | undefined) => {
    if (!date) return;
    const yyyyMmDd = format(date, "yyyy-MM-dd");
    setFormData({ ...formData, eventDate: yyyyMmDd });
    setCalendarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    if (isDateBlocked) {
      toast.error("This date has reached its daily event limit. Please choose another date.");
      return;
    }

    try {
      const res: any = await createEvent({
        title: formData.title,
        eventTypeId: formData.eventTypeId || undefined,
        eventDate: formData.eventDate
          ? new Date(`${formData.eventDate}T12:00:00.000Z`).toISOString()
          : undefined,
        venue: formData.venue || undefined,
        guestCount: Number(formData.guestCount) || 100,
      }).unwrap();

      if (res?.data?.dateConflictWarning) {
        toast.success(
          "Event request submitted! Note: This date already has bookings — Organizer/Admin will review your request.",
          { duration: 5000 }
        );
      } else {
        toast.success("Event created successfully!");
      }

      onOpenChange(false);
      setFormData(INITIAL_FORM);
      onCreated?.();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create event");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <SheetHeader>
          <SheetTitle>Create New Event</SheetTitle>
          <SheetDescription>
            Set up a new celebration pool for vendor coordination and AI guest photo sharing.
          </SheetDescription>
        </SheetHeader>

        <form
          id="create-event-sheet-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div>
            <Label htmlFor="event-title">Event Title *</Label>
            <Input
              id="event-title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g. Tanvir & Anika's Wedding Gala"
              required
            />
          </div>

          <div>
            <Label>Event Type</Label>
            <Select
              value={formData.eventTypeId}
              onValueChange={(val) =>
                setFormData({ ...formData, eventTypeId: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((et: any) => (
                  <SelectItem key={et.id} value={et.id}>
                    {et.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Event Date</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger>
                  <button
                    type="button"
                    className="w-full h-10 flex items-center justify-between text-xs px-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white focus:outline-none focus:border-[#7C3AED] transition text-left"
                  >
                    <span className={selectedDateObj ? "text-[#172554] font-semibold" : "text-slate-400"}>
                      {selectedDateObj ? format(selectedDateObj, "PPP") : "Pick a date"}
                    </span>
                    <CalendarIcon className="w-4 h-4 text-[#7C3AED]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-1">
                  <Calendar
                    mode="single"
                    selected={selectedDateObj}
                    onSelect={handleSelectDate}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (date < today) return true;
                      if (!settings.allowSameDateRequests) {
                        const key = format(date, "yyyy-MM-dd");
                        if (dateSummary[key]?.isFull) return true;
                      }
                      return false;
                    }}
                    modifiers={{
                      full: fullDates,
                      busy: busyDates,
                    }}
                    modifiersClassNames={{
                      full: "!bg-amber-100 !text-amber-900 font-bold border border-amber-300",
                      busy: "!bg-purple-50 !text-[#7C3AED] font-bold",
                    }}
                  />
                  <div className="px-3 pb-2.5 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span>Busy / Limit ({settings.maxEventsPerDay}/day)</span>
                    </span>
                    <span>
                      {settings.allowSameDateRequests ? "Requests Allowed" : "Strict Limit"}
                    </span>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="event-guests">Guest Count</Label>
              <Input
                id="event-guests"
                type="number"
                value={formData.guestCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    guestCount: Number(e.target.value),
                  })
                }
                min={1}
              />
            </div>
          </div>

          {/* Live Date Capacity Feedback Banner */}
          {formData.eventDate && (
            <div>
              {hasConflictWarning ? (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900 motion-preset-fade">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Same-Date Booking Notice</p>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                      {selectedDateStats?.total} event(s) already scheduled on{" "}
                      <strong>{formData.eventDate}</strong> (Limit: {settings.maxEventsPerDay}/day).
                      Your request will be queued for Admin review &amp; multiple-event approval.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-[11px] font-semibold text-emerald-800 motion-preset-fade">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    Date available! ({selectedDateStats?.total || 0}/{settings.maxEventsPerDay} slots booked)
                  </span>
                </div>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="event-venue">Venue / Location</Label>
            <Input
              id="event-venue"
              type="text"
              value={formData.venue}
              onChange={(e) =>
                setFormData({ ...formData, venue: e.target.value })
              }
              placeholder="e.g. Sena Malancha, Dhaka"
            />
          </div>
        </form>

        <SheetFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            form="create-event-sheet-form"
            type="submit"
            disabled={isLoading || isDateBlocked}
            className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 disabled:opacity-50 transition"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
