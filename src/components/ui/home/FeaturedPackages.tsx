"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export default function FeaturedPackages() {
  const packages = [
    {
      id: "wedding",
      title: "Elegant Wedding",
      isPopular: true,
      guests: "Up to 100 guests",
      features: "Decoration • Photography • Food",
      price: "৳45,000",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "birthday",
      title: "Birthday Celebration",
      isPopular: false,
      guests: "Up to 50 guests",
      features: "Decoration • Cake • Photography",
      price: "৳18,000",
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "corporate",
      title: "Corporate Meetup",
      isPopular: false,
      guests: "Up to 100 guests",
      features: "Venue • Food • Management",
      price: "৳32,000",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <section className="w-full py-12 lg:py-16">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
            Featured Event Packages
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Curated packages for every occasion
          </p>
        </div>

        {/* 4 Cards Grid: 3 Packages + 1 Food & Catering Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {/* 3 Package Cards */}
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image & Badge */}
              <div className="relative w-full aspect-[16/10] bg-slate-100 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 300px"
                />

                {pkg.isPopular && (
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-[#F5B942] text-[#172554] text-[10px] font-extrabold shadow-sm">
                    Popular
                  </div>
                )}
              </div>

              {/* Package Details */}
              <div className="p-4 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-base font-bold text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">{pkg.guests}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{pkg.features}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-extrabold text-[#172554]">{pkg.price}</div>
                  <Link
                    href={`/events/new?package=${pkg.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* 4th Card: Delicious Food & Catering */}
          <div className="flex flex-col bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-2xl overflow-hidden border border-amber-200/70 p-5 justify-between shadow-xs hover:shadow-xl transition-all duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#172554] tracking-tight">
                Delicious Food & Catering
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                A wide variety of tasty options for your special event.
              </p>

              {/* Checkmarks */}
              <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Traditional & Modern Menu</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Per Person Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>Custom Menu Available</span>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <Link
                href="/food"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#172554] hover:bg-[#1e3a8a] text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Explore Food Menu</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Savory Biryani Image */}
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop"
                  alt="Delicious Traditional Kacchi Biryani"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

