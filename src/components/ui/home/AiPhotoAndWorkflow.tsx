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
  ScanFace,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function AiPhotoAndWorkflow() {
  const steps = [
    {
      num: "01",
      title: "Choose Event & Services",
      desc: "Pick your wedding, birthday, or corporate date, venue, and verified vendors.",
      icon: CalendarDays,
      accent: "text-purple-300 bg-purple-500/20 border-purple-400/30",
    },
    {
      num: "02",
      title: "Select Food & Confirm",
      desc: "Customize traditional Kacchi menus, live counters, and event packages.",
      icon: UtensilsCrossed,
      accent: "text-amber-300 bg-amber-500/20 border-amber-400/30",
    },
    {
      num: "03",
      title: "Make Payment Securely",
      desc: "Lock in your vendors and cloud AI photo storage with protected checkout.",
      icon: ShieldCheck,
      accent: "text-emerald-300 bg-emerald-500/20 border-emerald-400/30",
    },
    {
      num: "04",
      title: "Enjoy & Share AI Photos",
      desc: "Guests scan a selfie via QR code and download every photo they appear in.",
      icon: PartyPopper,
      accent: "text-yellow-300 bg-yellow-500/20 border-yellow-400/30",
    },
  ];

  const matchedPhotos = [
    {
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=240&auto=format&fit=crop",
      score: "99.8% Match",
    },
    {
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=240&auto=format&fit=crop",
      score: "99.4% Match",
    },
    {
      src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=240&auto=format&fit=crop",
      score: "98.9% Match",
    },
  ];

  return (
    <section className="w-full py-12 lg:py-18 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[2rem] bg-gradient-to-br from-[#0F172A] via-[#172554] to-[#4C1D95] text-white p-7 sm:p-10 lg:p-12 overflow-hidden shadow-2xl border border-white/10 motion-preset-fade motion-duration-700">
          {/* Ambient Glows & Tech Grid */}
          <div className="absolute -top-24 right-1/4 w-96 h-96 bg-[#7C3AED]/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 left-10 w-80 h-80 bg-[#F5B942]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Column: Interactive AI Face Recognition Showcase (6 cols) */}
            <div className="lg:col-span-6 flex flex-col items-start space-y-6 motion-preset-slide-right-sm motion-preset-fade motion-duration-700">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F5B942] text-xs font-bold backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Neural Facial Recognition Magic</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                  Find Your Event Photos{" "}
                  <span className="text-[#F5B942]">Instantly with AI</span>
                </h2>
                <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-lg leading-relaxed">
                  No more scrolling through 5,000 wedding pictures. Upload a quick selfie and let our AI match every moment you appear in within 0.2 seconds.
                </p>
              </div>

              {/* Interactive Biometric Scan -> Neural Matching -> 3 Matched Photos Card */}
              <div className="w-full p-4 sm:p-5 rounded-3xl bg-white/8 backdrop-blur-xl border border-white/15 shadow-xl space-y-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 border-b border-white/10 pb-2.5">
                  <span className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Biometric Vector Pipeline Active
                  </span>
                  <span className="flex items-center gap-1 text-[#F5B942]">
                    <Cpu className="w-3.5 h-3.5" /> 512-D Face Embeddings
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Guest Selfie Frame with Biometric Scan-Line */}
                  <div className="relative w-24 h-28 rounded-2xl overflow-hidden border-2 border-[#F5B942] shadow-lg shrink-0">
                    <Image
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=240&auto=format&fit=crop"
                      alt="Guest Selfie Scan"
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                    {/* Scan line */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#F5B942] to-transparent shadow-[0_0_12px_#F5B942] animate-scan-sweep" />
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-[8px] font-bold text-[#F5B942] flex items-center gap-1">
                      <ScanFace className="w-2.5 h-2.5" />
                      SCAN
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-[#F5B942] text-[9px] font-extrabold text-[#172554] text-center py-0.5">
                      Guest Selfie
                    </div>
                  </div>

                  {/* Vector Arrow */}
                  <div className="flex flex-col items-center justify-center text-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-[#7C3AED] flex items-center justify-center shadow-lg">
                      <ArrowRight className="w-4 h-4 text-white rotate-90 sm:rotate-0" />
                    </div>
                    <span className="text-[9px] font-bold text-purple-200 mt-1">
                      0.18s
                    </span>
                  </div>

                  {/* 3 Matched Wedding Photos */}
                  <div className="grid grid-cols-3 gap-2.5 flex-1 w-full">
                    {matchedPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/25 shadow-md group"
                      >
                        <Image
                          src={photo.src}
                          alt={`Matched wedding photo ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="120px"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-1 bg-gradient-to-t from-black/90 to-transparent">
                          <div className="flex items-center justify-center gap-1 text-[9px] font-extrabold text-emerald-300">
                            <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{photo.score}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <Link
                  href="/guest"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs sm:text-sm font-extrabold shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Try AI Photo Finder</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold backdrop-blur-md transition-all"
                >
                  <span>Host an Event Gallery</span>
                </Link>
              </div>
            </div>

            {/* Right Column: How Eventora Works (4 Connected Steps) (6 cols) */}
            <div className="lg:col-span-6 lg:border-l lg:border-white/10 lg:pl-10 space-y-6 motion-preset-slide-left-sm motion-preset-fade motion-duration-700 motion-delay-150">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-purple-300">
                  Simple 4-Step Flow
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                  How Eventora Works
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  From planning your venue and menu to instant AI photo delivery
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {steps.map((st) => {
                  const Icon = st.icon;
                  return (
                    <div
                      key={st.num}
                      className="relative p-4 sm:p-5 rounded-2xl bg-white/8 hover:bg-white/12 border border-white/12 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border ${st.accent} shadow-sm group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black font-mono text-white/35 group-hover:text-[#F5B942] transition-colors">
                          STEP {st.num}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">
                        {st.title}
                      </h4>
                      <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                        {st.desc}
                      </p>
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
