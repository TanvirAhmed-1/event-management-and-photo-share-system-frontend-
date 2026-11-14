"use client";

import React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ScanFace,
  CheckCircle2,
  Camera,
  ShieldCheck,
} from "lucide-react";
import { useGetEventByIdQuery } from "@/redux/features/event/eventApi";

export default function PublicEventDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: eventRes, isLoading, isError } = useGetEventByIdQuery(id);
  const event = eventRes?.data;

  if (isLoading) {
    return (
      <div className="w-full py-12 lg:py-16 bg-[#F8FAFC] min-h-[75vh]">
        <div className="mx-auto max-w-[1140px] px-4 sm:px-6 space-y-8">
          <div className="w-32 h-5 rounded-full bg-slate-200 animate-pulse" />
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-sm motion-preset-fade motion-loop-pulse">
            <div className="w-full h-[320px] sm:h-[420px] bg-slate-200 animate-pulse" />
            <div className="p-6 sm:p-10 space-y-5">
              <div className="w-2/3 h-8 rounded-lg bg-slate-200 animate-pulse" />
              <div className="w-full h-4 rounded bg-slate-100 animate-pulse" />
              <div className="w-3/4 h-4 rounded bg-slate-100 animate-pulse" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="w-full py-20 bg-[#F8FAFC] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <Sparkles className="w-10 h-10 text-[#7C3AED] mx-auto" />
          <h1 className="text-xl font-extrabold text-[#172554]">Event Not Found</h1>
          <p className="text-xs text-slate-500">
            This event showcase may have been removed or is currently private.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Events</span>
          </Link>
        </div>
      </div>
    );
  }

  const cover =
    event.coverImage ||
    "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop";
  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Flexible Schedule";

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC] min-h-[80vh]">
      <div className="mx-auto max-w-[1140px] px-4 sm:px-6 space-y-8">
        {/* Back Breadcrumb */}
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events Explorer</span>
        </Link>

        {/* Main Showcase Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xl shadow-slate-900/5 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          {/* Hero Cover */}
          <div className="relative w-full h-[280px] sm:h-[400px] bg-slate-900">
            <Image
              src={cover}
              alt={event.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1200px) 100vw, 1140px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-black/15" />

            <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#172554] text-[11px] font-extrabold shadow-sm">
                {event.eventType?.name || "Signature Event"}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
                {event.status || "CONFIRMED"}
              </span>
            </div>

            <div className="absolute bottom-6 inset-x-6 sm:inset-x-10 text-white">
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200/90 mt-2 max-w-2xl leading-relaxed">
                {event.description ||
                  "Curated celebration managed with Eventora verified vendors, catering, and AI facial recognition photo delivery."}
              </p>
            </div>
          </div>

          {/* Info Grid & Actions */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-[#7C3AED] text-xs font-bold mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Event Date</span>
                </div>
                <p className="text-sm font-extrabold text-[#172554]">{formattedDate}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-[#7C3AED] text-xs font-bold mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Schedule Time</span>
                </div>
                <p className="text-sm font-extrabold text-[#172554]">
                  {event.eventTime || "Evening Gala"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-[#7C3AED] text-xs font-bold mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Venue</span>
                </div>
                <p className="text-sm font-extrabold text-[#172554] truncate">
                  {event.venue || "Dhaka, Bangladesh"}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center gap-2 text-[#7C3AED] text-xs font-bold mb-1">
                  <Users className="w-4 h-4" />
                  <span>Guest Capacity</span>
                </div>
                <p className="text-sm font-extrabold text-[#172554]">
                  {event.guestCount || 150} Guests
                </p>
              </div>
            </div>

            {/* Dual Action Banner: AI Photo Finder + Plan Similar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-[#172554] via-[#1E1B4B] to-[#4C1D95] text-white flex flex-col justify-between gap-4 shadow-lg">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-[#F5B942] text-[10px] font-bold mb-3">
                    <ScanFace className="w-3.5 h-3.5" />
                    <span>Guest AI Photo Portal</span>
                  </div>
                  <h2 className="text-lg font-extrabold">Attended This Event?</h2>
                  <p className="text-xs text-purple-200/90 mt-1 leading-relaxed">
                    Upload a quick selfie to let our AI match and retrieve every high-res photo you appear in from this gallery.
                  </p>
                </div>
                <Link
                  href={`/guest/${event.id}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#F5B942] hover:bg-[#FBBF24] text-[#172554] text-xs font-extrabold transition shadow-md"
                >
                  <Camera className="w-4 h-4" />
                  <span>Find My Photos Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-purple-50/70 border border-purple-200/80 flex flex-col justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white text-[#7C3AED] text-[10px] font-bold border border-purple-200 mb-3">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Custom Event Workspace</span>
                  </div>
                  <h2 className="text-lg font-extrabold text-[#172554]">
                    Want a Similar Celebration?
                  </h2>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Instant cost calculator in BDT (৳)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Verified photographers, decor &amp; Kacchi catering</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-extrabold transition shadow-md"
                >
                  <span>Start Planning My Event</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
