"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Cake, Users, Briefcase, Gem, Star } from "lucide-react";

export default function BrowseCategories() {
  const categories = [
    {
      id: "wedding",
      title: "Wedding",
      subtitle: "Make your big day special",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      icon: Heart,
      badgeColor: "bg-purple-100 text-[#7C3AED]",
    },
    {
      id: "birthday",
      title: "Birthday",
      subtitle: "Celebrate with joy",
      image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
      icon: Cake,
      badgeColor: "bg-pink-100 text-pink-600",
    },
    {
      id: "get-together",
      title: "Get Together",
      subtitle: "Connect with loved ones",
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop",
      icon: Users,
      badgeColor: "bg-blue-100 text-blue-600",
    },
    {
      id: "corporate-event",
      title: "Corporate Event",
      subtitle: "Professional & Perfect",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
      icon: Briefcase,
      badgeColor: "bg-indigo-100 text-indigo-600",
    },
    {
      id: "engagement",
      title: "Engagement",
      subtitle: "Start a new journey",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop",
      icon: Gem,
      badgeColor: "bg-amber-100 text-amber-600",
    },
    {
      id: "anniversary",
      title: "Anniversary",
      subtitle: "Cherish together",
      image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
      icon: Star,
      badgeColor: "bg-rose-100 text-rose-600",
    },
  ];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Browse Event Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Find the perfect category for your celebration
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7C3AED] hover:text-[#6D28D9] group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid (6 Cards) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/events?type=${cat.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image & Floating Circular Badge */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

                  {/* Icon badge */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#7C3AED]" />
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="p-3 text-center flex flex-col items-center">
                  <h3 className="text-sm font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                    {cat.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

