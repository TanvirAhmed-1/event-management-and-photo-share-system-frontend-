"use client";

import { useState } from "react";
import {
  useGetAllEventsQuery,
  useDeleteEventMutation,
} from "@/redux/features/event/eventApi";
import { Calendar, Plus, Search, Sparkles } from "lucide-react";
import CreateEventSheet from "@/components/shared/CreateEventSheet";
import EventPoolCard from "@/components/shared/EventPoolCard";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

/**
 * Host dashboard child page listing all planned events & photo galleries with search and creation drawer.
 */
export default function DashboardEventsPage() {
  const {
    data: eventsResponse,
    isLoading,
    refetch,
  } = useGetAllEventsQuery(undefined);
  const [deleteEvent] = useDeleteEventMutation();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const events = eventsResponse?.data || [];
  const filteredEvents = events.filter((ev: any) =>
    `${ev.title || ""} ${ev.venue || ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleDeleteEvent = (eventId: string, title: string) => {
    setDeleteTarget({ id: eventId, title });
  };

  const confirmDeleteEvent = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEvent(deleteTarget.id).unwrap();
      toast.success("Event deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete event.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gallery Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            My Events &amp; Galleries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Filter events, upload guest photography pools, and share instant AI search portals.
          </p>
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Search & Count */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event title or venue..."
            className="pl-10 h-10 bg-white text-xs text-slate-700"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredEvents.length} of {events.length} events
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="text-center py-14 text-xs text-slate-400">
          Loading your events...
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#172554]">
            {searchTerm ? "No Matching Events" : "No Events Planned Yet"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            {searchTerm
              ? "Try another keyword or clear your search filter."
              : "Start planning your wedding, birthday, or corporate celebration with Eventora."}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setSheetOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition shadow-sm"
            >
              Create Your First Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((ev: any) => (
            <EventPoolCard key={ev.id} event={ev} onDelete={handleDeleteEvent} />
          ))}
        </div>
      )}

      <CreateEventSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onCreated={refetch}
      />

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete Event Pool?"
        description={`Are you sure you want to delete "${deleteTarget?.title || ""}"? All uploaded photos will be removed permanently.`}
        isLoading={isDeleting}
        onConfirm={confirmDeleteEvent}
      />
    </div>
  );
}
