"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Building,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Users,
} from "lucide-react";

interface LocationHub {
  id: string;
  city: string;
  division: string;
  badge: string;
  popularVenues: string[];
  popularEvents: string[];
  vendorCount: string;
  description: string;
  bgGradient: string;
}

const REGIONS: LocationHub[] = [
  {
    id: "dhaka",
    city: "Dhaka Metropolitan",
    division: "Gulshan • Banani • Dhanmondi • Uttara • Mirpur",
    badge: "Most Popular Hub",
    popularVenues: [
      "ICCB (Bashundhara)",
      "Sena Maloncho (Cantonment)",
      "Radisson Blu Water Garden",
      "Aloki Convention Center",
      "Lakeshore Hotel Gulshan",
    ],
    popularEvents: [
      "Royal Wedding & Bou Bhat",
      "Gaye Holud & Sangeet",
      "Corporate Summits & AGMs",
    ],
    vendorCount: "150+ Verified Vendors",
    description:
      "Dhaka's prime destination for grand wedding banquets, customized 4K cinematography, and AI selfie photo sharing across top luxury convention centers.",
    bgGradient: "from-[#172554] via-[#1E1B4B] to-[#4C1D95]",
  },
  {
    id: "chittagong",
    city: "Chittagong Port City",
    division: "GEC Circle • Agrabad • Nasirabad • Khulshi",
    badge: "Port City Elite",
    popularVenues: [
      "Radisson Blu Bay View",
      "The Peninsula Chittagong",
      "Kisholoy Community Center",
      "King of Chittagong",
    ],
    popularEvents: [
      "Traditional Mezban Catering",
      "Elite Wedding Receptions",
      "Industrial & Port Galas",
    ],
    vendorCount: "60+ Verified Vendors",
    description:
      "Renowned for authentic Chittagonian Mezban catering, bespoke floral mandaps, and instant digital photo delivery for hundreds of celebratory guests.",
    bgGradient: "from-[#0F172A] via-[#1E3A8A] to-[#1E1B4B]",
  },
  {
    id: "sylhet",
    city: "Sylhet Tea Capital",
    division: "Zindabazar • Upashahar • Shahjalal Uposhohor",
    badge: "Heritage & Diaspora",
    popularVenues: [
      "Rose View Hotel",
      "Grand Sylhet Hotel & Resort",
      "Nazimgarh Wilderness",
      "Amanullah Convention Hall",
    ],
    popularEvents: [
      "Expat Wedding Receptions",
      "Garden Ceremonies",
      "Traditional Walima",
    ],
    vendorCount: "40+ Verified Vendors",
    description:
      "Specialized in luxury diaspora weddings and picturesque garden ceremonies with instant AI facial recognition photo portals for overseas guests.",
    bgGradient: "from-[#064E3B] via-[#065F46] to-[#172554]",
  },
  {
    id: "coxs-bazar",
    city: "Cox's Bazar Coast",
    division: "Inani Beach • Marine Drive • Kolatoli",
    badge: "Destination Weddings",
    popularVenues: [
      "Sayeman Beach Resort",
      "Royal Tulip Sea Pearl",
      "Long Beach Hotel",
      "Ocean Paradise Resort",
    ],
    popularEvents: [
      "Sunset Beach Weddings",
      "Corporate Retreats",
      "Destination Anniversaries",
    ],
    vendorCount: "25+ Verified Vendors",
    description:
      "Bangladesh's premier seaside celebration hub. Experience sunset beach mandaps, coastal barbecues, drone video coverage, and instant photo distribution.",
    bgGradient: "from-[#7C2D12] via-[#9A3412] to-[#172554]",
  },
];

const POPULAR_SEARCH_TERMS = [
  "Wedding Planner in Dhaka",
  "Kacchi Biryani Catering Bangladesh",
  "AI Face Photo Sharing for Weddings",
  "Gaye Holud Stage Decoration Dhaka",
  "Best Convention Halls in Gulshan & Banani",
  "4K Wedding Cinematography Bangladesh",
  "Birthday Party Decorator Uttara",
  "Corporate Event Management Chittagong",
  "Destination Wedding in Cox's Bazar",
  "Sylhet Wedding Packages with Photography",
];

export default function SeoLocationsAndVenues() {
  const [activeRegion, setActiveRegion] = useState<string>("dhaka");
  const selected = REGIONS.find((r) => r.id === activeRegion) || REGIONS[0];

  return (
    <section className="w-full py-16 lg:py-24 bg-white border-t border-slate-200/80">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 mb-2">
              <MapPin className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Nationwide Coverage &amp; Venues</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight">
              Event Management Across Bangladesh
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              From grand banquets in Dhaka convention centers to destination beach
              weddings in Cox&apos;s Bazar, Eventora connects you to verified local
              vendors and instant AI photo delivery.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] group self-start sm:self-auto"
          >
            <span>Browse All Venues &amp; Cities</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Region Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {REGIONS.map((region) => {
            const isActive = activeRegion === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => setActiveRegion(region.id)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-[#172554] text-white shadow-md shadow-[#172554]/20 scale-[1.02]"
                    : "bg-slate-50 text-slate-600 hover:bg-purple-50 hover:text-[#7C3AED] border border-slate-200/80"
                }`}
              >
                <MapPin
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#F5B942]" : "text-slate-400"
                  }`}
                />
                <span>{region.city}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F5B942]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Region Showcase Banner */}
        <div
          className={`relative rounded-3xl bg-gradient-to-br ${selected.bgGradient} text-white p-6 sm:p-8 lg:p-10 shadow-xl overflow-hidden border border-white/10`}
        >
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[11px] font-bold text-amber-300">
                  {selected.badge}
                </span>
                <span className="text-xs text-purple-200 font-semibold">
                  {selected.division}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {selected.city}
              </h3>

              <p className="text-xs sm:text-sm text-slate-200/90 leading-relaxed max-w-xl">
                {selected.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 mb-1.5">
                    Popular Convention Centers
                  </div>
                  <ul className="space-y-1 text-xs text-white/90 font-medium">
                    {selected.popularVenues.slice(0, 3).map((v) => (
                      <li key={v} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 mb-1.5">
                    Signature Celebrations
                  </div>
                  <ul className="space-y-1 text-xs text-white/90 font-medium">
                    {selected.popularEvents.map((ev) => (
                      <li key={ev} className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
                        <span className="truncate">{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/events?location=${encodeURIComponent(
                    selected.city.split(" ")[0]
                  )}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs font-bold transition shadow-md"
                >
                  <span>Explore {selected.city.split(" ")[0]} Packages</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-xs text-purple-200 font-semibold">
                  {selected.vendorCount}
                </span>
              </div>
            </div>

            {/* Right Card: Quick District Keywords & Venue Directory (5 cols) */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/20 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  Top Partner Venues
                </h4>
                <Building className="w-4 h-4 text-amber-300" />
              </div>

              <div className="space-y-2">
                {selected.popularVenues.map((venue) => (
                  <div
                    key={venue}
                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition flex items-center justify-between text-xs font-semibold text-white/95"
                  >
                    <span className="truncate">{venue}</span>
                    <span className="text-[10px] text-amber-300 shrink-0 ml-2">
                      Verified Venue
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-black/20 border border-white/10 text-[11px] text-slate-300">
                💡 <strong>Host Tip:</strong> Eventora provides on-site QR standees
                for every partner venue so guests can access instant AI photo matching.
              </div>
            </div>
          </div>
        </div>

        {/* Popular SEO Search Tags & Topics for Organic Discovery */}
        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#172554]">
              Trending Wedding &amp; Event Searches in Bangladesh
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">
              SEO Keyword Directory
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_SEARCH_TERMS.map((term) => (
              <Link
                key={term}
                href={`/services?q=${encodeURIComponent(term)}`}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-[#7C3AED] hover:border-[#7C3AED]/40 transition shadow-2xs"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
