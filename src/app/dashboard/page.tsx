"use client";

import { useGetUserDashboardQuery } from "@/redux/features/user/userApi";
import { useGetAllEventsQuery, useCreateEventMutation, useDeleteEventMutation } from "@/redux/features/event/eventApi";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { useState } from "react";
import {
  Plus,
  Camera,
  Copy,
  ExternalLink,
  Calendar,
  Trash2,
  HardDrive,
  QrCode,
  Sparkles,
  MapPin,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import Swal from "sweetalert2";

export default function Dashboard() {
  const { data: dashboardResponse, isLoading: dashboardLoading, refetch: refetchDashboard } =
    useGetUserDashboardQuery(undefined);
  const { data: eventsResponse, isLoading: eventsLoading, refetch: refetchEvents } =
    useGetAllEventsQuery(undefined);
  const { data: eventTypesRes } = useGetAllEventTypesQuery();
  const [createEvent, { isLoading: createLoading }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [newEventData, setNewEventData] = useState({
    title: "",
    eventTypeId: "",
    eventDate: "",
    venue: "",
    guestCount: 100,
  });

  const dashboardData = dashboardResponse?.data || {
    profile: { name: "Organizer" },
    packageInfo: { name: "Free Plan", storageLimitMB: 50 },
    stats: { totalEvents: 0, totalPhotos: 0, storageLimitMB: 50, storageUsedMB: 0, remainingStorageMB: 50 },
  };

  const events = eventsResponse?.data || [];
  const eventTypes = eventTypesRes?.data || [];

  const handleCopyLink = (eventId: string) => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/guest/${eventId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Guest scanner link copied to clipboard!");
    }
  };

  const handleCreateNewEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventData.title.trim()) {
      toast.error("Please enter an event title");
      return;
    }

    try {
      await createEvent({
        title: newEventData.title,
        eventTypeId: newEventData.eventTypeId || undefined,
        eventDate: newEventData.eventDate ? new Date(newEventData.eventDate).toISOString() : undefined,
        venue: newEventData.venue || undefined,
        guestCount: Number(newEventData.guestCount) || 100,
      }).unwrap();

      toast.success("Event created successfully!");
      setModalOpen(false);
      setNewEventData({ title: "", eventTypeId: "", eventDate: "", venue: "", guestCount: 100 });
      refetchEvents();
      refetchDashboard();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create event");
    }
  };

  const handleDeleteEvent = async (eventId: string, title: string) => {
    const confirmResult = await Swal.fire({
      title: "Delete Event Pool?",
      text: `Are you sure you want to delete "${title}"? All uploaded photos will be removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
    });

    if (confirmResult.isConfirmed) {
      try {
        await deleteEvent(eventId).unwrap();
        toast.success("Event deleted successfully!");
        refetchEvents();
        refetchDashboard();
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to delete event.");
      }
    }
  };

  const percentUsed = Math.min(
    100,
    Math.round(((dashboardData.stats.storageUsedMB || 0) / (dashboardData.stats.storageLimitMB || 1)) * 100)
  );

  return (
    <div className="w-full py-8 lg:py-12 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Host Planning Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Welcome back, {dashboardData.profile.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your event schedules, AI photo galleries, and guest access links.
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 border border-purple-200">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#172554]">{dashboardData.stats.totalEvents}</div>
              <div className="text-xs font-semibold text-slate-500">Planned Events</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#F5B942] flex items-center justify-center shrink-0 border border-amber-200">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#172554]">{dashboardData.stats.totalPhotos}</div>
              <div className="text-xs font-semibold text-slate-500">Photos Uploaded</div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-indigo-500" />
                Storage Quota
              </span>
              <span className="text-xs font-extrabold text-[#7C3AED]">{percentUsed}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-[#7C3AED] h-full transition-all duration-500"
                style={{ width: `${percentUsed}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2">
              <span>{(dashboardData.stats.storageUsedMB || 0).toFixed(1)} MB</span>
              <span>{dashboardData.stats.storageLimitMB} MB Limit</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div>
          <h2 className="text-xl font-bold text-[#172554] mb-4">My Events & Galleries</h2>

          {eventsLoading ? (
            <div className="text-center py-12 text-xs text-slate-400">Loading your events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#172554]">No Events Planned Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Start planning your wedding, birthday, or corporate celebration with Eventora.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="px-4 py-2 rounded-full bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev: any) => (
                <div
                  key={ev.id}
                  className="flex flex-col justify-between bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden p-5"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-[#172554] line-clamp-1">{ev.title}</h3>
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-slate-500">
                      {ev.eventDate && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>{new Date(ev.eventDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      {ev.venue && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span className="truncate">{ev.venue}</span>
                        </div>
                      )}
                      {ev.guestCount && (
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-[#7C3AED]" />
                          <span>{ev.guestCount} Guests</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#F5B942]" />
                        <span className="font-semibold text-slate-700">
                          {ev._count?.photos ?? 0} photos uploaded
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopyLink(ev.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
                      title="Copy Guest Scanner Link"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Guest Link</span>
                    </button>

                    <Link
                      href={`/dashboard/events/${ev.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold transition shadow-xs"
                    >
                      <span>Manage Gallery</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h4 className="text-base font-bold text-[#172554] mb-4">Create New Event</h4>
            <form onSubmit={handleCreateNewEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newEventData.title}
                  onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                  placeholder="e.g. Tanvir & Anika's Wedding Gala"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Event Type</label>
                <select
                  value={newEventData.eventTypeId}
                  onChange={(e) => setNewEventData({ ...newEventData, eventTypeId: e.target.value })}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="">Select Category</option>
                  {eventTypes.map((et: any) => (
                    <option key={et.id} value={et.id}>
                      {et.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Event Date</label>
                  <input
                    type="date"
                    value={newEventData.eventDate}
                    onChange={(e) => setNewEventData({ ...newEventData, eventDate: e.target.value })}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Guest Count</label>
                  <input
                    type="number"
                    value={newEventData.guestCount}
                    onChange={(e) => setNewEventData({ ...newEventData, guestCount: Number(e.target.value) })}
                    placeholder="100"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Venue / Location</label>
                <input
                  type="text"
                  value={newEventData.venue}
                  onChange={(e) => setNewEventData({ ...newEventData, venue: e.target.value })}
                  placeholder="e.g. Radisson Blu Water Garden, Dhaka"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs"
                >
                  {createLoading ? "Creating..." : "Save Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
