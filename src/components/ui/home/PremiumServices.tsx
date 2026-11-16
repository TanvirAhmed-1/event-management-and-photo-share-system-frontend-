"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ScanFace,
  Zap,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import Container from "@/components/shared/Container";

export default function PremiumServices() {
  const { data: response, isLoading } = useGetAllServicesQuery();
  const services = response?.data || [];

  // Helper to format pricing model label
  const formatPricing = (price: number | string, model: string) => {
    const num = Number(price || 0);
    const formatted = `৳${num.toLocaleString()}`;
    switch (model) {
      case "PER_PERSON":
        return `From ${formatted}/person`;
      case "PER_HOUR":
        return `From ${formatted}/hr`;
      case "PER_DAY":
        return `From ${formatted}/day`;
      default:
        return `From ${formatted}`;
    }
  };

  return (
    <section className="w-full py-10 bg-[#F8FAFC]">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight">
              Our Premium Services
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Everything you need for an extraordinary, stress-free celebration
            </p>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] group"
          >
            <span>Browse All Services</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Bento Layout: Services Grid (8 cols) + Dark-Violet AI Spotlight Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Services Cards Grid (8 cols) */}
          <div className="lg:col-span-8">
            {isLoading ? (
              /* Loading State: Advanced Tailwind Motion Skeleton Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
                    style={{ animationDelay: `${idx * 120}ms` }}
                  >
                    <div className="relative w-full aspect-[4/3] bg-slate-200 animate-pulse" />
                    <div className="p-4 space-y-3 flex-grow flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="w-3/4 h-4 rounded-md bg-slate-200 animate-pulse" />
                        <div className="w-1/2 h-3 rounded-md bg-slate-200/70 animate-pulse" />
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="w-20 h-4 rounded-md bg-slate-200 animate-pulse" />
                        <div className="w-12 h-3 rounded-md bg-slate-200 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 rounded-3xl bg-white border border-dashed border-slate-200 p-8 h-full flex flex-col items-center justify-center">
                <Sparkles className="w-10 h-10 text-slate-300 mb-2" />
                <p className="text-sm font-bold text-slate-600">No services cataloged yet</p>
                <p className="text-xs text-slate-400 mt-1">Services added by admin will appear here live.</p>
              </div>
            ) : (
              /* Live Services Grid from Backend */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {services.slice(0, 6).map((item: any, idx: number) => {
                  const imageSrc =
                    (Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : typeof item.images === "string"
                        ? item.images.split(" ")[0]
                        : item.coverImage) ||
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop";

                  const categoryName = item.category?.name || "Curated Service";
                  const priceLabel = formatPricing(item.basePrice, item.pricingModel);

                  return (
                    <Link
                      key={item.id}
                      href={`/services?id=${item.id}`}
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1 motion-preset-slide-up-sm motion-preset-fade"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      {/* Image & Floating Badges */}
                      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 260px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold max-w-[130px] truncate">
                          {categoryName}
                        </span>

                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-extrabold text-[#172554] shadow-xs">
                          <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                          <span>4.9</span>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 flex flex-col justify-between flex-grow">
                        <div>
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="text-sm font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                              {item.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 font-medium shrink-0">
                              Active
                            </span>
                          </div>

                          {/* Key Deliverable / Description */}
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {item.description || "Premium professional service with on-time delivery guarantee."}
                          </p>

                          {item.aiPhotoShareMode === "ADDON" && (
                            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-purple-50 text-[#7C3AED] text-[10px] font-bold border border-purple-100">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>AI Photo Share Ready</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <p className="text-xs font-extrabold text-[#172554]">
                            {priceLabel}
                          </p>
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] group-hover:translate-x-1 transition-transform">
                            <span>Book</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Dark-Violet Luxury AI Spotlight Bento Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#172554] via-[#1E1B4B] to-[#4C1D95] text-white relative overflow-hidden shadow-2xl border border-white/10 motion-preset-slide-up-sm motion-preset-fade">
            {/* Ambient Glow */}
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#7C3AED]/40 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#F5B942] text-[11px] font-bold border border-white/15 mb-4">
                <Crown className="w-3.5 h-3.5" />
                <span>AI Powered Platform</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                Smart Event Planning with AI Face Search
              </h3>

              <p className="text-xs text-purple-200/90 mt-2.5 leading-relaxed">
                Connect your wedding photographers to Eventora. Guests scan a selfie and receive their customized private album in under 2 seconds.
              </p>

              {/* Feature Bullets */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]/50 flex items-center justify-center shrink-0">
                    <ScanFace className="w-3.5 h-3.5 text-[#F5B942]" />
                  </div>
                  <span>Instant guest face identification</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]/50 flex items-center justify-center shrink-0">
                    <Zap className="w-3.5 h-3.5 text-[#F5B942]" />
                  </div>
                  <span>Streaming high-speed ZIP downloads</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/90">
                  <div className="w-6 h-6 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]/50 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F5B942]" />
                  </div>
                  <span>End-to-end encrypted guest privacy</span>
                </div>
              </div>
            </div>

            {/* Bottom Action & Social Proof */}
            <div className="relative z-10 mt-8 pt-5 border-t border-white/15 flex flex-col gap-4">
              <Link
                href="/events"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-lg shadow-[#7C3AED]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Upload Event Photos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-between text-[11px] text-purple-200">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full border border-white/40 bg-purple-400 text-[10px] font-bold flex items-center justify-center text-white">T</div>
                  <div className="w-6 h-6 rounded-full border border-white/40 bg-amber-400 text-[10px] font-bold flex items-center justify-center text-white">S</div>
                  <div className="w-6 h-6 rounded-full border border-white/40 bg-pink-400 text-[10px] font-bold flex items-center justify-center text-white">R</div>
                </div>
                <span>Over 120,000+ guest photos matched</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
