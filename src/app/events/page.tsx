"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Container from "@/components/shared/Container";
import { useGetPlatformSettingsQuery } from "@/redux/features/settings/settingsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function EventsExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawType = searchParams.get("type") || "all";
  const normalizedInitialType =
    rawType === "corporate"
      ? "corporate-event"
      : rawType === "others"
      ? "all"
      : rawType;
  const initialCity =
    searchParams.get("city") || searchParams.get("location") || "all";
  const initialDate = searchParams.get("date") || "";

  const { data: eventTypesRes, isLoading: typesLoading } =
    useGetAllEventTypesQuery();
  const { data: eventsRes, isLoading: eventsLoading } =
    useGetAllEventsQuery(undefined);
  const { data: settingsRes } = useGetPlatformSettingsQuery();

  const cities: string[] = Array.isArray(settingsRes?.data?.serviceCities)
    ? settingsRes.data.serviceCities
    : [];

  const [selectedType, setSelectedType] = useState<string>(normalizedInitialType);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [selectedDate, setSelectedDate] = useState<string>(initialDate);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Sync state when URL query params change (e.g. clicking Navbar category links)
  useEffect(() => {
    setSelectedType(normalizedInitialType);
    setActiveSlide(0);
  }, [normalizedInitialType]);

  useEffect(() => {
    setSelectedCity(initialCity);
  }, [initialCity]);

  useEffect(() => {
    setSelectedDate(initialDate);
  }, [initialDate]);

  const eventTypes = useMemo(() => eventTypesRes?.data || [], [eventTypesRes]);
  const events = useMemo(() => eventsRes?.data || [], [eventsRes]);

  const activeCategoryObj: any = useMemo(
    () => eventTypes.find((et: any) => et.slug === selectedType),
    [eventTypes, selectedType]
  );

  const filteredEvents = useMemo(() => {
    return events.filter((ev: any) => {
      const evSlug = ev.eventType?.slug || "";
      const matchesType =
        !selectedType || selectedType === "all" || evSlug === selectedType;

      const matchesCity =
        !selectedCity ||
        selectedCity === "all" ||
        (ev.venue || "").toLowerCase().includes(selectedCity.toLowerCase()) ||
        (ev.title || "").toLowerCase().includes(selectedCity.toLowerCase());

      const evDateStr = ev.eventDate
        ? new Date(ev.eventDate).toISOString().split("T")[0]
        : "";
      const matchesDate = !selectedDate || evDateStr === selectedDate;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (ev.title || "").toLowerCase().includes(q) ||
        (ev.venue || "").toLowerCase().includes(q) ||
        (ev.description || "").toLowerCase().includes(q) ||
        (ev.eventType?.name || "").toLowerCase().includes(q);

      return matchesType && matchesCity && matchesDate && matchesSearch;
    });
  }, [events, selectedType, selectedCity, selectedDate, searchQuery]);

  // Build category-aware hero content & background image slider
  const heroContent = useMemo(() => {
    const s = (selectedType || "all").toLowerCase();

    let localSlides = [
      "/images/hero/hero-seamless-1.jpg",
      "/images/categories/wedding.jpg",
      "/images/categories/birthday.jpg",
      "/images/categories/corporate.jpg",
      "/images/categories/concert.jpg",
    ];
    let badge = "Live Event Showcase & AI Photo Galleries";
    let title = "Explore Curated Events Across Bangladesh";
    let description =
      "Discover real celebrations, browse verified event categories, and access instant AI-powered guest photo galleries.";

    if (s.includes("wedding")) {
      localSlides = [
        "/images/categories/wedding.jpg",
        "/images/hero/hero-seamless-1.jpg",
        "/images/hero/hero-seamless-2.jpg",
      ];
      badge = "Wedding Celebrations • Royal Stages & AI Gallery";
      title = "Luxury Weddings, Holud & Reception Galas";
      description =
        activeCategoryObj?.description ||
        "Plan unforgettable Bangladeshi weddings with floral mandaps, 4K cinema, Shahi Kacchi catering, and instant AI guest photo delivery.";
    } else if (s.includes("birthday")) {
      localSlides = [
        "/images/categories/birthday.jpg",
        "/images/hero/hero-eventora-2.jpg",
        "/images/categories/get-together.jpg",
      ];
      badge = "Birthday Parties • Custom Themes & Cakes";
      title = "Themed Birthday Parties & Milestone Celebrations";
      description =
        activeCategoryObj?.description ||
        "Celebrate with designer cakes, balloon arches, live entertainment, and instant AI selfie photo albums for every guest.";
    } else if (s.includes("get-together")) {
      localSlides = [
        "/images/categories/get-together.jpg",
        "/images/hero/hero-eventora-2.jpg",
        "/images/categories/birthday.jpg",
      ];
      badge = "Get Together • Family & Alumni Reunions";
      title = "Memorable Get-Togethers & Private Dinners";
      description =
        activeCategoryObj?.description ||
        "Host warm family reunions, alumni meetups, and outdoor festivities with curated catering and shared AI photo pools.";
    } else if (s.includes("corporate")) {
      localSlides = [
        "/images/categories/corporate.jpg",
        "/images/categories/concert.jpg",
        "/images/hero/hero-eventora-3.jpg",
      ];
      badge = "Corporate Events • Summits, Launches & Galas";
      title = "Executive Conferences, Launches & Corporate Galas";
      description =
        activeCategoryObj?.description ||
        "End-to-end corporate production, stage AV, executive hospitality, and instant branded AI photo delivery for attendees.";
    } else if (s.includes("engagement")) {
      localSlides = [
        "/images/hero/hero-seamless-2.jpg",
        "/images/categories/wedding.jpg",
        "/images/hero/hero-seamless-1.jpg",
      ];
      badge = "Engagement Ceremonies • Ring Exchange & Decor";
      title = "Romantic Engagement & Ring Exchange Ceremonies";
      description =
        activeCategoryObj?.description ||
        "Bespoke floral backdrops, candlelight ambiences, fine dining, and instant AI facial-recognition photo sharing.";
    } else if (s.includes("anniversary")) {
      localSlides = [
        "/images/hero/hero-seamless-1.jpg",
        "/images/hero/hero-seamless-2.jpg",
        "/images/categories/get-together.jpg",
      ];
      badge = "Anniversary Galas • Cherished Milestones";
      title = "Cherished Anniversary & Milestone Celebrations";
      description =
        activeCategoryObj?.description ||
        "Celebrate timeless love with vintage floral setups, acoustic music, gourmet dining, and AI memory albums.";
    } else if (s.includes("concert") || s.includes("show")) {
      localSlides = [
        "/images/categories/concert.jpg",
        "/images/categories/corporate.jpg",
        "/images/hero/hero-eventora-3.jpg",
      ];
      badge = "Live Concerts & Cultural Shows";
      title = "Concerts, Festivals & Stage Productions";
      description =
        activeCategoryObj?.description ||
        "High-energy stage lighting, line-array sound systems, and high-speed AI photo galleries.";
    } else if (activeCategoryObj) {
      badge = `${activeCategoryObj.name} • Verified Showcase`;
      title = `${activeCategoryObj.name} Celebrations & AI Galleries`;
      description = activeCategoryObj.description || description;
    }

    const dynamicImages = [
      activeCategoryObj?.imageUrl,
      activeCategoryObj?.coverImage,
      ...filteredEvents.map((ev: any) => ev.coverImage),
    ].filter(Boolean) as string[];

    const slides = Array.from(new Set([...dynamicImages, ...localSlides])).slice(
      0,
      5
    );

    return {
      badge,
      title,
      description,
      slides,
    };
  }, [selectedType, activeCategoryObj, filteredEvents]);

  useEffect(() => {
    if (heroContent.slides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroContent.slides.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [heroContent.slides.length]);

  const handleSelectCategory = (slug: string) => {
    setSelectedType(slug);
    setActiveSlide(0);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") params.delete("type");
    else params.set("type", slug);
    const qs = params.toString();
    router.replace(`/events${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const isLoading = typesLoading || eventsLoading;

  return (
    <div className="w-full bg-[#F8FAFC] min-h-[85vh] pb-16">
      {/* 1. Category-Aware Hero Banner with Autoplay Background Slider */}
      <section className="relative w-full overflow-hidden bg-[#160D3A] text-white py-10 lg:py-14">
        {/* Background Autoplay Image Slider */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          {heroContent.slides.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                activeSlide === idx
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <Image
                src={src}
                alt={heroContent.title}
                fill
                unoptimized
                priority={idx === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          ))}
          {/* Rich Royal-Violet & Dark Gradient Overlay for Crisp Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#120A33]/92 via-[#24125E]/82 to-[#120A33]/70" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120A33]/90 to-transparent" />
        </div>

        <Container className="relative z-10 space-y-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#F5B942] text-[11px] font-extrabold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{heroContent.badge}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight leading-tight text-white">
              {heroContent.title}
            </h1>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl">
              {heroContent.description}
            </p>
          </div>

          {/* Compact Search & Dynamic City Filter Bar (Matched Width to Category Pills) */}
          <div className="w-full max-w-[680px] p-2 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/40 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by event name, venue, or keyword..."
                className="pl-10 pr-4 h-9 text-xs rounded-xl bg-slate-50 border-slate-200 text-slate-800"
              />
            </div>

            <div className="w-full sm:w-44 shrink-0">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="h-9 rounded-xl bg-slate-50 border-slate-200 text-xs font-bold text-[#172554]">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedDate && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-[#7C3AED] shrink-0">
                <Calendar className="w-3.5 h-3.5" />
                <span>{selectedDate}</span>
                <button
                  type="button"
                  onClick={() => setSelectedDate("")}
                  className="hover:text-rose-600 ml-1"
                >
                  ✕
                </button>
              </span>
            )}
          </div>

          {/* Dynamic Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => handleSelectCategory("all")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedType === "all"
                  ? "bg-white text-[#17123B] shadow-md"
                  : "bg-white/12 text-white/90 hover:bg-white/20 border border-white/20"
              }`}
            >
              All Categories
            </button>
            {eventTypes.map((et: any) => (
              <button
                key={et.id}
                type="button"
                onClick={() => handleSelectCategory(et.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedType === et.slug
                    ? "bg-white text-[#17123B] shadow-md"
                    : "bg-white/12 text-white/90 hover:bg-white/20 border border-white/20"
                }`}
              >
                {et.name}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. Live Events Grid */}
      <Container className="pt-8 lg:pt-10 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-bold text-slate-600">
            Showing{" "}
            <span className="text-[#7C3AED] font-extrabold">
              {filteredEvents.length}
            </span>{" "}
            {selectedType === "all" ? "events" : `${heroContent.title} events`}
          </p>
          {(selectedType !== "all" || selectedCity !== "all" || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                handleSelectCategory("all");
                setSelectedCity("all");
                setSelectedDate("");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-[#7C3AED] hover:underline"
            >
              Clear All Filters ✕
            </button>
          )}
        </div>

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
          <div className="text-center py-14 bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-xl mx-auto space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-extrabold text-[#172554]">
              No matching events found
            </h3>
            <p className="text-xs text-slate-500">
              Try clearing your filters or create a brand new event workspace in your dashboard!
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  handleSelectCategory("all");
                  setSelectedCity("all");
                  setSelectedDate("");
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
                "/images/categories/wedding.jpg";
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

                    {ev.eventType?.name && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#172554] text-[10px] font-extrabold shadow-xs">
                        {ev.eventType.name}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold">
                      <Calendar className="w-3 h-3 text-[#F5B942]" />
                      <span>{dateLabel}</span>
                    </div>

                    {ev.guestCount && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-semibold">
                        <Users className="w-3 h-3 text-purple-300" />
                        <span>{ev.guestCount} Guests</span>
                      </div>
                    )}
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
                      {ev.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {ev.description}
                        </p>
                      )}
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
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#172554] hover:bg-[#7C3AED] text-white text-xs font-bold transition"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-slate-400">
          Loading events showcase...
        </div>
      }
    >
      <EventsExplorer />
    </Suspense>
  );
}
