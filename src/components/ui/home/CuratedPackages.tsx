"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Crown, Sparkles, Users } from "lucide-react";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import Container from "@/components/shared/Container";

export default function CuratedPackages() {
  const { data: eventTypesRes, isLoading } = useGetAllEventTypesQuery();
  const eventTypes = eventTypesRes?.data || [];

  return (
    <section className="w-full py-10 lg:py-12 bg-[#FAF8FF] border-y border-purple-100/80">
      <Container className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#7C3AED] text-[11px] font-bold border border-purple-200/80 shadow-2xs mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Dynamic Event Workspaces</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Curated Celebration{" "}
              <span className="text-[#7C3AED]">Packages</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Build your custom wedding, birthday, or corporate event package with transparent BDT pricing and AI photo delivery.
            </p>
          </div>

          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] group self-start sm:self-auto"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
              >
                <div className="w-full h-36 bg-slate-200 animate-pulse" />
                <div className="p-5 space-y-2.5">
                  <div className="w-1/2 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-full h-3 bg-slate-100 rounded animate-pulse" />
                  <div className="w-full h-9 bg-slate-200 rounded-xl animate-pulse mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : eventTypes.length === 0 ? null : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {eventTypes.map((et: any, idx: number) => {
              const img =
                et.imageUrl ||
                et.coverImage ||
                "/images/categories/wedding.jpg";
              const isFeatured = idx === 0;

              return (
                <div
                  key={et.id}
                  className={`group flex flex-col justify-between bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? "ring-2 ring-[#7C3AED] shadow-xl shadow-[#7C3AED]/10 border border-purple-200"
                      : "border border-slate-200/80 shadow-xs hover:shadow-xl"
                  }`}
                >
                  <div>
                    <div className="relative w-full h-36 bg-slate-100 overflow-hidden">
                      <Image
                        src={img}
                        alt={et.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {isFeatured && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F5B942] text-[#172554] text-[10px] font-extrabold shadow-md">
                          <Crown className="w-3 h-3" />
                          <span>Most Popular</span>
                        </span>
                      )}

                      {(et.minGuests || et.maxGuests) && (
                        <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 text-[#172554] text-[10px] font-bold">
                          <Users className="w-3 h-3 text-[#7C3AED]" />
                          <span>
                            {et.minGuests || 20} – {et.maxGuests || 500} Guests
                          </span>
                        </span>
                      )}
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                        {et.name} Package
                      </h3>
                      {et.description && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                          {et.description}
                        </p>
                      )}

                      <ul className="mt-3.5 space-y-1.5 text-xs text-slate-600">
                        {et._count?.services !== undefined && (
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>
                              {et._count.services} Verified Service Categories
                            </span>
                          </li>
                        )}
                        {et._count?.foods !== undefined && (
                          <li className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>
                              {et._count.foods} Customizable Catering Dishes
                            </span>
                          </li>
                        )}
                        <li className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>Instant AI Facial Recognition Photo Share</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-slate-100">
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
      </Container>
    </section>
  );
}
