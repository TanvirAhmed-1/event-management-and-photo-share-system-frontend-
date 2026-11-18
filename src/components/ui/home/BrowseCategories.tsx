"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Cake,
  Users,
  Briefcase,
  Gem,
  Star,
  Sparkles,
} from "lucide-react";
import { useGetAllEventTypesQuery } from "@/redux/features/eventType/eventTypeApi";
import Container from "@/components/shared/Container";

const FALLBACK_IMAGES: Record<string, string> = {
  wedding: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
  birthday: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
  "get-together": "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
  "corporate-event": "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
  engagement: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
  anniversary: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
};

export default function BrowseCategories() {
  const { data: response, isLoading } = useGetAllEventTypesQuery();
  const eventTypes = (response?.data || []).filter((et: any) => et.isActive !== false);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "wedding":
        return Heart;
      case "birthday":
        return Cake;
      case "get-together":
        return Users;
      case "corporate-event":
        return Briefcase;
      case "engagement":
        return Gem;
      case "anniversary":
        return Star;
      default:
        return Sparkles;
    }
  };

  return (
    <section className="w-full py-10 bg-white border-y border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight">
              Browse Event Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Discover curated experiences crafted for every celebration across Bangladesh
            </p>
          </div>

          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 hover:bg-[#7C3AED] text-[#7C3AED] hover:text-white text-xs sm:text-sm font-bold transition-all group self-start sm:self-auto"
          >
            <span>Build Custom Event</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
            {eventTypes.slice(0, 6).map((cat: any) => {
              const Icon = getCategoryIcon(cat.slug);
              const imgUrl = cat.imageUrl || FALLBACK_IMAGES[cat.slug] || FALLBACK_IMAGES.wedding;
              const serviceCount = cat._count?.services ?? 0;
              const countText = serviceCount > 0 ? `${serviceCount} Services` : "Curated";

              return (
                <Link
                  key={cat.id}
                  href={`/events/new?type=${cat.id}`}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-slate-900"
                >
                  <Image
                    src={imgUrl}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/35 to-black/10 group-hover:from-[#172554]/95 transition-colors duration-300" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-1.5 z-10">
                    <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-sm group-hover:rotate-6 transition-transform">
                      <Icon className="w-4 h-4 text-[#F5B942]" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-[9px] font-bold text-white/95 truncate">
                      {countText}
                    </span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-4 flex flex-col justify-end text-left z-10">
                    <h3 className="text-base font-extrabold text-white group-hover:text-[#F5B942] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-200/90 mt-1 line-clamp-2 leading-snug">
                      {cat.description || "Curated services and packages for your celebration."}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-purple-200 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <span>Plan Now</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
