"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Sparkles,
  Layers,
  ScanFace,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

function EventsExplorer() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || "all";
  const normalizedInitialType =
    rawType === "corporate"
      ? "corporate-event"
      : rawType === "others"
      ? "all"
      : rawType;
  const initialLocation = searchParams.get("location") || "";

  const { data: eventTypesRes, isLoading: typesLoading } = useGetAllEventTypesQuery();
  const { data: eventsRes, isLoading: eventsLoading } = useGetAllEventsQuery(undefined);

  const [selectedType, setSelectedType] = useState<string>(normalizedInitialType);
  const [searchQuery, setSearchQuery] = useState(initialLocation);

  const eventTypes = eventTypesRes?.data || [];
  const events = eventsRes?.data || [];

  const filteredEvents = events.filter((ev: any) => {
    const evSlug = ev.eventType?.slug || "";
    const matchesType =
      !selectedType || selectedType === "all" || evSlug === selectedType;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      (ev.title || "").toLowerCase().includes(q) ||
      (ev.venue || "").toLowerCase().includes(q) ||
      (ev.description || "").toLowerCase().includes(q) ||
      (ev.eventType?.name || "").toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const isLoading = typesLoading || eventsLoading;

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC] min-h-[80vh]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Live Event Showcase &amp; Categories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Explore Curated Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Discover real celebrations, browse event categories, and access AI-powered guest photo galleries across Bangladesh.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-5">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by event name, venue (e.g. Dhaka, Banani)..."
              className="pl-10 pr-4 h-10 text-xs rounded-2xl bg-white shadow-xs"
            />
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedType === "all"
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Categories
            </button>
            {eventTypes.map((et: any) => (
              <button
                key={et.id}
                onClick={() => setSelectedType(et.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedType === et.slug
                    ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {et.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live Events Grid with Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="w-full aspect-[16/10] bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="w-1/3 h-4 rounded bg-slate-200 animate-pulse" />
                  <div className="w-3/4 h-5 rounded bg-slate-200 animate-pulse" />
                  <div className="w-full h-3 rounded bg-slate-100 animate-pulse" />
                  <div className="pt-3 border-t border-slate-100 flex justify-between">
                    <div className="w-24 h-4 rounded bg-slate-200 animate-pulse" />
                    <div className="w-20 h-8 rounded-xl bg-slate-200 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-xl mx-auto space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-[#172554]">
              No matching events found
            </h3>
            <p className="text-xs text-slate-500">
              Try clearing your filters or create a brand new event workspace in your dashboard!
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Reset Filters
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition"
              >
                Plan New Event
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((ev: any, idx: number) => {
              const cover =
                ev.coverImage ||
                ev.eventType?.imageUrl ||
                "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
              const dateLabel = ev.eventDate
                ? new Date(ev.eventDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Upcoming";

              return (
                <div
                  key={ev.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 motion-preset-slide-up-sm motion-preset-fade"
                  style={{ animationDelay: `${idx * 75}ms` }}
                >
                  <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                    <Image
                      src={cover}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#172554] text-[10px] font-extrabold shadow-xs">
                      {ev.eventType?.name || "Celebration"}
                    </span>

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold">
                      <Calendar className="w-3 h-3 text-[#F5B942]" />
                      <span>{dateLabel}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold">
                      <Users className="w-3 h-3 text-purple-300" />
                      <span>{ev.guestCount || 100} Guests</span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <div>
                      <h2 className="text-base font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                        {ev.title}
                      </h2>
                      {ev.venue && (
                        <p className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                          <span className="truncate">{ev.venue}</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {ev.description ||
                          "Professionally coordinated event with verified vendors and AI photo gallery."}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Link
                        href={`/guest/${ev.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] hover:underline"
                      >
                        <ScanFace className="w-3.5 h-3.5" />
                        <span>AI Photo Portal</span>
                      </Link>

                      <Link
                        href={`/events/${ev.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-xs transition"
                      >
                        <span>View Event</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-slate-400">
          Loading Events Explorer...
        </div>
      }
    >
      <EventsExplorer />
    </Suspense>
  );
}
