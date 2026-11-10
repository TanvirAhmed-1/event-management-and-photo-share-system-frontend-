"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export default function BottomCtaBanner() {
  return (
    <section className="w-full py-10 lg:py-14">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] text-white p-7 sm:p-9 lg:p-10 overflow-hidden shadow-2xl border border-purple-400/20">
          {/* Subtle decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            {/* Left & Middle: Gift Icon + Copy */}
            <div className="flex items-center gap-5 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#F5B942]/20 border border-[#F5B942]/40 flex items-center justify-center shrink-0 shadow-md">
                <Gift className="w-7 h-7 text-[#F5B942]" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
                  Ready to Plan Your Next Event?
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 mt-1">
                  Join thousands of happy customers and make your event unforgettable.
                </p>
              </div>
            </div>

            {/* Right: Gold Action Button */}
            <div className="shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

