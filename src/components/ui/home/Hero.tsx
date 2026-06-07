"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {ArrowRight, Sparkle, UploadCloud, Check, Lock, ChevronLeft, ChevronRight} from "lucide-react";
import Button from "@/components/ui/Button";

interface SlideData {
  badge: string;
  badgeType: "gold" | "rose";
  title: React.ReactNode;
  description: string;
  primaryCta: { text: string; href: string };
  secondaryCta: { text: string; href: string };
  illustration: React.ReactNode;
}

export default function Hero({ containerVariants, itemVariants }: { containerVariants: any; itemVariants: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev

  const slides: SlideData[] = [
    {
      badge: "GUEST SCANNER EXPERIENCE",
      badgeType: "gold",
      title: (
        <>
          Instant Photo Retrieval <br />
          via <span className="text-gold-gradient font-black">Selfie Scan</span>
        </>
      ),
      description: "Guests open the event URL, take a quick browser selfie, and instantly retrieve every high-res professional shot they appear in. Zero manual searching, total fun.",
      primaryCta: { text: "Create Event Pool", href: "/register" },
      secondaryCta: { text: "Explore Core Tech", href: "#features" },
      illustration: (
        <div className="relative w-full h-[420px] overflow-hidden flex items-center justify-center p-4">
          {/* Background network lines and glow particles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {/* Glowing gold dot in the center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial-gradient(circle, rgba(212,175,55,0.08)_0%, transparent_70%) blur-xl" />
            
            {/* Network lines */}
            <svg className="absolute inset-0 w-full h-full opacity-35">
              <line x1="25%" y1="75%" x2="50%" y2="45%" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="75%" y1="25%" x2="50%" y2="45%" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
              <line x1="75%" y1="75%" x2="50%" y2="45%" stroke="#d4af37" strokeWidth="1" strokeDasharray="3,3" />
              <circle cx="50%" cy="45%" r="3" fill="#d4af37" />
              <circle cx="25%" cy="75%" r="3" fill="#d4af37" />
              <circle cx="75%" cy="25%" r="3" fill="#d4af37" />
              <circle cx="75%" cy="75%" r="3" fill="#d4af37" />
            </svg>
          </div>

          {/* Polaroid 1: Left Bottom Guest */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -30, y: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-0 bottom-10 w-36 p-2.5 pb-5 rounded-xl border border-white/10 bg-[#0d0d10] shadow-2xl -rotate-12 hover:-rotate-6 hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80" 
                alt="Guest" 
                className="w-full h-full object-cover"
              />
              {/* Bounding box around face */}
              <div className="absolute top-[18%] left-[28%] w-[42%] h-[42%] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)] rounded-sm">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[6px] font-bold px-1 rounded-sm uppercase">Guest</span>
              </div>
            </div>
            <div className="text-center font-heading font-bold text-[9px] text-gray-400 mt-2.5 tracking-wider uppercase">
              Emily
            </div>
          </motion.div>

          {/* Polaroid 2: Right Top Bridesmaid */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 30, y: -30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute right-0 top-10 w-32 p-2 pb-4 rounded-xl border border-white/10 bg-[#0d0d10] shadow-2xl rotate-12 hover:rotate-6 hover:scale-105 transition-all duration-300 z-10 cursor-pointer"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" 
                alt="Bridesmaid" 
                className="w-full h-full object-cover"
              />
              {/* Bounding box around face */}
              <div className="absolute top-[18%] left-[30%] w-[40%] h-[40%] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)] rounded-sm">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[5px] font-bold px-0.5 rounded-sm uppercase">Emma</span>
              </div>
            </div>
            <div className="text-center font-heading font-bold text-[8px] text-gray-400 mt-2 tracking-wider uppercase">
              Bridesmaid
            </div>
          </motion.div>

          {/* Polaroid 3: Right Bottom Groom's Friend */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 30, y: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute right-0 bottom-6 w-36 p-2.5 pb-5 rounded-xl border border-white/10 bg-[#0d0d10] shadow-2xl rotate-6 hover:rotate-2 hover:scale-105 transition-all duration-300 z-15 cursor-pointer"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
                alt="Groom's Friend" 
                className="w-full h-full object-cover"
              />
              {/* Bounding box around face */}
              <div className="absolute top-[18%] left-[28%] w-[42%] h-[42%] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)] rounded-sm">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[5px] font-bold px-1 rounded-sm uppercase">Friend</span>
              </div>
            </div>
            <div className="text-center font-heading font-bold text-[9px] text-gray-400 mt-2.5 tracking-wider uppercase">
              James
            </div>
          </motion.div>

          {/* Polaroid 4: Main Center Couple (Bride & Groom) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-56 p-4 pb-8 rounded-2xl border-2 border-[#d4af37]/40 bg-gold-dark-gradient/95 shadow-[0_0_35px_rgba(212,175,55,0.18)] -rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 z-20 cursor-pointer"
          >
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=400&auto=format&fit=crop&q=80" 
                alt="Bride and Groom" 
                className="w-full h-full object-cover"
              />
              {/* Face 1: Bride */}
              <div className="absolute top-[18%] left-[22%] w-[25%] h-[32%] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)] rounded-sm animate-pulse">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[5px] font-black px-1 rounded-sm uppercase tracking-widest">Sarah</span>
              </div>
              {/* Face 2: Groom */}
              <div className="absolute top-[14%] left-[54%] w-[25%] h-[32%] border-2 border-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.8)] rounded-sm animate-pulse">
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d4af37] text-black text-[5px] font-black px-1 rounded-sm uppercase tracking-widest">David</span>
              </div>
            </div>
            <div className="text-center font-heading font-black text-[11px] text-white mt-3 tracking-widest uppercase">
              Sarah (Bride)
            </div>
          </motion.div>
        </div>
      )
    },
    {
      badge: "PHOTOGRAPHER WORKFLOW",
      badgeType: "rose",
      title: (
        <>
          Seed the Event Pool <br />
          with <span className="text-rose-gradient font-black">Bulk Uploads</span>
        </>
      ),
      description: "Photographers or wedding couples drag-and-drop raw high-res camera captures. Our server computes embeddings, seeding the secure catalog for attendees in minutes.",
      primaryCta: { text: "Register & Start", href: "/register" },
      secondaryCta: { text: "Pricing Packages", href: "#pricing" },
      illustration: (
        <div className="relative w-full h-[420px] overflow-hidden flex items-center justify-center p-4">
          {/* Background decorative circles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial-gradient(circle, rgba(183,110,121,0.06)_0%, transparent_70%) blur-xl" />
          </div>

          {/* Staked Photo 1 (Wedding Cake / Details) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -25, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: -8 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute left-0 top-16 w-36 p-2.5 pb-5 rounded-xl border border-white/10 bg-[#0d0d10] shadow-xl hover:-rotate-2 hover:scale-105 transition-all duration-300 z-10"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=200&auto=format&fit=crop&q=80" 
                alt="Wedding Decor" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[6px] text-gray-500 font-mono mt-2 uppercase tracking-widest text-center">IMG_3892.JPG</div>
          </motion.div>

          {/* Staked Photo 2 (Wedding Rings / Close up) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 25, rotate: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="absolute right-0 top-12 w-36 p-2.5 pb-5 rounded-xl border border-white/10 bg-[#0d0d10] shadow-xl hover:rotate-2 hover:scale-105 transition-all duration-300 z-10"
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&auto=format&fit=crop&q=80" 
                alt="Wedding Rings" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-[6px] text-gray-500 font-mono mt-2 uppercase tracking-widest text-center">IMG_3904.JPG</div>
          </motion.div>

          {/* Central Glassmorphic Uploading Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-64 p-5 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md shadow-2xl z-20"
          >
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">BULK_UPLOADER_V1</span>
              </div>
              <span className="text-[8px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">84%</span>
            </div>

            {/* Simulated uploader thumbnail */}
            <div className="flex items-center gap-3 bg-white/2 rounded-xl p-2.5 border border-white/5 mb-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=100&auto=format&fit=crop&q=80" 
                  alt="Couple" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5 text-white animate-bounce" />
                </div>
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-[10px] font-bold text-white truncate">IMG_wedding_raw_492.jpg</div>
                <div className="text-[8px] text-gray-500 font-mono">14.2 MB &bull; Uploading...</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "84%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-full rounded-full bg-rose-gradient"
                />
              </div>
              <div className="flex items-center justify-between text-[7px] font-mono text-gray-600">
                <span>SPEED: 8.4MB/s</span>
                <span>ETA: 12 SEC</span>
              </div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      badge: "HIGH-PERFORMANCE AI BACKEND",
      badgeType: "gold",
      title: (
        <>
          Sub-0.2 Second <br />
          <span className="text-gold-gradient font-black">Matching Engine</span>
        </>
      ),
      description: "Powered by optimized neural network embeddings. Matches Euclidean facial structures in real-time, delivering lightning-fast results even under massive concurrent traffic.",
      primaryCta: { text: "Get Started Free", href: "/register" },
      secondaryCta: { text: "Learn Architecture", href: "#features" },
      illustration: (
        <div className="relative w-full h-[420px] overflow-hidden flex items-center justify-center p-4">
          {/* Background AI grid particles */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial-gradient(circle, rgba(212,175,55,0.06)_0%, transparent_70%) blur-xl" />
          </div>

          {/* Main scanning image card (Bride portrait) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-64 p-3 pb-5 rounded-2xl border border-[#d4af37]/35 bg-[#0c0c10] shadow-[0_0_35px_rgba(212,175,55,0.1)] z-10"
          >
            <div className="relative aspect-[4/5] w-full rounded-xl overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" 
                alt="Scan Portrait" 
                className="w-full h-full object-cover"
              />
              
              {/* Biometric overlay nodes */}
              <svg className="absolute inset-0 w-full h-full">
                {/* Face landmarks connections */}
                <line x1="45%" y1="35%" x2="55%" y2="35%" stroke="#d4af37" strokeWidth="1" />
                <line x1="45%" y1="35%" x2="50%" y2="45%" stroke="#d4af37" strokeWidth="1" />
                <line x1="55%" y1="35%" x2="50%" y2="45%" stroke="#d4af37" strokeWidth="1" />
                <line x1="50%" y1="45%" x2="42%" y2="55%" stroke="#d4af37" strokeWidth="1" />
                <line x1="50%" y1="45%" x2="58%" y2="55%" stroke="#d4af37" strokeWidth="1" />
                <line x1="42%" y1="55%" x2="58%" y2="55%" stroke="#d4af37" strokeWidth="1" />

                {/* Nodes */}
                <circle cx="45%" cy="35%" r="2" fill="#d4af37" className="animate-pulse" />
                <circle cx="55%" cy="35%" r="2" fill="#d4af37" className="animate-pulse" />
                <circle cx="50%" cy="45%" r="2" fill="#d4af37" className="animate-pulse" />
                <circle cx="42%" cy="55%" r="2" fill="#d4af37" className="animate-pulse" />
                <circle cx="58%" cy="55%" r="2" fill="#d4af37" className="animate-pulse" />
              </svg>

              {/* Scanning gold target frame */}
              <div className="absolute top-[22%] left-[28%] w-[44%] h-[44%] border border-[#d4af37] rounded-sm shadow-[0_0_8px_rgba(212,175,55,0.4)]">
                <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#d4af37]" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#d4af37]" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#d4af37]" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#d4af37]" />
              </div>
            </div>

            {/* Match output display */}
            <div className="mt-3 bg-white/2 border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
              <div className="text-left font-mono">
                <span className="text-[6px] text-gray-500 block">AI INFERENCE SPEED</span>
                <span className="text-[9px] font-bold text-white">0.18 SECONDS</span>
              </div>
              <span className="text-[8px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">99.8% ACC</span>
            </div>
          </motion.div>

          {/* Floating matched photo thumbnail */}
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-0 bottom-10 bg-black/95 border border-[#d4af37]/35 rounded-2xl p-3 shadow-2xl flex items-center gap-2.5 z-20 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=80&auto=format&fit=crop&q=80" 
                alt="Matched Crop" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left pr-1.5">
              <div className="text-[9px] font-black text-white">MATCH_FOUND</div>
              <div className="text-[7px] text-gray-500 font-mono">ID: 028-Bridesmaid</div>
            </div>
          </motion.div>
        </div>
      )
    },
    {
      badge: "SECURE & COMPLIANT",
      badgeType: "rose",
      title: (
        <>
          Ironclad Privacy & <br />
          <span className="text-rose-gradient font-black">Secure Data Shield</span>
        </>
      ),
      description: "Guest selfies are processed purely in-memory to generate temporary face embeddings and instantly deleted. No public catalogs are exposed, keeping personal photos safe.",
      primaryCta: { text: "Create Secure Account", href: "/register" },
      secondaryCta: { text: "Privacy Standards", href: "#features" },
      illustration: (
        <div className="relative w-full h-[420px] overflow-hidden flex items-center justify-center p-4">
          {/* Background privacy rings */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-radial-gradient(circle, rgba(183,110,121,0.06)_0%, transparent_70%) blur-xl" />
          </div>

          {/* Protected Wedding Couple Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="absolute w-84 p-4 pb-6 rounded-2xl border border-white/10 bg-[#0d0d10] shadow-2xl z-10"
          >
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-gray-900">
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=80" 
                alt="Secure Wedding Walk" 
                className="w-full h-full object-cover filter brightness-[0.7] blur-[1px]"
              />
              {/* Golden Shield overlay over photo */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/45">
                <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(183,110,121,0.3)] animate-pulse">
                  <Lock className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Bottom metadata tags */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                <span>ACCESS_CONTROL</span>
                <span className="text-emerald-400 font-bold">100% PRIVATE</span>
              </div>
              <div className="h-[1px] bg-white/5" />
              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500">
                <span>SELFIE_STORAGE</span>
                <span className="text-rose-400 font-bold">RAM ONLY &bull; PURGED</span>
              </div>
            </div>
          </motion.div>

          {/* Floating verified badge */}
          <motion.div 
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-0 bottom-4 bg-black/95 border border-emerald-500/30 rounded-2xl p-3.5 shadow-2xl flex items-center gap-2.5 z-20"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-left font-mono pr-1.5">
              <div className="text-[10px] font-bold text-white uppercase">Selfie Purged</div>
              <div className="text-[8px] text-gray-500">Memory freed in 0.0s</div>
            </div>
          </motion.div>
        </div>
      )
    }
  ];

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6500);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Slider animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }
    })
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full max-w-6xl mx-auto z-10 px-4 md:px-0">
      
      {/* Slider Inner Container */}
      <div className="relative overflow-hidden min-h-[660px] lg:min-h-[500px] flex items-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            
            {/* LEFT: Slide Content Text (Lg: col-span-6) */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Floating luxury badge */}
              <div
                className={`inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full border text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 ${
                  currentSlideData.badgeType === "gold"
                    ? "border-[#d4af37]/25 bg-[#d4af37]/5 text-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.06)]"
                    : "border-[#b76e79]/25 bg-[#b76e79]/5 text-[#ffd1dc] shadow-[0_0_15px_rgba(183,110,121,0.06)]"
                }`}
              >
                <Sparkle className={`w-3.5 h-3.5 animate-spin-slow ${
                  currentSlideData.badgeType === "gold" ? "text-[#d4af37]" : "text-[#b76e79]"
                }`} />
                {currentSlideData.badge}
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white">
                {currentSlideData.title}
              </h1>

              {/* Description */}
              <p className="max-w-xl text-xs sm:text-sm md:text-base text-gray-400 font-medium leading-relaxed mb-8">
                {currentSlideData.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto z-10">
                <Link href={currentSlideData.primaryCta.href} className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto group">
                    {currentSlideData.primaryCta.text}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href={currentSlideData.secondaryCta.href} className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    {currentSlideData.secondaryCta.text}
                  </Button>
                </a>
              </div>
            </div>

            {/* RIGHT: Slide Illustration mockup (Lg: col-span-6) */}
            <div className="lg:col-span-6 flex justify-center w-full relative">
              {/* Background ambient gold/rose glow behind illustration */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-40 ${
                currentSlideData.badgeType === "gold" ? "bg-radial-gradient(circle, rgba(212,175,55,0.25)_0%, transparent_70%)" : "bg-radial-gradient(circle, rgba(183,110,121,0.25)_0%, transparent_70%)"
              }`} />
              
              <div className="w-full max-w-lg relative z-10">
                {currentSlideData.illustration}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Indicators & Dots */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-8">
        
        {/* Previous button */}
        <button
          onClick={handlePrev}
          className="w-10 h-10 rounded-full border border-white/5 hover:border-[#d4af37]/35 text-gray-500 hover:text-white bg-white/2 hover:bg-white/5 flex items-center justify-center transition-all duration-300 shadow-md active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dynamic Navigation Dots */}
        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentSlide 
                  ? "w-8 bg-gold-gradient shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                  : "w-2 bg-white/10 hover:bg-white/20"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          className="w-10 h-10 rounded-full border border-white/5 hover:border-[#d4af37]/35 text-gray-500 hover:text-white bg-white/2 hover:bg-white/5 flex items-center justify-center transition-all duration-300 shadow-md active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
