"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
import {
  Calendar,
  MapPin,
  ArrowRight,
  ScanFace,
  QrCode,
  Camera,
  CheckCircle2,
} from "lucide-react";


export default function HeroSection() {
  const router = useRouter();
  const { data: settingsRes } = useGetPlatformSettingsQuery();

  const cities: string[] = Array.isArray(settingsRes?.data?.serviceCities)
    ? settingsRes.data.serviceCities
    : [];

  const [heroMode, setHeroMode] = useState<"plan" | "ai">("plan");
  const [eventDate, setEventDate] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("all");
  const [eventCode, setEventCode] = useState<string>("");
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const heroSlides = [
    {
      src: "/images/hero/hero-seamless-1.jpg",
      alt: "Bangladeshi Bride and Groom under Floral Arch",
    },
    {
      src: "/images/hero/hero-seamless-2.jpg",
      alt: "Bangladeshi Wedding Reception Stage Celebration",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location && location !== "all") params.set("city", location);
    if (eventDate) params.set("date", eventDate);
    const qs = params.toString();
    router.push(`/events${qs ? `?${qs}` : ""}`);
  };

  const handleAiPhotoSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = eventCode.trim();
    if (trimmed) {
      router.push(`/guest/${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/guest");
    }
  };

  const socialAvatars = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=120&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=120&auto=format&fit=crop",
  ];

  return (
    <section className="relative w-full overflow-x-clip bg-[#F6F4FF] z-20">
      {/* Full-Bleed Seamless Right Hero Background */}
      <div className="relative lg:min-h-[490px] flex flex-col justify-center">
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[64%] pointer-events-none select-none z-0 overflow-hidden">
          {heroSlides.map((slide, idx) => (
            <div
              key={slide.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSlide === idx ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                unoptimized
                priority={idx === 0}
                className="object-cover object-[78%_18%]"
                sizes="65vw"
              />
            </div>
          ))}
          {/* Smooth left, top & bottom feathering so couple stays sharp while melting into #F6F4FF */}
          <div className="absolute inset-y-0 left-0 w-[44%] bg-gradient-to-r from-[#F6F4FF] via-[#F6F4FF]/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F6F4FF] via-[#F6F4FF]/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#F6F4FF]/60 to-transparent" />
        </div>

        {/* Main Content Container */}
        <Container className="relative z-10 pt-10 lg:pt-14 pb-10 lg:pb-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Balanced Editorial Headline, Subtitle & Sleek Low-Height Search Card (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start">
              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-[#11183B] tracking-tight leading-[1.12] mb-3.5">
                Plan Your Perfect Event <br />
                &amp; Find Every Memory{" "}
                <span className="relative inline-block text-[#8B5CF6]">
                  with AI
                  <svg
                    className="w-full h-2 -mt-0.5 text-[#A78BFA]/75"
                    viewBox="0 0 180 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9C45 3 125 2 177 7"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 text-xs sm:text-[15px] max-w-lg leading-relaxed mb-6">
                Eventora is a complete{" "}
                <strong className="font-bold text-[#11183B]">
                  Event Management Marketplace
                </strong>{" "}
                &amp;{" "}
                <strong className="font-bold text-[#11183B]">
                  AI-Powered Guest Photo Delivery Platform
                </strong>{" "}
                for weddings, parties, and all special occasions.
              </p>

              {/* Sleek Low-Profile Search Bar */}
              <div className="w-full max-w-[560px] rounded-2xl bg-white/95 backdrop-blur-xl shadow-lg shadow-purple-950/5 border border-purple-100/90 p-2 sm:p-2.5">
                {/* Compact Mode Switcher Tabs */}
                <div className="flex items-center gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => setHeroMode("plan")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${heroMode === "plan"
                      ? "bg-purple-50 text-[#7C3AED] border border-purple-200/80 shadow-2xs"
                      : "text-slate-500 hover:text-[#11183B]"
                      }`}
                  >
                    <Calendar className="w-3 h-3 text-[#7C3AED]" />
                    <span>Find Events</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroMode("ai")}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${heroMode === "ai"
                      ? "bg-purple-50 text-[#7C3AED] border border-purple-200/80 shadow-2xs"
                      : "text-slate-600 hover:text-[#7C3AED]"
                      }`}
                  >
                    <ScanFace className="w-3 h-3 text-[#7C3AED]" />
                    <span>Find Your Photos</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#8B5CF6] text-white text-[8px] font-extrabold uppercase tracking-wider">
                      NEW
                    </span>
                  </button>
                </div>

                {heroMode === "plan" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-1.5 sm:gap-0 bg-[#F9F8FF] rounded-xl px-2 py-1.5 border border-purple-100/80 sm:divide-x sm:divide-slate-200/70">
                    {/* Event Date (4 cols) */}
                    <div className="sm:col-span-4 px-2 py-0.5">
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-[#7C3AED] flex items-center justify-center shrink-0">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <div className="flex flex-col text-left min-w-0 leading-tight">
                              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                Event Date
                              </span>
                              <span className="text-[11px] font-bold text-[#11183B] truncate">
                                {eventDate
                                  ? format(new Date(`${eventDate}T00:00:00`), "MMM dd, yyyy")
                                  : "Select Date ▾"}
                              </span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-1">
                          <ShadcnCalendar
                            mode="single"
                            selected={
                              eventDate ? new Date(`${eventDate}T00:00:00`) : undefined
                            }
                            onSelect={(d) => {
                              if (d) {
                                setEventDate(format(d, "yyyy-MM-dd"));
                                setCalendarOpen(false);
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Dynamic City from Admin Settings (4 cols) */}
                    <div className="sm:col-span-4 px-2.5 py-0.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100/80 text-[#7C3AED] flex items-center justify-center shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex flex-col text-left w-full min-w-0 leading-tight">
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                          City
                        </span>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="h-4 border-0 bg-transparent px-0 py-0 text-[11px] font-bold text-[#11183B] shadow-none focus:ring-0">
                            <SelectValue placeholder="All Cities" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {cities.map((cityName) => (
                              <SelectItem key={cityName} value={cityName}>
                                {cityName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Search Events Button (4 cols) */}
                    <div className="sm:col-span-4 pl-2">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-[11px] font-extrabold shadow-md shadow-[#7C3AED]/25 transition-all hover:scale-[1.01] active:scale-95 whitespace-nowrap"
                      >
                        <span>Search Events</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleAiPhotoSearch} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row gap-1.5">
                      <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F9F8FF] border border-purple-100">
                        <QrCode className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                        <Input
                          type="text"
                          value={eventCode}
                          onChange={(e) => setEventCode(e.target.value)}
                          placeholder="Enter Event ID / Code (or leave blank)..."
                          className="border-0 bg-transparent px-0 py-0.5 h-7 text-[11px] font-semibold text-[#11183B] placeholder:text-slate-400 focus-visible:ring-0 shadow-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-[11px] font-extrabold shadow-md shadow-[#7C3AED]/25 transition-all hover:scale-[1.01] whitespace-nowrap"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Find Photos →</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right Column: Mobile Hero Preview & Unobtrusive Floating AI Photo Finder Card (5 cols) */}
            <div className="lg:col-span-5 relative flex flex-col items-end justify-end min-h-[240px] lg:min-h-[390px]">
              {/* Mobile-only seamless image */}
              <div className="lg:hidden relative w-full aspect-[16/10] rounded-3xl overflow-hidden mb-4">
                <Image
                  src={heroSlides[activeSlide].src}
                  alt={heroSlides[activeSlide].alt}
                  fill
                  unoptimized
                  priority
                  className="object-cover object-[75%_18%]"
                  sizes="100vw"
                />
              </div>

              {/* Compact Floating Glassmorphic AI Photo Finder Card */}
              <Link
                href="/guest"
                className="group w-full sm:w-[310px] rounded-2xl bg-white/90 backdrop-blur-xl border border-white p-3.5 sm:p-4 shadow-xl shadow-purple-950/15 flex items-center justify-between gap-3 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#7C3AED]/25">
                  <ScanFace className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-extrabold text-[#11183B]">
                    AI Photo Finder
                  </div>
                  <p className="text-[11px] font-medium text-slate-600 leading-snug mt-0.5">
                    Upload a selfie &amp; find your photos instantly!
                  </p>
                </div>

                <div className="w-7 h-7 rounded-full bg-[#11183B] group-hover:bg-[#7C3AED] text-white flex items-center justify-center shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
