"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ScanFace } from "lucide-react";
import Container from "@/components/shared/Container";

export default function BottomCtaBanner() {
  return (
    <section className="relative w-full py-4 bg-gradient-to-r from-[#1B1145] via-[#431C8D] to-[#7C3AED] text-white overflow-hidden">
      {/* Ambient Mesh Glows & Subtle Dot Grid */}
      <div className="absolute -top-20 right-1/4 w-80 h-80 bg-fuchsia-500/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-[#F5B942]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Eyebrow + Copy */}
          <div className="text-center lg:text-left space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/12 border border-white/20 text-[10px] font-extrabold uppercase tracking-wider text-purple-100 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#F5B942]" />
              <span>Start in Under 2 Minutes</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              Ready to Plan Your{" "}
              <span className="bg-gradient-to-r from-[#FDE68A] via-[#F5B942] to-[#F472B6] bg-clip-text text-transparent">
                Next Event?
              </span>
            </h3>

            <p className="text-xs sm:text-sm text-purple-100/85 leading-relaxed">
              Join thousands of happy hosts across Bangladesh and delight every guest with instant AI selfie photo delivery.
            </p>
          </div>

          {/* Right: Sleek Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-purple-50 text-[#1B1145] text-xs sm:text-sm font-extrabold shadow-xl shadow-black/20 transition-all hover:scale-[1.03] active:scale-95 whitespace-nowrap"
            >
              <span>Start Planning Free</span>
              <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
            </Link>
            <Link
              href="/guest"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/12 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all whitespace-nowrap"
            >
              <ScanFace className="w-4 h-4 text-[#F5B942]" />
              <span>Find Event Photos</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
