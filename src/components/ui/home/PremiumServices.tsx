"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function PremiumServices() {
  const services = [
    {
      id: "photography",
      title: "Photography",
      rating: "4.9",
      price: "From ৳5,000",
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "decoration",
      title: "Decoration",
      rating: "4.8",
      price: "From ৳8,000",
      image: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "catering",
      title: "Catering",
      rating: "4.9",
      price: "From ৳100/person",
      image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "videography",
      title: "Videography",
      rating: "4.7",
      price: "From ৳7,000",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "sound-system",
      title: "Sound System",
      rating: "4.8",
      price: "From ৳3,000",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "venue-booking",
      title: "Venue Booking",
      rating: "4.9",
      price: "From ৳15,000",
      image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Our Premium Services
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="text-[#7C3AED] font-bold">—</span> Everything you need for a memorable event
          </p>
        </div>

        {/* Services Layout (Services Grid on left + Smart Event Planning AI on right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Services Cards Grid (8 cols) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {services.map((item) => (
              <Link
                key={item.id}
                href={`/services?cat=${item.id}`}
                className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 250px"
                  />
                  {/* Rating Tag */}
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-700 shadow-xs">
                    <Star className="w-3 h-3 text-[#F5B942] fill-[#F5B942]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex flex-col justify-between flex-grow">
                  <h3 className="text-xs sm:text-sm font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* AI Banner Card (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#FAF5FF] border border-[#DDD6FE] relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-purple-200 text-[#7C3AED] text-[11px] font-bold shadow-xs mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Face Matching</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight leading-snug">
                Smart Event Planning with AI
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Find, match and share photos using cutting-edge facial recognition technology.
              </p>

              <div className="mt-6">
                <Link
                  href="/guest"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-[#7C3AED]/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Explore AI Photo Share</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Floating Avatars Preview */}
            <div className="relative mt-8 pt-4 flex items-center justify-end gap-2">
              <div className="w-12 h-12 rounded-full ring-2 ring-[#7C3AED] ring-offset-2 overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                  alt="Guest"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full ring-2 ring-[#F5B942] ring-offset-2 overflow-hidden shadow-md -ml-3">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                  alt="Guest"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div className="w-12 h-12 rounded-full ring-2 ring-[#7C3AED] ring-offset-2 overflow-hidden shadow-md -ml-3">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                  alt="Guest"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

