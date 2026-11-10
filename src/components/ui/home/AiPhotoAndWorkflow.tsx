"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  UtensilsCrossed,
  ShieldCheck,
  PartyPopper,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AiPhotoAndWorkflow() {
  const steps = [
    {
      id: 1,
      title: "Choose Event & Services",
      icon: CalendarDays,
      bg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    },
    {
      id: 2,
      title: "Select Food & Confirm",
      icon: UtensilsCrossed,
      bg: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    },
    {
      id: 3,
      title: "Make Payment Securely",
      icon: ShieldCheck,
      bg: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
    },
    {
      id: 4,
      title: "Enjoy Your Event",
      icon: PartyPopper,
      bg: "bg-yellow-500/20 text-yellow-300 border-yellow-400/30",
    },
  ];

  return (
    <section className="w-full py-10 lg:py-14">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#172554] via-[#1e1b4b] to-[#4c1d95] text-white p-8 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-white/10">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Left Column: Find Your Photos with AI (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-start">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-amber-300 text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Facial Recognition Magic</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                Find Your Photos with AI
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-md leading-relaxed">
                Upload a selfie and discover all the photos from your event, instantly!
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Link
                  href="/guest"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Try Photo Search</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Mockup Preview of Smartphone with Matched Faces */}
              <div className="mt-8 flex items-center gap-3">
                <div className="relative w-16 h-20 rounded-xl overflow-hidden border-2 border-amber-400 shadow-md">
                  <Image
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                    alt="Selfie"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-[8px] font-bold text-black text-center py-0.5">
                    Selfie
                  </div>
                </div>

                <div className="text-slate-400 font-bold text-sm">➔</div>

                <div className="flex items-center gap-2">
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=200&auto=format&fit=crop"
                      alt="Match 1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=200&auto=format&fit=crop"
                      alt="Match 2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative w-14 h-16 rounded-lg overflow-hidden border border-white/20 shadow-sm">
                    <Image
                      src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=200&auto=format&fit=crop"
                      alt="Match 3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: How It Works? 4 Simple Steps (6 cols) */}
            <div className="lg:col-span-6 lg:border-l lg:border-white/10 lg:pl-10">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">How It Works?</h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Get started in just 4 simple steps</p>

              {/* 4 Steps Row / Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  return (
                    <div key={st.id} className="flex flex-col items-center text-center group">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${st.bg} mb-3 shadow-md group-hover:scale-110 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-200 leading-tight">
                        {st.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

