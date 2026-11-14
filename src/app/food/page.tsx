"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetAllFoodItemsQuery,
  useGetAllFoodCategoriesQuery,
} from "@/redux/features/food/foodApi";
import { Search, Utensils, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";

function FoodExplorer() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const { data: foodRes, isLoading } = useGetAllFoodItemsQuery();
  const { data: categoriesRes } = useGetAllFoodCategoriesQuery();

  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");

  const items = foodRes?.data || [];
  const categories = categoriesRes?.data || [];

  const filtered = items.filter((f: any) => {
    const catSlug = f.category?.slug || "";
    const matchesCat =
      !selectedCat || selectedCat === "all" || catSlug === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.description || "").toLowerCase().includes(q) ||
      (f.category?.name || "").toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC] min-h-[80vh]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Delicious Food &amp; Catering Menu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Gourmet Catering &amp; Dining
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            Authentic Bangladeshi Shahi Polao, Chicken Roast, Beef Rezala, Firni desserts, and refreshing Borhani.
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
              placeholder="Search food & dishes (e.g. Polao, Roast, Borhani)..."
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
              All Dishes
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

        {/* Food Items Grid with Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5].map((idx) => (
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
            <Utensils className="w-9 h-9 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-[#172554]">No catering dishes match your filter</p>
            <button
              onClick={() => {
                setSelectedCat("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-amber-50 text-amber-800 text-xs font-bold hover:bg-amber-100 transition"
            >
              Show All Dishes
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((f: any, idx: number) => {
              const img =
                (Array.isArray(f.images) && f.images[0]) ||
                (typeof f.images === "string" ? f.images.split(" ")[0] : null) ||
                f.coverImage ||
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop";
              const isVeg =
                f.isVegetarian ||
                (Array.isArray(f.dietaryLabels) && f.dietaryLabels.includes("VEGETARIAN"));

              return (
                <div
                  key={f.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 motion-preset-slide-up-sm motion-preset-fade"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                      src={img}
                      alt={f.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-white/95 text-[10px] font-bold text-slate-800 shadow-xs">
                      {isVeg ? "🌿 Vegetarian" : "🍗 Halal Special"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                        {f.name}
                      </h3>
                      <p className="text-[11px] text-[#7C3AED] font-semibold mt-0.5">
                        {f.category?.name || "Catering Specialty"}
                      </p>
                      {f.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {f.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">
                          Per Plate
                        </span>
                        <span className="text-sm font-extrabold text-[#7C3AED]">
                          ৳{Number(f.pricePerPerson || 0).toLocaleString()}{" "}
                          <span className="text-[10px] text-slate-400 font-normal">/ person</span>
                        </span>
                      </div>

                      <Link
                        href={`/dashboard?food=${f.id}`}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs"
                      >
                        <span>Select</span>
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

export default function FoodPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-slate-400">Loading catering dishes...</div>}>
      <FoodExplorer />
    </Suspense>
  );
}
