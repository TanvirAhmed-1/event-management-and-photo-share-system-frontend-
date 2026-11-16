"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  UtensilsCrossed,
  ShieldCheck,
  PartyPopper,
  ArrowRight,
  Sparkles,
  ScanFace,
  QrCode,
  Camera,
  Download,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import Container from "@/components/shared/Container";

export default function AiPhotoAndWorkflow() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const aiSteps = [
    {
      num: "1",
      title: "Scan Event QR or Enter Event ID",
      desc: "Open your wedding or party gallery link right from your phone browser.",
      icon: QrCode,
    },
    {
      num: "2",
      title: "Take or Upload a Quick Selfie",
      desc: "Our 512-D AI scans thousands of event photos in 0.18s without storing your selfie.",
      icon: Camera,
    },
    {
      num: "3",
      title: "Download All Your HD Photos",
      desc: "Instantly view every photo you appear in and download them in full resolution.",
      icon: Download,
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Plan & Book Event",
      desc: "Select your date, city, venue, and verified photographers or decorators in minutes.",
      icon: CalendarDays,
      iconBg: "from-violet-500 to-purple-600",
      badgeBg: "bg-purple-50 text-[#7C3AED] border-purple-200/80",
    },
    {
      num: "02",
      title: "Customize Catering",
      desc: "Build your royal Kacchi, buffet, or corporate menu with transparent per-plate pricing.",
      icon: UtensilsCrossed,
      iconBg: "from-amber-500 to-orange-500",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
    {
      num: "03",
      title: "Upload Event Gallery",
      desc: "Photographers upload event photos to our high-speed cloud—indexed automatically by AI.",
      icon: ShieldCheck,
      iconBg: "from-emerald-500 to-teal-600",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    {
      num: "04",
      title: "Instant Selfie Download",
      desc: "Guests scan a selfie via QR code and download every photo they appear in within 0.18s.",
      icon: PartyPopper,
      iconBg: "from-fuchsia-500 to-pink-600",
      badgeBg: "bg-pink-50 text-pink-700 border-pink-200/80",
    },
  ];

  return (
    <section className="w-full">
      {/* PART 1: Full-Width Royal-Violet AI Photo Finder with Live Demo Video (Compact Height) */}
      <div className="relative w-full py-6 bg-gradient-to-br from-[#160D3A] via-[#311777] to-[#6D28D9] text-white overflow-hidden">
        {/* Ambient Mesh Orbs */}
        <div className="absolute -top-28 right-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 left-1/4 w-96 h-96 bg-violet-400/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Column: Clear Step-by-Step Explanation (6 cols) */}
            <div className="lg:col-span-6 space-y-3.5">  
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                  Find Every Event Photo{" "}
                  <span className="bg-gradient-to-r from-[#FDE68A] via-[#F5B942] to-[#F472B6] bg-clip-text text-transparent">
                    with One Selfie
                  </span>
                </h2>
                <p className="text-purple-100/85 text-xs mt-1.5 max-w-lg leading-relaxed">
                  Watch how guests find and download their wedding &amp; party photos in seconds—no app download needed.
                </p>
              </div>

              {/* 3 Clear Compact Steps */}
              <div className="space-y-2 max-w-lg">
                {aiSteps.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.num}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md hover:bg-white/14 transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B942] to-amber-500 text-[#17123B] flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold text-white leading-tight">
                          {item.num}. {item.title}
                        </div>
                        <p className="text-[11px] text-purple-100/80 leading-snug truncate">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-0.5">
                <Link
                  href="/guest"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1E144F] hover:bg-purple-50 text-xs font-extrabold shadow-lg shadow-black/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ScanFace className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Try AI Photo Finder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold backdrop-blur-md transition-all"
                >
                  <span>Host Event Gallery</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Compact Live Demo Video Frame (/demo1.mp4) (6 cols) */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[520px] rounded-2xl overflow-hidden border-2 border-white/25 bg-[#120A33] shadow-2xl shadow-black/40 group">
                {/* Top Live Demo Badge */}
                <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live AI Demo</span>
                </div>

                {/* Video Player */}
                <video
                  ref={videoRef}
                  src="/demo1.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[240px] sm:h-[300px] object-cover block"
                />

                {/* Bottom Controls Bar */}
                <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause demo video" : "Play demo video"}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#7C3AED] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition"
                  >
                    {isPlaying ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5 ml-0.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute demo video" : "Mute demo video"}
                    className="w-8 h-8 rounded-full bg-black/60 hover:bg-[#7C3AED] backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition"
                  >
                    {isMuted ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* PART 2: Modern Light-Mode 4-Step Workflow ("How Eventora Works") */}
      <div className="w-full py-5 bg-gradient-to-b from-[#F8F5FF] to-white">
        <Container className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#172554] tracking-tight">
                How Eventora <span className="text-[#7C3AED]">Works</span>
              </h3>
            </div>

            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:text-[#6D28D9] group"
            >
              <span>View Full Platform Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={st.num}
                  className="group relative rounded-2xl bg-white hover:bg-[#FAF8FF] p-4 sm:p-5 border border-slate-200/80 hover:border-purple-300 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${st.iconBg} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold border ${st.badgeBg}`}
                      >
                        STEP {st.num}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-[#172554] group-hover:text-[#7C3AED] transition-colors">
                      {st.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-[#7C3AED] transition-colors">
                    <span>{idx < 3 ? "Next Step" : "Ready to Download"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </div>
    </section>
  );
}
