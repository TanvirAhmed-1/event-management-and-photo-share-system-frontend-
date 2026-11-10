"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

export default function TestimonialsAndStats() {
  const reviews = [
    {
      id: 1,
      name: "Nusrat Jahan",
      role: "Wedding Customer",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
      comment: "Eventora made our wedding planning so easy. Everything was perfect!",
      rating: 5,
    },
    {
      id: 2,
      name: "Sakib Ahmed",
      role: "Birthday Customer",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop",
      comment: "Amazing platform with great service and transparent pricing.",
      rating: 5,
    },
    {
      id: 3,
      name: "Farhan Rahman",
      role: "Corporate Customer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      comment: "A professional and reliable service. Highly recommended!",
      rating: 5,
    },
  ];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-[#7C3AED] font-bold">—</span> Real stories. Real happiness.
          </p>
        </div>

        {/* 4 Items Grid: 3 Reviews + 1 Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* 3 Review Cards */}
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="flex flex-col bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 justify-between"
            >
              <div>
                {/* User info */}
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#172554]">{rev.name}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{rev.role}</p>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-slate-600 mt-4 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Star Rating */}
              <div className="flex items-center gap-1 mt-5 pt-3 border-t border-slate-100">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-[#F5B942] fill-[#F5B942]" />
                ))}
              </div>
            </div>
          ))}

          {/* 4th Card: Statistics Showcase */}
          <div className="relative flex flex-col justify-between p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-[#172554] via-[#1e1b4b] to-[#7C3AED] text-white shadow-xl">
            {/* Background event illumination image */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <Image
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop"
                alt="Event Celebration"
                fill
                className="object-cover"
              />
            </div>

            <div className="relative z-10 grid grid-cols-2 gap-4 my-auto">
              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-[#F5B942]">50K+</div>
                <div className="text-[11px] text-slate-200 font-medium">Happy Customers</div>
              </div>

              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white">1K+</div>
                <div className="text-[11px] text-slate-200 font-medium">Events Completed</div>
              </div>

              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-white">99%</div>
                <div className="text-[11px] text-slate-200 font-medium">Satisfaction</div>
              </div>

              <div>
                <div className="text-2xl lg:text-3xl font-extrabold text-[#F5B942]">200+</div>
                <div className="text-[11px] text-slate-200 font-medium">Trusted Vendors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

