"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Gift, ScanFace } from "lucide-react";

export default function BottomCtaBanner() {
  return (
    <section className="w-full py-12 lg:py-16 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] text-white p-8 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-purple-400/25 motion-preset-slide-up-md motion-preset-fade motion-duration-700">
          {/* Subtle decorative glows */}
          <div className="absolute -top-12 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-72 h-72 bg-[#F5B942]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left: Gift Icon + Copy */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#F5B942]/20 border border-[#F5B942]/40 flex items-center justify-center shrink-0 shadow-lg backdrop-blur-md">
                <Gift className="w-8 h-8 text-[#F5B942]" />
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Ready to Plan Your Next Event?
                </h3>
                <p className="text-xs sm:text-sm text-purple-100 mt-1.5 max-w-xl leading-relaxed">
                  Join thousands of happy hosts across Bangladesh and delight every guest with AI-powered photo delivery.
                </p>
              </div>
            </div>

            {/* Right: Dual CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3.5 rounded-full bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                <span>Start Planning Free</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/guest"
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all whitespace-nowrap"
              >
                <ScanFace className="w-4 h-4 text-[#F5B942]" />
                <span>Find Event Photos</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
