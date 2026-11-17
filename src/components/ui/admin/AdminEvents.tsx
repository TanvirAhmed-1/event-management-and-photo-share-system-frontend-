"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetAllEventsQuery,
  useToggleEventActiveAdminMutation,
  useUpdateEventStatusAdminMutation,
  useDeleteEventMutation,
} from "@/redux/features/event/eventApi";
import { useGetPlatformSettingsQuery } from "@/redux/features/settings/settingsApi";
import {
  Calendar,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  ImageIcon,
  MapPin,
  Users,
  AlertTriangle,
  Check,
  X,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import DeleteConfirmDialog from "@/components/shared/DeleteConfirmDialog";
import TablePagination, { paginateItems } from "@/components/shared/TablePagination";

export default function AdminEvents() {
  const [conflictEvent, setConflictEvent] = useState<any | null>(null);
  const [overrideLoading, setOverrideLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: eventsRes, isLoading, refetch } = useGetAllEventsQuery(undefined);
  const { data: settingsRes } = useGetPlatformSettingsQuery();
  const [toggleActive] = useToggleEventActiveAdminMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateEventStatusAdminMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const events = eventsRes?.data || [];
  const settings = settingsRes?.data || {
    maxEventsPerDay: 1,
    allowSameDateRequests: true,
    warnAdminOnSameDate: true,
  };

  // Group active/non-cancelled events by YYYY-MM-DD to detect same-date conflicts
  const dateGroups = useMemo(() => {
    const map: Record<string, any[]> = {};
    for (const ev of events) {
      if (!ev.eventDate || ev.status === "CANCELLED" || ev.status === "ARCHIVED") continue;
      const dateStr = new Date(ev.eventDate).toISOString().split("T")[0];
      if (!map[dateStr]) map[dateStr] = [];
      map[dateStr].push(ev);
    }
    return map;
  }, [events]);

  const conflictDates = useMemo(() => {
    return Object.entries(dateGroups).filter(
      ([, list]) => list.length > settings.maxEventsPerDay || list.length > 1
    );
  }, [dateGroups, settings.maxEventsPerDay]);

  const handleStatusDecision = async (
    event: any,
    newStatus: "CONFIRMED" | "CANCELLED"
  ) => {
    try {
      await updateStatus({
        id: event.id,
        status: newStatus,
        allowMultipleOverride: false,
      }).unwrap();
      toast.success(
        newStatus === "CONFIRMED"
          ? `Accepted "${event.title}"!`
          : `Declined "${event.title}".`
      );
      refetch();
    } catch (err: any) {
      const msg: string = err?.data?.message || "";
      if (err?.status === 409 || msg.includes("SAME_DATE_CONFLICT")) {
        setConflictEvent(event);
      } else {
        toast.error(msg || "Failed to update event status");
      }
    }
  };

  const handleConfirmOverride = async () => {
    if (!conflictEvent) return;
    setOverrideLoading(true);
    try {
      await updateStatus({
        id: conflictEvent.id,
        status: "CONFIRMED",
        allowMultipleOverride: true,
      }).unwrap();
      toast.success(`Multiple-event access granted for "${conflictEvent.title}"!`);
      setConflictEvent(null);
      refetch();
    } catch (overrideErr: any) {
      toast.error(overrideErr?.data?.message || "Failed to override conflict");
    } finally {
      setOverrideLoading(false);
    }
  };

  const handleToggle = async (eventId: string, title: string) => {
    try {
      const res = await toggleActive(eventId).unwrap();
      toast.success(`Event "${title}" set to ${res.data.isActive ? "ACTIVE" : "INACTIVE"}`);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to toggle event");
    }
  };

  const handleDelete = (eventId: string, title: string) => {
    setDeleteTarget({ id: eventId, title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEvent(deleteTarget.id).unwrap();
      toast.success("Event deleted successfully!");
      setDeleteTarget(null);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  const filtered = events.filter(
    (e: any) =>
      e.title?.toLowerCase().includes(search.toLowerCase()) ||
      (e.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.user?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.venue || "").toLowerCase().includes(search.toLowerCase())
  );

  const { paginatedItems: paginatedEvents, safePage } = paginateItems(
    filtered,
    currentPage
  );

  return (
    <div className="space-y-5">
      {/* Same-Date Conflict Warning Banner */}
      {settings.warnAdminOnSameDate && conflictDates.length > 0 && (
        <div className="rounded-2xl bg-amber-50 border border-amber-300/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs motion-preset-slide-up-sm motion-preset-fade">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-amber-950">
                Same-Date Event Conflict Alert ({conflictDates.length} Date
                {conflictDates.length > 1 ? "s" : ""})
              </h4>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                Multiple event requests share the same date (Current limit:{" "}
                <strong>{settings.maxEventsPerDay} event/day</strong>):{" "}
                {conflictDates.map(([d, list]) => `${d} (${list.length} events)`).join(" • ")}
              </p>
            </div>
          </div>

          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold shrink-0 transition shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Capacity Settings</span>
          </Link>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-[#172554] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#7C3AED]" />
              Platform Events &amp; Request Approvals
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review incoming date requests, resolve same-day conflicts, and grant multiple-event access.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search events, host, venue..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs w-60 bg-slate-50"
              />
            </div>

            <Link
              href="/admin/settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] text-xs font-bold border border-purple-200 transition"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Limit: {settings.maxEventsPerDay}/day</span>
            </Link>
          </div>
        </div>

        {isLoading ? (
          /* Advanced Tailwind Motion Skeleton Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-y border-slate-100">
                <tr>
                  <th className="py-3 px-4">Cover</th>
                  <th className="py-3 px-4">Event Title</th>
                  <th className="py-3 px-4">Host Details</th>
                  <th className="py-3 px-4">Event Date</th>
                  <th className="py-3 px-4">Booking Status</th>
                  <th className="py-3 px-4">Active</th>
                  <th className="py-3 px-4 text-right">Review &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="motion-preset-fade motion-loop-pulse">
                    <td className="py-3 px-4">
                      <div className="w-12 h-10 rounded-xl bg-slate-200 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-36 h-4 rounded-md bg-slate-200 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-24 h-4 rounded-md bg-slate-200/80 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-4 rounded-md bg-slate-200/70 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-20 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="w-16 h-5 rounded-full bg-slate-200 animate-pulse" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="w-20 h-6 rounded-md bg-slate-200 ml-auto animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">No events found.</div>
        ) : (
          <>
            <div className="rounded-xl border border-slate-200/80 overflow-hidden">
              <Table className="text-xs">
                  <TableHeader className="bg-slate-50/90">
                    <TableRow className="hover:bg-slate-50/90">
                      <TableHead>Cover</TableHead>
                      <TableHead>Event Title</TableHead>
                      <TableHead>Host Details</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Booking Status</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Review &amp; Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedEvents.map((e: any) => {
                      const cover =
                        e.coverImage ||
                        "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=400&auto=format&fit=crop";
                      const dateKey = e.eventDate
                        ? new Date(e.eventDate).toISOString().split("T")[0]
                        : null;
                      const sameDateCount = dateKey ? dateGroups[dateKey]?.length || 0 : 0;
                      const isSameDateConflict =
                        settings.warnAdminOnSameDate &&
                        sameDateCount > 1 &&
                        e.status !== "CANCELLED";

                      return (
                        <TableRow
                          key={e.id}
                          className={isSameDateConflict ? "bg-amber-50/30" : undefined}
                        >
                          <TableCell className="py-2.5">
                            <div className="relative w-12 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                              {cover ? (
                                <Image
                                  src={cover}
                                  alt={e.title}
                                  fill
                                  className="object-cover"
                                  sizes="48px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                  <ImageIcon className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="font-bold text-[#172554] block">{e.title}</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="inline-flex items-center gap-1 truncate max-w-[180px]">
                                <MapPin className="w-3 h-3 text-[#7C3AED] shrink-0" />
                                <span>{e.venue || "Location pending"}</span>
                              </span>
                              <span className="inline-flex items-center gap-1 text-[#7C3AED] font-semibold">
                                <Users className="w-3 h-3" />
                                <span>{e.guestCount || 0}</span>
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="font-semibold text-slate-700 block">
                              {e.user?.name || "Host User"}
                            </span>
                            <span className="text-[10px] text-slate-400">{e.user?.email || "—"}</span>
                          </TableCell>
                          <TableCell className="py-3">
                            <span className="font-mono text-slate-700 font-semibold block">
                              {dateKey || "TBD"}
                            </span>
                            {isSameDateConflict && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[9px] font-extrabold">
                                <AlertTriangle className="w-2.5 h-2.5" />
                                <span>Same Date ({sameDateCount})</span>
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                e.status === "CONFIRMED"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : e.status === "CANCELLED"
                                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {e.status || "DRAFT"}
                            </span>
                          </TableCell>
                          <TableCell className="py-3">
                            <button
                              onClick={() => handleToggle(e.id, e.title)}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                e.isActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                            >
                              {e.isActive ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              <span>{e.isActive ? "ACTIVE" : "INACTIVE"}</span>
                            </button>
                          </TableCell>
                          <TableCell className="py-3 text-right">
                            <div className="inline-flex items-center gap-1">
                              {e.status !== "CONFIRMED" && (
                                <button
                                  disabled={isUpdatingStatus}
                                  onClick={() => handleStatusDecision(e, "CONFIRMED")}
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                                  title="Accept / Approve Request"
                                >
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              )}
                              {e.status !== "CANCELLED" && (
                                <button
                                  disabled={isUpdatingStatus}
                                  onClick={() => handleStatusDecision(e, "CANCELLED")}
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 transition"
                                  title="Decline Request"
                                >
                                  <X className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(e.id, e.title)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                                title="Delete event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
            </div>
            <div className="mt-4">
              <TablePagination
                currentPage={safePage}
                totalItems={filtered.length}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>

      {/* Same-Date Capacity Override Dialog */}
      <Dialog
        open={Boolean(conflictEvent)}
        onOpenChange={(open) => {
          if (!open) setConflictEvent(null);
        }}
      >
        <DialogContent onClose={() => setConflictEvent(null)}>
          <DialogHeader>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <DialogTitle>Same-Date Capacity Warning</DialogTitle>
            <DialogDescription>
              <strong>{conflictEvent?.title}</strong> is scheduled for a date that has already reached the daily organizer limit (
              <strong>{settings.maxEventsPerDay} event/day</strong>).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200/80 p-3.5 text-xs text-amber-900 font-medium leading-relaxed">
            Do you want to review and grant multiple-event access on this same date?
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setConflictEvent(null)}
              disabled={overrideLoading}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
            >
              Keep Pending
            </button>
            <button
              type="button"
              onClick={handleConfirmOverride}
              disabled={overrideLoading}
              className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {overrideLoading ? "Granting Access..." : "Yes, Grant Multiple Event Access"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete Event?"
        description={`Are you sure you want to permanently delete event "${deleteTarget?.title || ""}"?`}
        isLoading={isDeleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
