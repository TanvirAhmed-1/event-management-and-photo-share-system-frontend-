"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
} from "lucide-react";

export default function HeroSection() {
  const router = useRouter();

  // Active event category tab
  const [activeTab, setActiveTab] = useState<string>("wedding");
  const [eventDate, setEventDate] = useState<string>("");
  const [location, setLocation] = useState<string>("Dhaka");
  const [guestCount, setGuestCount] = useState<string>("100");

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

  return (
    <section className="relative w-full pt-8 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      {/* Soft gradient background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#7C3AED]/10 via-[#F5B942]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Heading, Search & Trust (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* 1. Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-xs mb-6">
              <Sparkles className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
              <span>#1 Event Management Platform in Bangladesh</span>
            </div>

            {/* 2. Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#172554] tracking-tight leading-[1.15] mb-4">
              Plan Your <span className="text-[#7C3AED]">P</span>erfect Event <br className="hidden sm:inline" />
              with <span className="text-[#7C3AED] drop-shadow-xs">Eventora</span>
            </h1>

            {/* 3. Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
              Discover top services, delicious food and expert vendors for Weddings, Birthdays, Get-Togethers and more.
            </p>

            {/* 4. Search & Filter Box */}
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-slate-200/70 border border-slate-100 p-3 sm:p-4">
              {/* Category Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-slate-100 no-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/30"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Form Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-2 items-center">
                {/* Field 1: Event Date */}
                <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                  <Calendar className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Date</span>
                    <input
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Field 2: Location */}
                <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                  <MapPin className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <div className="flex flex-col text-left w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</span>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Cox's Bazar">Cox's Bazar</option>
                    </select>
                  </div>
                </div>

                {/* Field 3: Guests */}
                <div className="sm:col-span-3 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition border border-transparent hover:border-slate-200">
                  <Users className="w-4 h-4 text-[#7C3AED] shrink-0" />
                  <div className="flex flex-col text-left w-full">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Guests</span>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                    >
                      <option value="50">50 Guests</option>
                      <option value="100">100 Guests</option>
                      <option value="200">200 Guests</option>
                      <option value="350">350 Guests</option>
                      <option value="500">500+ Guests</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <div className="sm:col-span-3">
                  <button
                    onClick={handleSearch}
                    className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/30 transition-all duration-200 hover:scale-[1.02] active:scale-95"
                  >
                    <span>Search Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Trust Badges Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-8 text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#F5B942] fill-[#F5B942]" />
                <span>Trusted by 100K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#F5B942]" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-[#F5B942]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with South Asian Couple (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[460px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* High resolution South Asian wedding couple image */}
              <Image
                src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=900&auto=format&fit=crop"
                alt="Bangladeshi Bride and Groom in Traditional Wedding Attire"
                fill
                priority
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 460px"
              />

              {/* Gradient Overlay & Curved Bottom Flair */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#172554]/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Badge Overlay: "Your Dream Our Priority" */}
              <div className="absolute top-8 right-6 text-right">
                <div className="text-white text-xl sm:text-2xl font-serif italic font-medium tracking-wide drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] leading-tight">
                  Your Dream <br />
                  <span className="text-amber-200">Our Priority</span>
                </div>
              </div>

              {/* Bottom Subtle Violet Glow Arc */}
              <div className="absolute -bottom-10 -left-10 -right-10 h-32 bg-gradient-to-t from-[#7C3AED]/40 to-transparent blur-xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

