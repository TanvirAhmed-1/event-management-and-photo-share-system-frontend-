"use client";

import { motion } from "framer-motion";
import { Camera, Layers, Sparkles } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";
import Container from "@/components/shared/Container";

export default function HowItWorks() {
  return (
    <section id="features" className="flex flex-col gap-12 w-full">
      <Container>
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
            Step by Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white mt-1 mb-4">
            Elegant Memories, <span className="text-rose-gradient font-black">Delivered</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Ditch huge chaotic cloud storage folders. Our biometric mapping technology finds guest photos securely.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <GlassCard className="flex flex-col items-center text-center p-8 h-full border border-white/5 bg-[#0a0a0d]/30" hoverEffect={true}>
              <div className="w-14 h-14 rounded-full bg-gold-dark-gradient border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading text-white mb-2 uppercase tracking-wide">1. Seed the Event Pool</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Photographers or the couple upload raw, high-resolution snapshots directly into their secure dashboard catalog.
              </p>
            </GlassCard>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="flex flex-col items-center text-center p-8 h-full border border-white/5 bg-[#0a0a0d]/30" hoverEffect={true}>
              <div className="w-14 h-14 rounded-full bg-gold-dark-gradient border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading text-white mb-2 uppercase tracking-wide">2. Snap a Selfie</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Guests open the event scanner URL, align their face inside our browser camera alignment guide, and take a quick photo.
              </p>
            </GlassCard>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <GlassCard className="flex flex-col items-center text-center p-8 h-full border border-white/5 bg-[#0a0a0d]/30" hoverEffect={true}>
              <div className="w-14 h-14 rounded-full bg-gold-dark-gradient border border-[#d4af37]/35 flex items-center justify-center text-[#d4af37] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.15)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-heading text-white mb-2 uppercase tracking-wide">3. Find Your Snaps</h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                The matching pipeline scans facial details in seconds, displaying matched professional photos for individual or bulk download.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
