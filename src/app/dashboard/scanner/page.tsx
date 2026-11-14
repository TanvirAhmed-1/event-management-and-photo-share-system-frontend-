"use client";

import Link from "next/link";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import {
  ScanFace,
  Copy,
  ExternalLink,
  Camera,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * Host dashboard hub for managing guest AI face-scanner links and opening live event portals.
 */
export default function DashboardScannerPage() {
  const { data: eventsResponse, isLoading } = useGetAllEventsQuery(undefined);
  const events = eventsResponse?.data || [];

  const handleCopyGuestUrl = (eventId: string) => {
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/guest/${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Guest AI Scanner link copied!");
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-200 mb-2">
            <ScanFace className="w-3.5 h-3.5" />
            <span>AI Guest Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            AI Guest Face Scanner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Share direct guest selfie-search links or open each event&apos;s live AI photo finder portal.
          </p>
        </div>

        <Link
          href="/dashboard/events"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-purple-50 border border-slate-200 text-[#172554] text-xs font-bold shadow-xs transition shrink-0"
        >
          <Sparkles className="w-4 h-4 text-[#7C3AED]" />
          <span>Upload More Event Photos</span>
        </Link>
      </div>

      {/* How Guests Use It Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-xs font-extrabold text-[#7C3AED] mb-1">
            01. Upload &amp; Scan Faces
          </div>
          <p className="text-xs text-slate-600">
            Upload photos inside your event gallery and trigger AI Face Scan so faces are indexed.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-xs font-extrabold text-[#7C3AED] mb-1">
            02. Share Guest Link
          </div>
          <p className="text-xs text-slate-600">
            Copy any event&apos;s unique scanner URL below and send it on WhatsApp or print as a QR card.
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="text-xs font-extrabold text-[#7C3AED] mb-1">
            03. Instant Selfie Match
          </div>
          <p className="text-xs text-slate-600">
            Guests take or upload one selfie and immediately download every photo they appear in.
          </p>
        </div>
      </div>

      {/* Events Scanner List */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">
          Loading event scanner portals...
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-xs">
          <ScanFace className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#172554]">
            No Event Scanner Portals Yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Create an event first to generate its dedicated guest AI face-search portal.
          </p>
          <Link
            href="/dashboard/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition"
          >
            Go to My Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((ev: any) => (
            <div
              key={ev.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-extrabold text-[#172554]">
                    {ev.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200 text-[11px] font-bold shrink-0">
                    <Camera className="w-3.5 h-3.5" />
                    {ev._count?.photos ?? 0} photos
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {ev.eventDate && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                      {new Date(ev.eventDate).toLocaleDateString()}
                    </span>
                  )}
                  {ev.venue && (
                    <span className="inline-flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                      {ev.venue}
                    </span>
                  )}
                </div>

                <div className="mt-4 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] font-mono text-slate-600 truncate">
                  /guest/{ev.id}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => handleCopyGuestUrl(ev.id)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                >
                  <Copy className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Copy Guest Link</span>
                </button>

                <Link
                  href={`/guest/${ev.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs"
                >
                  <ScanFace className="w-3.5 h-3.5" />
                  <span>Open AI Scanner</span>
                </Link>

                <Link
                  href={`/dashboard/events/${ev.id}`}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-[#7C3AED] hover:bg-purple-50 transition ml-auto"
                >
                  <span>Gallery</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
