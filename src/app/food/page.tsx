"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  useGetAllFoodItemsQuery,
  useGetAllFoodCategoriesQuery,
} from "@/redux/features/food/foodApi";
import { Search, Utensils, Sparkles, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function FoodExplorer() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";

  const { data: foodRes, isLoading } = useGetAllFoodItemsQuery();
  const { data: categoriesRes } = useGetAllFoodCategoriesQuery();

  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState("");

  const items = foodRes?.data || [];
  const categories = categoriesRes?.data || [];

  const foodImages: Record<string, string> = {
    biryani: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop",
    meat: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop",
    desserts: "https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop",
    beverages: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=600&auto=format&fit=crop",
  };

  const filtered = items.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="w-full py-10 lg:py-16 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 mb-3">
            <Utensils className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>Delicious Food & Catering Menu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#172554] tracking-tight">
            Gourmet Catering & Dining
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Authentic Bangladeshi Kacchi Biryani, tender meats, fragrant polao, desserts, and refreshing drinks.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food & dishes (e.g. Kacchi, Roast, Borhani)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl border border-slate-200 bg-white shadow-xs focus:outline-none focus:border-[#7C3AED]"
          />
        </div>

        {/* Food Items Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-slate-400">Loading catering dishes...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">No catering dishes match your search.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((f, i) => {
              const imgKey = Object.keys(foodImages)[i % 4];
              const img = foodImages[imgKey];
              return (
                <div
                  key={f.id}
                  className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                    <Image
                      src={img}
                      alt={f.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-slate-800 shadow-xs">
                      {f.isVegetarian ? "🌿 Veg" : "🍗 Non-Veg"}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-sm font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                        {f.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">{f.category?.name || "Catering Specialty"}</p>
                      {f.description && (
                        <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                          {f.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Rate</span>
                        <span className="text-sm font-extrabold text-[#7C3AED]">
                          ৳{f.pricePerPerson?.toLocaleString()}{" "}
                          <span className="text-[10px] text-slate-400 font-normal">/ person</span>
                        </span>
                      </div>

                      <Link
                        href={`/dashboard?food=${f.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition shadow-xs"
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

