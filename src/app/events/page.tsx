"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { Search, Calendar, MapPin, Users, Star, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function EventsExplorer() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "wedding";

  const { data: eventTypesRes } = useGetAllEventTypesQuery();
  const { data: servicesRes } = useGetAllServicesQuery();

  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState("");

  const eventTypes = eventTypesRes?.data || [];
  const services = servicesRes?.data || [];

  const packages = [
    {
      id: "pkg-1",
      title: "Royal Grand Wedding Package",
      type: "wedding",
      guests: "150-300 Guests",
      price: "৳85,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      features: ["Grand Stage Decor", "2 Photographers + 1 Videographer", "Full Buffet Catering", "AI Photo Share Included"],
    },
    {
      id: "pkg-2",
      title: "Classic Birthday Celebration",
      type: "birthday",
      guests: "50-100 Guests",
      price: "৳25,000",
      rating: "4.8",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      features: ["Balloon Arch & Cake Table", "Birthday Photography", "Custom 3-Tier Cake", "Sound & Music System"],
    },
    {
      id: "pkg-3",
      title: "Executive Corporate Seminar",
      type: "corporate-event",
      guests: "100-250 Guests",
      price: "৳45,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
      features: ["Conference Hall Setup", "Projector & Sound", "Gourmet High Tea & Lunch", "Host Management"],
    },
    {
      id: "pkg-4",
      title: "Romantic Engagement Ceremony",
      type: "engagement",
      guests: "60-120 Guests",
      price: "৳35,000",
      rating: "4.9",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      features: ["Floral Ring Stage", "Engagement Photography", "Snacks & Sweets Catering", "AI Photo Match"],
    },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const matchesType = !selectedType || pkg.type === selectedType || selectedType === "all";
    const matchesSearch = pkg.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Curated Events</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Event Packages & Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Explore complete verified packages and services tailored for every celebration across Bangladesh.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
              selectedType === "all"
                ? "bg-[#7C3AED] text-white shadow-sm"
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
                  ? "bg-[#7C3AED] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {et.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search packages by keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-[11px] font-bold text-slate-800 shadow-xs">
                  <Star className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
                  <span>{pkg.rating}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-1">{pkg.guests}</p>

                  <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Starting From</span>
                    <span className="text-lg font-extrabold text-[#172554]">{pkg.price}</span>
                  </div>

                  <Link
                    href={`/dashboard?plan=${pkg.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>Plan Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading events...</div>}>
      <EventsExplorer />
    </Suspense>
  );
}

