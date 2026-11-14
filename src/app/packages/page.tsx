"use client";

import React from "react";
import Image from "next/image";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import { Check, Sparkles, ArrowRight, HardDrive, Users, Crown } from "lucide-react";
import Link from "next/link";

export default function PackagesPage() {
  const { data: storagePackagesRes, isLoading: plansLoading } = useGetAllPackagesQuery(undefined);
  const { data: eventTypesRes, isLoading: typesLoading } = useGetAllEventTypesQuery();

  const storagePlans = storagePackagesRes?.data || [];
  const eventTypes = eventTypesRes?.data || [];

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC] min-h-[80vh]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section 1: Live Event Categories & Curated Packages */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dynamic Event Workspaces</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
              Curated Celebration Packages
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Build your custom wedding, birthday, or corporate event package with transparent BDT pricing and AI photo delivery.
            </p>
          </div>

          {typesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
                >
                  <div className="w-full h-44 bg-slate-200 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="w-1/2 h-5 bg-slate-200 rounded animate-pulse" />
                    <div className="w-full h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="w-3/4 h-3 bg-slate-100 rounded animate-pulse" />
                    <div className="pt-4">
                      <div className="w-full h-10 bg-slate-200 rounded-xl animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventTypes.map((et: any, idx: number) => {
                const img =
                  et.imageUrl ||
                  et.coverImage ||
                  "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";
                const isFeatured = idx === 0;

                return (
                  <div
                    key={et.id}
                    className={`group flex flex-col justify-between bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 motion-preset-slide-up-sm motion-preset-fade ${
                      isFeatured
                        ? "ring-2 ring-[#7C3AED] shadow-xl shadow-[#7C3AED]/10 border border-purple-200"
                        : "border border-slate-200/80 shadow-xs hover:shadow-xl"
                    }`}
                    style={{ animationDelay: `${idx * 70}ms` }}
                  >
                    <div>
                      <div className="relative w-full h-44 bg-slate-100 overflow-hidden">
                        <Image
                          src={img}
                          alt={et.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 400px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {isFeatured && (
                          <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5B942] text-[#172554] text-[10px] font-extrabold shadow-md">
                            <Crown className="w-3 h-3" />
                            <span>Most Popular</span>
                          </span>
                        )}
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 text-[#172554] text-[10px] font-bold">
                          <Users className="w-3 h-3 text-[#7C3AED]" />
                          <span>
                            {et.minGuests || 20} – {et.maxGuests || 500} Guests
                          </span>
                        </span>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                          {et.name} Package
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                          {et.description || "All-inclusive dynamic celebration planner with verified vendors."}
                        </p>

                        <ul className="mt-5 space-y-2 text-xs text-slate-600">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{et._count?.services || 3}+ Verified Service Categories</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>{et._count?.foods || 3}+ Customizable Catering Dishes</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Instant AI Facial Recognition Photo Share</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                      <Link
                        href={`/dashboard?type=${et.slug}`}
                        className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <span>Customize &amp; Book</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              Cloud storage quotas for photographers and hosts to host high-res event galleries and face scans.
            </p>
          </div>

          {plansLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-slate-200/80 space-y-4 motion-preset-fade motion-loop-pulse"
                >
                  <div className="w-24 h-5 bg-slate-200 rounded animate-pulse" />
                  <div className="w-32 h-8 bg-slate-200 rounded animate-pulse" />
                  <div className="w-full h-24 bg-slate-100 rounded-xl animate-pulse" />
                  <div className="w-full h-10 bg-slate-200 rounded-xl animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
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
                        {Number(sp.price) === 0 ? "Free" : `৳${sp.price}`}
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
                      href={`/dashboard/storage`}
                      className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-[#7C3AED] hover:text-[#7C3AED] text-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5"
                    >
                      <span>Choose Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
