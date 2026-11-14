"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Heart,
  Cake,
  Users,
  Briefcase,
  Grid,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Headphones,
  Sparkles,
  Star,
  ScanFace,
  QrCode,
  Camera,
  CheckCircle2,
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  const [heroMode, setHeroMode] = useState<"plan" | "ai">("plan");
  const [activeTab, setActiveTab] = useState<string>("wedding");
  const [eventDate, setEventDate] = useState<string>("");
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [location, setLocation] = useState<string>("Dhaka");
  const [guestCount, setGuestCount] = useState<string>("100");
  const [eventCode, setEventCode] = useState<string>("");

  const tabs = [
    { id: "wedding", label: "Wedding", icon: Heart },
    { id: "birthday", label: "Birthday", icon: Cake },
    { id: "get-together", label: "Get Together", icon: Users },
    { id: "corporate", label: "Corporate", icon: Briefcase },
    { id: "others", label: "Others", icon: Grid },
  ];

  const handleSearch = () => {
    router.push(
      `/events?type=${activeTab}&date=${eventDate}&location=${encodeURIComponent(
        location
      )}&guests=${guestCount}`
    );
  };

  const handleAiPhotoSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const code = eventCode.trim();
    if (code) {
      router.push(`/guest/${encodeURIComponent(code)}`);
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
    <section className="relative w-full pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden bg-eventora-mesh">
      {/* Ambient Decorative Glows */}
      <div className="absolute -top-20 right-0 w-[640px] h-[640px] bg-gradient-to-br from-[#7C3AED]/15 via-[#F5B942]/12 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 -left-24 w-[420px] h-[420px] bg-gradient-to-tr from-[#4F46E5]/10 via-[#7C3AED]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Editorial Headline, Dual-Mode Card & Social Proof (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-amber-200/80 text-[#172554] text-xs font-bold shadow-sm mb-6 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
              <span>#1 Event Management &amp; AI Photo Platform in Bangladesh</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#172554] tracking-tight leading-[1.08] mb-5 motion-preset-slide-up-md motion-preset-fade motion-duration-700 motion-delay-100">
              Plan Extraordinary Events &amp;{" "}
              <span className="text-brand-gradient">
                Share Every Memory with AI
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-8 motion-preset-slide-up-sm motion-preset-fade motion-duration-700 motion-delay-150">
              Curate dream weddings, birthdays, and corporate galas with verified
              vendors, gourmet Kacchi catering, and instant facial-recognition
              photo delivery for every guest.
            </p>

            {/* Dual-Mode Interactive Search / Action Card */}
            <div className="w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/80 p-3.5 sm:p-5 motion-preset-slide-up-md motion-preset-fade motion-duration-700 motion-delay-200">
              {/* Top Mode Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 mb-3.5 border-b border-slate-100">
                <div className="inline-flex p-1 rounded-2xl bg-slate-100/90 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setHeroMode("plan")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      heroMode === "plan"
                        ? "bg-white text-[#172554] shadow-sm"
                        : "text-slate-500 hover:text-[#172554]"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Plan &amp; Book Event</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroMode("ai")}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      heroMode === "ai"
                        ? "bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white shadow-sm"
                        : "text-slate-500 hover:text-[#7C3AED]"
                    }`}
                  >
                    <ScanFace className="w-3.5 h-3.5" />
                    <span>AI Photo Finder</span>
                  </button>
                </div>

                <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
                  {heroMode === "plan"
                    ? "Verified vendors across 64 districts"
                    : "Sub-0.2s selfie matching"}
                </span>
              </div>

              {heroMode === "plan" ? (
                <>
                  {/* Category Selector Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-3.5 mb-3.5 border-b border-slate-100 no-scrollbar">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap ${
                            isActive
                              ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                              : "bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-[#7C3AED]"
                          }`}
                        >
                          <Icon
                            className={`w-3.5 h-3.5 ${
                              isActive ? "text-white" : "text-slate-400"
                            }`}
                          />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Form Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                    <div className="sm:col-span-3">
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger>
                          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition border border-slate-200/60 cursor-pointer">
                            <Calendar className="w-4 h-4 text-[#7C3AED] shrink-0" />
                            <div className="flex flex-col text-left min-w-0">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                Event Date
                              </span>
                              <span className="text-xs font-bold text-[#172554] truncate">
                                {eventDate
                                  ? format(new Date(`${eventDate}T00:00:00`), "MMM dd, yyyy")
                                  : "Select Date"}
                              </span>
                            </div>
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-1">
                          <ShadcnCalendar
                            mode="single"
                            selected={eventDate ? new Date(`${eventDate}T00:00:00`) : undefined}
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

                    <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition border border-slate-200/60">
                      <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <div className="flex flex-col text-left w-full min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          City
                        </span>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="h-6 border-0 bg-transparent px-0 py-0 text-xs font-bold text-[#172554] shadow-none focus:ring-0">
                            <SelectValue placeholder="City" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dhaka">Dhaka</SelectItem>
                            <SelectItem value="Chittagong">Chittagong</SelectItem>
                            <SelectItem value="Sylhet">Sylhet</SelectItem>
                            <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                            <SelectItem value="Cox's Bazar">Cox&apos;s Bazar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100/70 transition border border-slate-200/60">
                      <Users className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <div className="flex flex-col text-left w-full min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Guests
                        </span>
                        <Select value={guestCount} onValueChange={setGuestCount}>
                          <SelectTrigger className="h-6 border-0 bg-transparent px-0 py-0 text-xs font-bold text-[#172554] shadow-none focus:ring-0">
                            <SelectValue placeholder="Guests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="50">50 Guests</SelectItem>
                            <SelectItem value="100">100 Guests</SelectItem>
                            <SelectItem value="200">200 Guests</SelectItem>
                            <SelectItem value="350">350 Guests</SelectItem>
                            <SelectItem value="500">500+ Guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full flex items-center justify-center gap-1.5 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white text-xs font-extrabold shadow-lg shadow-[#7C3AED]/25 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                      >
                        <span>Explore Packages</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={handleAiPhotoSearch}
                  className="space-y-3 motion-preset-fade motion-duration-300"
                >
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <div className="flex-1 flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 focus-within:border-[#7C3AED] focus-within:bg-white transition">
                      <QrCode className="w-4 h-4 text-[#7C3AED] shrink-0" />
                      <Input
                        type="text"
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value)}
                        placeholder="Enter Event ID / Code (or leave blank to browse active events)..."
                        className="border-0 bg-transparent px-0 py-1 h-8 text-xs font-semibold text-[#172554] placeholder:text-slate-400 focus-visible:ring-0 shadow-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#172554] to-[#4C1D95] hover:from-[#1E3A8A] hover:to-[#6D28D9] text-white text-xs font-extrabold shadow-lg transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
                    >
                      <Camera className="w-4 h-4 text-[#F5B942]" />
                      <span>Scan Selfie &amp; Find Photos</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      Zero-storage selfie matching — 100% private
                    </span>
                    <Link
                      href="/guest"
                      className="font-bold text-[#7C3AED] hover:underline"
                    >
                      Browse all live event galleries →
                    </Link>
                  </div>
                </form>
              )}
            </div>

            {/* Editorial Social Proof Strip & Verified Trust Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mt-8 pt-6 border-t border-slate-200/70 w-full max-w-2xl motion-preset-fade motion-duration-700 motion-delay-300">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {socialAvatars.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white shadow-sm"
                    >
                      <Image
                        src={src}
                        alt="Happy Eventora client"
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]"
                      />
                    ))}
                    <span className="text-xs font-extrabold text-[#172554] ml-1">
                      4.9/5
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500">
                    Trusted by 100K+ Users
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-[#F5B942]" />
                  <span>24/7 Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Visual Showcase with Glassmorphic Floating Cards (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px]">
              {/* Main Hero Portrait Frame */}
              <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-900/20 border-4 border-white motion-preset-slide-left-md motion-preset-fade motion-duration-700 motion-delay-150">
                <Image
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop"
                  alt="Bangladeshi Bride and Groom in Traditional Wedding Attire"
                  fill
                  priority
                  className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 460px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/80 via-[#172554]/10 to-transparent pointer-events-none" />

                {/* Top-Right Badge: Instant QR Guest Sharing */}
                <div className="absolute top-5 right-5 px-3.5 py-2 rounded-2xl glass-dark text-white shadow-xl flex items-center gap-2 motion-preset-slide-down-sm motion-preset-fade motion-duration-500 motion-delay-300">
                  <QrCode className="w-4 h-4 text-[#F5B942]" />
                  <span className="text-[11px] font-bold tracking-wide">
                    Instant QR Guest Sharing
                  </span>
                </div>

                {/* Bottom-Left Glassmorphic Card: All-in-One Event Marketplace */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl glass-panel shadow-xl">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
                        All-in-One Event Marketplace
                      </div>
                      <div className="text-xs sm:text-sm font-extrabold text-[#172554] mt-0.5">
                        Decor • Catering • Photography • Venues
                      </div>
                    </div>
                    <Link
                      href="/packages"
                      className="w-9 h-9 rounded-xl bg-[#172554] text-white flex items-center justify-center shrink-0 hover:bg-[#7C3AED] transition-colors"
                      title="Explore packages"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Top-Left Floating Glassmorphic Card: AI Facial Recognition Match */}
              <div className="hidden sm:flex items-center gap-3 p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl border border-purple-100 shadow-2xl shadow-[#7C3AED]/15 absolute -left-8 top-12 max-w-[250px] motion-preset-slide-right-md motion-preset-fade motion-duration-700 motion-delay-300">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] text-white flex items-center justify-center shrink-0 shadow-md">
                  <ScanFace className="w-5 h-5 text-[#F5B942]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold text-[#172554]">
                    AI Facial Recognition Match
                  </div>
                  <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                    99.4% Precision • 24 Photos in 0.18s
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
