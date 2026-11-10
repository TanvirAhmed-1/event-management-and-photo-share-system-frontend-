"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetAllServicesQuery,
  useGetAllCategoriesQuery,
} from "@/redux/features/serviceCatalog/serviceCatalogApi";
import { Search, Star, ArrowRight, Wrench, Sparkles, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function ServicesExplorer() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const { data: servicesRes, isLoading } = useGetAllServicesQuery();
  const { data: categoriesRes } = useGetAllCategoriesQuery();

  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");

  const services = servicesRes?.data || [];
  const categories = categoriesRes?.data || [];

  const serviceImages: Record<string, string> = {
    photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    videography: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
    decoration: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
    catering: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
    sound: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    venue: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop",
  };

  const filtered = services.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eventora Service Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Our Premium Services
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Top-rated photography, cinema, floral decoration, sound systems, and majestic venues across Bangladesh.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search services (e.g. Photography, Stage, Venue)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading verified services...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No services match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((s, idx) => {
              const imgKey = Object.keys(serviceImages).find((k) => s.slug.includes(k)) || "photography";
              const img = serviceImages[imgKey];
              return (
                <div
                  key={s.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                      src={img}
                      alt={s.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-slate-800 shadow-xs">
                      <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                      <span>4.9</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                        {s.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">{s.pricingModel}</p>
                      {s.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {s.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Starting</span>
                        <span className="text-sm font-extrabold text-[#7C3AED]">৳{s.basePrice?.toLocaleString()}</span>
                      </div>

                      <Link
                        href={`/dashboard?service=${s.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-xs"
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

