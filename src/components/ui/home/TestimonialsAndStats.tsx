"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  Quote,
  BadgeCheck,
  Users,
  CalendarCheck,
  ScanFace,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";

export default function TestimonialsAndStats() {
  const { data: reviewsRes, isLoading } = useGetAllReviewsQuery();
  const reviews = reviewsRes?.data || [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 768) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visibleCount);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || reviews.length <= 1) return;
    const timer = setInterval(() => {
      handleNext();
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, reviews.length, handleNext]);

  useEffect(() => {
    if (activeIndex > maxIndex) {
      setActiveIndex(0);
    }
  }, [activeIndex, maxIndex]);

  const metrics = [
    {
      value: "50,000+",
      label: "Happy Guests",
      icon: Users,
      accent: "text-[#F5B942]",
    },
    {
      value: "1,200+",
      label: "Events Completed",
      icon: CalendarCheck,
      accent: "text-purple-200",
    },
    {
      value: "99.4%",
      label: "AI Match Accuracy",
      icon: ScanFace,
      accent: "text-emerald-300",
    },
    {
      value: "250+",
      label: "Verified Vendors",
      icon: Award,
      accent: "text-[#F5B942]",
    },
  ];

  return (
    <section className="w-full py-14 lg:py-20 bg-white border-t border-slate-100">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-12">
        {/* 4-Metric Platform Impact Bar */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#172554] via-[#1E1B4B] to-[#4C1D95] text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-white/10 motion-preset-slide-up-sm motion-preset-fade motion-duration-600">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <Image
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000&auto=format&fit=crop"
              alt="Event Celebration Backdrop"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className="flex items-center gap-4 lg:justify-center"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 backdrop-blur-md">
                    <Icon className={`w-6 h-6 ${m.accent}`} />
                  </div>
                  <div>
                    <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${m.accent}`}>
                      {m.value}
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      {m.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#7C3AED]">
              Customer Stories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight mt-1">
              What Our Customers Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real celebrations, real memories, and verified organizers across Bangladesh
            </p>
          </div>

          {!isLoading && reviews.length > visibleCount && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-purple-50 hover:border-[#7C3AED]/40 text-[#172554] hover:text-[#7C3AED] flex items-center justify-center transition shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-purple-50 hover:border-[#7C3AED]/40 text-[#172554] hover:text-[#7C3AED] flex items-center justify-center transition shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Autoplay Customer Review Slider (Live from Backend API) */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5 motion-preset-fade motion-loop-pulse"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="w-24 h-5 rounded-full bg-slate-200 animate-pulse" />
                    <div className="w-6 h-6 rounded bg-slate-200 animate-pulse" />
                  </div>
                  <div className="w-full h-3 rounded bg-slate-200 animate-pulse" />
                  <div className="w-5/6 h-3 rounded bg-slate-200 animate-pulse" />
                  <div className="w-2/3 h-3 rounded bg-slate-200 animate-pulse" />
                </div>
                <div className="pt-4 border-t border-slate-200/70 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-28 h-4 rounded bg-slate-200 animate-pulse" />
                    <div className="w-20 h-3 rounded bg-slate-100 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="space-y-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="overflow-hidden -mx-3 px-3 py-2">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${(activeIndex * 100) / visibleCount}%)`,
                }}
              >
                {reviews.map((rev) => {
                  const avatar =
                    rev.imageUrl ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                  return (
                    <div
                      key={rev.id}
                      className="shrink-0 px-3"
                      style={{ width: `${100 / visibleCount}%` }}
                    >
                      <div className="h-full flex flex-col justify-between bg-[#F8FAFC] hover:bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] border border-purple-200/80 text-[10px] font-bold">
                              Verified Client
                            </span>
                            <Quote className="w-6 h-6 text-[#7C3AED]/20 fill-[#7C3AED]/10" />
                          </div>

                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            &ldquo;{rev.comment}&rdquo;
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                              <Image
                                src={avatar}
                                alt={rev.name}
                                fill
                                className="object-cover"
                                sizes="44px"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1">
                                <h4 className="text-sm font-extrabold text-[#172554] truncate">
                                  {rev.name}
                                </h4>
                                <BadgeCheck className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium truncate">
                                Eventora Member
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            {[...Array(Math.min(5, Math.max(1, rev.rating || 5)))].map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {maxIndex > 0 && (
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    aria-label={`Go to slide ${idx + 1}`}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeIndex === idx
                        ? "w-7 bg-[#7C3AED]"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
