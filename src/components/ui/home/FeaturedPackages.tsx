"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Users,
  Sparkles,
  UtensilsCrossed,
  Crown,
  Calendar,
  MapPin,
} from "lucide-react";
import { useGetAllEventsQuery } from "@/redux/features/event/eventApi";
import { useGetAllFoodItemsQuery } from "@/redux/features/food/foodApi";
import Container from "@/components/shared/Container";

export default function FeaturedPackages() {
  const { data: eventsRes, isLoading: isEventsLoading } = useGetAllEventsQuery(undefined);
  const { data: foodRes, isLoading: isFoodLoading } = useGetAllFoodItemsQuery();

  const events = eventsRes?.data || [];
  const foodItems = foodRes?.data || [];

  const isLoading = isEventsLoading || isFoodLoading;

  return (
    <section className="w-full py-10 bg-white border-y border-slate-100">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 motion-preset-slide-up-sm motion-preset-fade motion-duration-500">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight">
              Featured Events &amp; Catering
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real showcase celebrations and authentic culinary feasts live on Eventora
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] group"
          >
            <span>Explore All Events</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 4 Cards Bento Grid: 3 Live Event / Package Cards + 1 Delicious Food & Catering Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {isLoading ? (
            /* Advanced Tailwind Motion Skeleton Grid */
            <>
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs motion-preset-fade motion-loop-pulse"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="relative w-full aspect-[16/10] bg-slate-200 animate-pulse" />
                  <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="w-3/4 h-5 rounded-md bg-slate-200 animate-pulse" />
                      <div className="w-1/2 h-3 rounded-md bg-slate-200 animate-pulse" />
                      <div className="pt-2 space-y-2">
                        <div className="w-full h-3 rounded bg-slate-100 animate-pulse" />
                        <div className="w-4/5 h-3 rounded bg-slate-100 animate-pulse" />
                        <div className="w-2/3 h-3 rounded bg-slate-100 animate-pulse" />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="w-20 h-5 rounded-md bg-slate-200 animate-pulse" />
                      <div className="w-24 h-8 rounded-xl bg-slate-200 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
              {/* Food Skeleton */}
              <div className="flex flex-col bg-amber-50/50 rounded-3xl overflow-hidden border border-amber-200/80 p-5 justify-between motion-preset-fade motion-loop-pulse">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="w-24 h-5 rounded-full bg-amber-200/70 animate-pulse" />
                    <div className="w-16 h-5 rounded-full bg-amber-200/70 animate-pulse" />
                  </div>
                  <div className="w-3/4 h-5 rounded-md bg-amber-200/70 animate-pulse" />
                  <div className="w-full h-16 rounded-xl bg-amber-100 animate-pulse" />
                </div>
                <div className="w-full aspect-[16/9] rounded-2xl bg-amber-200/60 animate-pulse mt-4" />
              </div>
            </>
          ) : (
            <>
              {/* Top 3 Live Showcase Events */}
              {events.slice(0, 3).map((event: any, idx: number) => {
                const isPopular = idx === 0;
                const cover = event.coverImage || "/images/categories/wedding.jpg";
                const guestCount = event.guestCount;
                const eventTypeName = event.eventType?.name;
                const dynamicHighlights = [
                  event.venue ? `Venue: ${event.venue}` : null,
                  guestCount ? `Capacity: ${guestCount} Guests` : null,
                  event.eventDate
                    ? `Date: ${new Date(event.eventDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}`
                    : null,
                  event._count?.photos !== undefined
                    ? `${event._count.photos} Gallery Photos`
                    : null,
                ].filter(Boolean) as string[];

                return (
                  <div
                    key={event.id || idx}
                    className={`group flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 motion-preset-slide-up-sm motion-preset-fade ${isPopular
                      ? "ring-2 ring-[#7C3AED] shadow-xl shadow-[#7C3AED]/10 border border-purple-200"
                      : "border border-slate-200/80 shadow-xs hover:shadow-xl"
                      }`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Image & Badges */}
                    <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                      <Image
                        src={cover}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      {isPopular && (
                        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#F5B942] text-[#172554] text-[10px] font-extrabold shadow-md">
                          <Crown className="w-3 h-3" />
                          <span>Showcase Event</span>
                        </div>
                      )}

                      {guestCount ? (
                        <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#172554] text-[10px] font-bold shadow-xs">
                          <Users className="w-3 h-3 text-[#7C3AED]" />
                          <span>{guestCount} Guests</span>
                        </div>
                      ) : null}

                      {event.venue && (
                        <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-medium max-w-[140px] truncate">
                          <MapPin className="w-2.5 h-2.5 text-purple-300 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      )}
                    </div>

                    {/* Package Details & Itemized Checkmarks */}
                    <div className="p-5 flex flex-col justify-between flex-grow">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          {eventTypeName ? (
                            <span className="text-[10px] font-bold tracking-wider uppercase text-[#7C3AED]">
                              {eventTypeName}
                            </span>
                          ) : <span />}
                          {event.status ? (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                              {event.status}
                            </span>
                          ) : null}
                        </div>

                        <h3 className="text-base font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        {event.description ? (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
                            {event.description}
                          </p>
                        ) : null}

                        {/* Dynamic Event Metadata Highlights */}
                        {dynamicHighlights.length > 0 && (
                          <ul className="mt-4 space-y-2 text-xs text-slate-600">
                            {dynamicHighlights.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-2">
                                <span className="w-4 h-4 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                                <span className="leading-snug text-[11px]">{feat}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="block text-[9px] font-bold uppercase text-slate-400">
                            Service Tier
                          </span>
                          <div className="text-sm font-extrabold text-[#172554]">
                            Verified All-in-One
                          </div>
                        </div>
                        <Link
                          href={`/events/${event.id || ""}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-[#7C3AED]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <span>Explore</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 4th Card: Live Delicious Food & Catering from DB */}
              <div className="flex flex-col bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/60 rounded-3xl overflow-hidden border border-amber-200/90 p-5 justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 motion-preset-slide-up-sm motion-preset-fade">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-amber-200 text-amber-800 text-[10px] font-extrabold">
                      <UtensilsCrossed className="w-3 h-3 text-[#D97706]" />
                      <span>Live Food Catalog</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-[#172554] text-[#F5B942] text-[10px] font-extrabold">
                      From ৳40/dish
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-[#172554] tracking-tight">
                    Authentic Royal Catering
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                    Fresh traditional delicacies prepared by certified chefs with high hygiene standards.
                  </p>

                  {/* Real Live Food Items from Database */}
                  <div className="mt-4 space-y-2">
                    {foodItems.slice(0, 3).map((item: any) => {
                      const dishPrice = Number(item.pricePerPerson || 0);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-white/90 border border-amber-200/80 shadow-2xs hover:bg-white transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-bold text-[#172554] truncate max-w-[130px]">
                              {item.name}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-[#7C3AED]">
                            ৳{dishPrice}/person
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Highlight Checkmarks */}
                  <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>100% Halal Certified Meats</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>Customized Wedding Buffets</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3.5">
                  <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md border-2 border-white">
                    <Image
                      src={
                        (foodItems[0]?.images?.[0] || foodItems[0]?.coverImage) ||
                        "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop"
                      }
                      alt="Authentic Bangladeshi Cuisine"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  </div>

                  <Link
                    href="/events"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#172554] hover:bg-[#1E293B] text-white text-xs font-bold shadow-md transition-all hover:scale-[1.01]"
                  >
                    <span>View Full Catering Menu</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
