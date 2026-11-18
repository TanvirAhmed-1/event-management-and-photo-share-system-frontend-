"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Star,
  ArrowRight,
  Sparkles,
  ScanFace,
  Zap,
  ShieldCheck,
  Crown,
} from "lucide-react";
import { useGetAllServicesQuery } from "@/redux/features/serviceCatalog/serviceCatalogApi";
import Container from "@/components/shared/Container";

const SERVICE_FALLBACK_IMAGES: Record<string, string> = {
  photography: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
  decoration: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
  catering: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
  videography: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
  sound: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
  venue: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop",
};

export default function PremiumServices() {
  const { data: response, isLoading } = useGetAllServicesQuery();
  const services = (response?.data || []).filter((s: any) => s.isActive !== false);

  const getFallbackImage = (slug: string) => {
    const key = Object.keys(SERVICE_FALLBACK_IMAGES).find((k) => slug?.includes(k));
    return key ? SERVICE_FALLBACK_IMAGES[key] : SERVICE_FALLBACK_IMAGES.photography;
  };

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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Services Cards Grid (8 cols) */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {[1, 2, 3, 4, 5, 6].map((idx) => (
                  <div
                    key={idx}
                    className="h-56 rounded-3xl bg-white border border-slate-200/80 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
                {services.slice(0, 6).map((item: any) => {
                  const imgUrl = item.images?.[0] || getFallbackImage(item.slug);
                  const priceLabel = formatPricing(item.basePrice, item.pricingModel);

                  return (
                    <Link
                      key={item.id}
                      href={`/events/new?service=${item.id}`}
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                        <Image
                          src={imgUrl}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 50vw, 250px"
                        />
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-800 shadow-xs">
                          <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                          <span>4.9</span>
                        </div>
                      </div>

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
                          <p className="text-xs font-extrabold text-[#172554]">{priceLabel}</p>
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

          {/* Right Column: Dark-Violet AI Spotlight Bento Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#172554] via-[#1E1B4B] to-[#4C1D95] text-white relative overflow-hidden shadow-2xl border border-white/10">
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

            <div className="relative z-10 mt-8 pt-5 border-t border-white/15 flex flex-col gap-4">
              <Link
                href="/guest"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-lg shadow-[#7C3AED]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Explore AI Photo Share</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="text-center text-[11px] text-purple-200">
                Over 120,000+ guest photos matched
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
