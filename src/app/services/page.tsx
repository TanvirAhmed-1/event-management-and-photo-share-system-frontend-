"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetAllServicesQuery,
  useGetAllCategoriesQuery,
} from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { Search, Star, ArrowRight, Wrench, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

function ServicesExplorer() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const initialQuery = searchParams.get("q") || "";

  const { data: servicesRes, isLoading } = useGetAllServicesQuery();
  const { data: categoriesRes } = useGetAllCategoriesQuery();

  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const formatPricing = (price: number | string, model: string) => {
    const num = Number(price || 0);
    const formatted = `৳${num.toLocaleString()}`;
    switch (model) {
      case "PER_PERSON":
        return `${formatted}/person`;
      case "PER_HOUR":
        return `${formatted}/hr`;
      case "PER_DAY":
        return `${formatted}/day`;
      default:
        return formatted;
    }
  };

  const filtered = services.filter((s: any) => {
    const catSlug = s.category?.slug || "";
    const matchesCat =
      !selectedCat ||
      selectedCat === "all" ||
      catSlug === selectedCat ||
      s.slug === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      (s.description || "").toLowerCase().includes(q) ||
      (s.category?.name || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC] min-h-[80vh]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eventora Service Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Our Premium Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Top-rated photography, cinema, floral decoration, sound systems, and majestic venues across Bangladesh.
          </p>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="space-y-5">
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services (e.g. Photography, Stage, Venue)..."
              className="pl-10 pr-4 h-10 text-xs rounded-2xl bg-white shadow-xs"
            />
          </div>

          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCat("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                selectedCat === "all"
                  ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              All Services
            </button>
            {categories.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                  selectedCat === cat.slug
                    ? "bg-[#7C3AED] text-white shadow-sm shadow-[#7C3AED]/20"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid with Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div
                key={idx}
                className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-full aspect-[4/3] bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="w-3/4 h-4 rounded bg-slate-200 animate-pulse" />
                  <div className="w-1/2 h-3 rounded bg-slate-100 animate-pulse" />
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                    <div className="w-16 h-4 rounded bg-slate-200 animate-pulse" />
                    <div className="w-16 h-7 rounded-xl bg-slate-200 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-lg mx-auto space-y-3">
            <Wrench className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#172554]">No services match your filter</p>
            <button
              onClick={() => {
                setSelectedCat("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-purple-50 text-[#7C3AED] text-xs font-bold hover:bg-purple-100 transition"
            >
              Show All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((s: any, idx: number) => {
              const img =
                (Array.isArray(s.images) && s.images[0]) ||
                (typeof s.images === "string" ? s.images.split(" ")[0] : null) ||
                s.coverImage ||
                "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop";

              return (
                <div
                  key={s.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 motion-preset-slide-up-sm motion-preset-fade"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                      src={img}
                      alt={s.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/55 backdrop-blur-md text-white text-[10px] font-bold">
                      {s.category?.name || "Curated"}
                    </span>
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-slate-800 shadow-xs">
                      <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                        {s.name}
                      </h3>
                      {s.aiPhotoShareMode === "ADDON" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 mt-1.5 rounded-md bg-purple-50 text-[#7C3AED] text-[10px] font-bold border border-purple-100">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>AI Photo Share Ready</span>
                        </span>
                      )}
                      {s.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">
                          Starting
                        </span>
                        <span className="text-sm font-extrabold text-[#7C3AED]">
                          {formatPricing(s.basePrice, s.pricingModel)}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard?service=${s.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs"
                      >
                        <span>Book</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading services...</div>}>
      <ServicesExplorer />
    </Suspense>
  );
}
