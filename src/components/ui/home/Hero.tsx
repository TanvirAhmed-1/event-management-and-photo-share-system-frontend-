"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import Button from "@/components/ui/Button";

interface HeroProps {
  containerVariants: any;
  itemVariants: any;
}

export default function Hero({ containerVariants, itemVariants }: HeroProps) {
  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center text-center relative max-w-5xl mx-auto"
    >
      {/* Floating Luxury Tag */}
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#d4af37]/25 bg-[#d4af37]/5 text-[#d4af37] text-[10px] sm:text-xs font-black uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(212,175,55,0.06)]"
      >
        <Sparkle className="w-3.5 h-3.5 animate-spin-slow text-[#d4af37]" />
        Elevating Wedding Memories
      </motion.div>

      {/* Headline */}
      <motion.h1
        variants={itemVariants}
        className="font-heading text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 text-white"
      >
        Instant Face Finder for <br className="hidden sm:inline" />
        <span className="text-gold-gradient font-black">Luxurious Weddings</span>
      </motion.h1>

      {/* Subhead */}
      <motion.p
        variants={itemVariants}
        className="max-w-2xl text-xs sm:text-sm md:text-base text-gray-400 font-medium leading-relaxed mb-12"
      >
        Organizers seed the professional catalog. Guests scan their face in real-time to retrieve every gorgeous shot instantly. Zero manual hunting, total privacy.
      </motion.p>

      {/* Action CTAs */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto z-10"
      >
        <Link href="/register" className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto group">
            Create Event Pool
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <a href="#features" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Core Tech
          </Button>
        </a>
      </motion.div>
    </motion.section>
  );
}
