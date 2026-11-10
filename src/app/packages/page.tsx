"use client";

import React from "react";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { Check, Sparkles, ArrowRight, HardDrive } from "lucide-react";
import Link from "next/link";

export default function PackagesPage() {
  const { data: storagePackagesRes } = useGetAllPackagesQuery(undefined);
  const storagePlans = storagePackagesRes?.data || [];

  const eventPackages = [
    {
      id: "wedding",
      title: "Elegant Wedding",
      badge: "Most Popular",
      price: "৳45,000",
      guests: "Up to 100 guests",
      features: [
        "Full floral stage & entrance gate decoration",
        "1 Professional Photographer (Unlimited shots)",
        "Buffet Catering service management",
        "AI Facial Photo Share for all guests",
        "Dedicated event coordinator",
      ],
    },
    {
      id: "birthday",
      title: "Birthday Celebration",
      badge: "Best Value",
      price: "৳18,000",
      guests: "Up to 50 guests",
      features: [
        "Themed balloon arch & photo backdrop",
        "Custom 3-Tier Designer Cake",
        "Birthday event photography (200+ photos)",
        "Music & Sound system setup",
        "Fast digital photo delivery",
      ],
    },
    {
      id: "corporate",
      title: "Corporate Meetup",
      badge: "Executive",
      price: "৳32,000",
      guests: "Up to 100 guests",
      features: [
        "Conference hall seating & podium setup",
        "Projector screen, mics & sound technician",
        "Gourmet tea breaks & buffet lunch",
        "Corporate photography & videography",
        "Complete event coordination",
      ],
    },
  ];

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Featured Event Packages */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>All-Inclusive Curated Packages</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
              Featured Event Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Transparent, fixed-price packages combining top vendors, decoration, photography, and catering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {eventPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold">
                      {pkg.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">{pkg.guests}</span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#172554] mt-4">{pkg.title}</h3>

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#7C3AED]">{pkg.price}</span>
                    <span className="text-xs text-slate-400 font-medium">all-inclusive</span>
                  </div>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    href={`/register`}
                    className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Book This Package</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: AI Photo Share Storage Plans */}
        <div id="storage" className="pt-10 border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 mb-3">
              <HardDrive className="w-3.5 h-3.5" />
              <span>AI Face-Match Quotas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              AI Photo Delivery Plans
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Storage quotas for photographers and hosts to host high-res event galleries and face scans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storagePlans.map((sp: any) => (
              <div
                key={sp.id}
                className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-[#172554]">{sp.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-[#172554]">
                      {sp.price === 0 ? "Free" : `৳${sp.price}`}
                    </span>
                    <span className="text-xs text-slate-400">/ {sp.durationDays} days</span>
                  </div>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>
                      {sp.storageLimitMB >= 1000
                        ? `${(sp.storageLimitMB / 1000).toFixed(0)} GB High-Speed Storage`
                        : `${sp.storageLimitMB} MB Storage`}
                    </span>
                  </div>

                  {sp.description && Array.isArray(sp.description) && (
                    <ul className="mt-6 space-y-2 text-xs text-slate-600">
                      {sp.description.map((d: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <Link
                    href={`/register?packageId=${sp.id}`}
                    className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED] text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <span>Choose Plan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

