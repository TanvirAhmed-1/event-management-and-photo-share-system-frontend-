"use client";

import React, { useState } from "react";
import {
  useGetAllEventsQuery,
  useToggleEventActiveAdminMutation,
  useDeleteEventMutation,
} from "@/redux/features/event/eventApi";
import { Calendar, Search, Trash2, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEvents() {
  const { data: eventsRes, isLoading, refetch } = useGetAllEventsQuery(undefined);
  const [toggleActive] = useToggleEventActiveAdminMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [search, setSearch] = useState("");

  const events = eventsRes?.data || [];

  const handleToggle = async (eventId: string, title: string) => {
    try {
      const res = await toggleActive(eventId).unwrap();
      toast.success(`Event "${title}" set to ${res.data.isActive ? "ACTIVE" : "INACTIVE"}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle event");
    }
  };

  const handleDelete = async (eventId: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete event "${title}"?`)) return;
    try {
      await deleteEvent(eventId).unwrap();
      toast.success("Event deleted successfully!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete event");
    }
  };

  const filtered = events.filter((e: any) =>
    e.title?.toLowerCase().includes(search.toLowerCase()) ||
    (e.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (e.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7C3AED]" />
            Platform Events & Bookings
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor all customer events, photo galleries, and booking statuses.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events, host..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-[#7C3AED] w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading events...</div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center text-xs text-slate-400">No events found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
              <tr>
                <th className="py-3 px-4">Event Title</th>
                <th className="py-3 px-4">Host Details</th>
                <th className="py-3 px-4">Event Date</th>
                <th className="py-3 px-4">Guests</th>
                <th className="py-3 px-4">Photos Mapped</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((e: any) => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#172554]">{e.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      No: {e.eventNo || e.id.slice(0, 8)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-700">{e.user?.name || "Unknown"}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{e.user?.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {e.eventDate ? new Date(e.eventDate).toLocaleDateString() : "Pending"}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {e.guestCount || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-[#7C3AED]">
                    {e._count?.photos ?? 0} photos
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(e.id, e.title)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        e.isActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      {e.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{e.isActive ? "ACTIVE" : "INACTIVE"}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleDelete(e.id, e.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

