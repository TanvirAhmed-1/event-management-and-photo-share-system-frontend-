"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Calendar,
} from "lucide-react";
import Container from "@/components/shared/Container";
import { useGetPlatformSettingsQuery } from "@/redux/features/settings/settingsApi";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";

export default function SeoLocationsAndVenues() {
  const { data: settingsRes, isLoading: settingsLoading } =
    useGetPlatformSettingsQuery();
  const { data: eventsRes, isLoading: eventsLoading } =
    useGetAllEventsQuery(undefined);

  const cities: string[] = useMemo(() => {
    return Array.isArray(settingsRes?.data?.serviceCities)
      ? settingsRes.data.serviceCities
      : [];
  }, [settingsRes]);

  const events = useMemo(() => eventsRes?.data || [], [eventsRes]);

  const [activeCity, setActiveCity] = useState<string>("");

  useEffect(() => {
    if (cities.length > 0 && (!activeCity || !cities.includes(activeCity))) {
      setActiveCity(cities[0]);
    }
  }, [cities, activeCity]);

  const cityEvents = useMemo(() => {
    if (!activeCity) return [];
    const q = activeCity.toLowerCase();
    return events.filter(
      (ev: any) =>
        (ev.venue || "").toLowerCase().includes(q) ||
        (ev.title || "").toLowerCase().includes(q)
    );
  }, [events, activeCity]);

  const uniqueVenues = useMemo(() => {
    const source = cityEvents.length > 0 ? cityEvents : events;
    return Array.from(
      new Set(
        source
          .map((ev: any) => (ev.venue || "").trim())
          .filter(Boolean)
      )
    ).slice(0, 4) as string[];
  }, [cityEvents, events]);

  const cityEventTypes = useMemo(() => {
    const source = cityEvents.length > 0 ? cityEvents : events;
    return Array.from(
      new Set(
        source
          .map((ev: any) => ev.eventType?.name)
          .filter(Boolean)
      )
    ).slice(0, 4) as string[];
  }, [cityEvents, events]);

  const isLoading = settingsLoading || eventsLoading;

  if (!isLoading && cities.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-6 lg:py-8 bg-gradient-to-br from-[#F5F0FF] via-[#FAF8FF] to-[#EEE8FF] border-y border-purple-200/60 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#7C3AED]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#F5B942]/10 blur-3xl pointer-events-none" />

      <Container className="relative z-10 space-y-4">
        {/* Section Header + Dynamic City Tabs from Admin Settings */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white text-[#7C3AED] text-[10px] font-bold border border-purple-200/80 shadow-2xs mb-1">
              <MapPin className="w-3 h-3" />
              <span>Dynamic Service Locations ({cities.length})</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight">
              Event Management Across{" "}
              <span className="text-[#7C3AED]">Bangladesh</span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-24 h-8 rounded-full bg-purple-200/60 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {cities.map((city) => {
                const isActive = activeCity === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => setActiveCity(city)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? "bg-[#7C3AED] text-white shadow-md shadow-[#7C3AED]/25"
                        : "bg-white text-slate-600 hover:bg-purple-100/70 hover:text-[#7C3AED] border border-purple-200/80"
                    }`}
                  >
                    <MapPin
                      className={`w-3 h-3 ${
                        isActive ? "text-[#F5B942]" : "text-[#7C3AED]"
                      }`}
                    />
                    <span>{city}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Full-Width Compact Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
          {/* Left Dynamic City Info (7 cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#7C3AED] text-white text-[10px] font-extrabold uppercase tracking-wider">
                Active Service Hub
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-purple-200 text-[11px] font-semibold text-[#172554]">
                <Calendar className="w-3 h-3 text-[#7C3AED]" />
                {cityEvents.length} Live Event{cityEvents.length === 1 ? "" : "s"} in{" "}
                {activeCity || "Region"}
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight">
                {activeCity || "Bangladesh"} Events &amp; Venues
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl mt-1">
                Book verified photography, stage decor, gourmet catering, and instant AI selfie photo delivery for celebrations in{" "}
                <strong className="text-[#172554]">{activeCity || "your city"}</strong>.
              </p>
            </div>

            {/* Dynamic Event Categories Found in DB */}
            {cityEventTypes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {cityEventTypes.map((typeName) => (
                  <span
                    key={typeName}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-purple-100 text-[11px] font-semibold text-[#172554] shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-[#F5B942]" />
                    <span>{typeName}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/events?city=${encodeURIComponent(activeCity)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs font-extrabold shadow-md shadow-[#7C3AED]/25 transition-all hover:scale-[1.02]"
              >
                <span>Explore {activeCity} Events</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-purple-50 border border-purple-200 text-[#172554] text-xs font-bold transition"
              >
                <span>Browse Services</span>
              </Link>
            </div>
          </div>

          {/* Right Dynamic Partner Venues Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-4 border border-purple-100 shadow-lg shadow-purple-950/5 space-y-2.5">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#172554]">
                  {cityEvents.length > 0
                    ? `Venues in ${activeCity}`
                    : "Active Event Venues"}
                </h4>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                AI QR Ready
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-7 rounded-lg bg-slate-100 animate-pulse"
                  />
                ))}
              </div>
            ) : uniqueVenues.length === 0 ? (
              <div className="py-4 text-center text-[11px] text-slate-400">
                No venues listed yet for {activeCity}.
              </div>
            ) : (
              <div className="space-y-1.5">
                {uniqueVenues.map((venue) => (
                  <div
                    key={venue}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAFAFF] hover:bg-purple-50/70 border border-slate-100 transition flex items-center justify-between text-[11px] font-semibold text-[#172554]"
                  >
                    <span className="truncate">{venue}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C3AED] shrink-0 ml-2" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 p-2 rounded-lg bg-purple-50/80 border border-purple-100 text-[10px] text-slate-600">
              <QrCode className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
              <span>
                On-site QR standees included for instant guest selfie photo lookup.
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
