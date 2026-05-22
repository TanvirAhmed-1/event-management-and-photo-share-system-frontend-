"use client";

import { motion } from "framer-motion";
import { Shield, UserCheck, Zap } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";

export default function PlatformBenefits() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7 }}
      className="w-full"
    >
      <GlassCard className="p-8 sm:p-12 border border-[#d4af37]/15 bg-[#0a0a0d]/20 relative overflow-hidden" hoverEffect={false}>
        {/* Glowing element inside card */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-radial-gradient(circle, rgba(212,175,55,0.035)_0%, transparent_70%) blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight text-white">
              Designed for Luxury, <br />
              Built for <span className="text-gold-gradient font-black">High Performance</span>
            </h2>

            <div className="space-y-6 pt-4">
              {/* Benefit 1 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Zap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white mb-1">ZIP Stream Multi-Downloads</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Organizers download selected photo sets simultaneously as one structured, high-compression ZIP file streamed from our backend.</p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white mb-1">Advanced Neural Privacy</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Guest selfies are processed temporarily in memory to generate comparison embedding coordinates and deleted immediately.</p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/15 flex items-center justify-center text-[#d4af37] shrink-0">
                  <UserCheck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white mb-1">Supercharged Storage Control</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">Upgrade subscription plan parameters, see detailed size benchmarks, and modify active wedding catalogs on the fly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Stats Column */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl bg-[#0c0c10]/60 border border-white/5 text-center flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-4xl font-extrabold font-heading text-gold-gradient mb-1">&lt; 3s</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-heading">Matching Speed</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#0c0c10]/60 border border-white/5 text-center flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-4xl font-extrabold font-heading text-gold-gradient mb-1">100%</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-heading">Privacy Guaranteed</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#0c0c10]/60 border border-white/5 text-center flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-4xl font-extrabold font-heading text-gold-gradient mb-1">20 GB</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-heading">Max Tier Storage</div>
            </div>
            <div className="p-6 rounded-2xl bg-[#0c0c10]/60 border border-white/5 text-center flex flex-col justify-center items-center">
              <div className="text-2xl sm:text-4xl font-extrabold font-heading text-gold-gradient mb-1">STREAM</div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-widest font-heading">ZIP Downloading</div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.section>
  );
}
