"use client";

import { motion } from "framer-motion";
import { Camera, Search, Star, Zap, Scan, CheckCircle2, Cpu, ShieldCheck } from "lucide-react";

interface ScannerIllustrationProps {
  floatVariants: any;
}

export default function ScannerIllustration({ floatVariants }: ScannerIllustrationProps) {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.96, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="relative max-w-5xl mx-auto w-full"
    >
      {/* Luxury border wrapper */}
      <div className="rounded-3xl border border-[#d4af37]/15 bg-[#0a0a0d]/40 p-4 sm:p-6 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glowing Backdrop Mesh */}
        <div className="absolute inset-0 bg-radial-gradient(circle, rgba(212,175,55,0.08)_0%, transparent_75%) pointer-events-none rounded-3xl" />
        
        {/* Main Grid: 3 columns on desktop, 1 column on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
          
          {/* Column 1 & 2: Live Viewfinder Camera Simulation */}
          <div className="lg:col-span-2 rounded-2xl bg-[#030304]/90 border border-white/5 relative overflow-hidden flex flex-col p-5 min-h-[380px] sm:min-h-[440px]">
            
            {/* Viewfinder Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 animate-pulse" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                <span className="text-[10px] uppercase font-heading font-black text-gray-400 tracking-widest ml-1">
                  ShareEventPhoto AI Viewfinder v1.0
                </span>
              </div>
              <span className="text-[9px] font-black uppercase text-[#d4af37] bg-[#d4af37]/5 px-3 py-1 rounded-full border border-[#d4af37]/20 flex items-center gap-1">
                <Star className="w-3 h-3 text-[#d4af37] animate-spin-slow" />
                99.4% Biometric Precision
              </span>
            </div>

            {/* Inner Viewfinder Screen */}
            <div className="flex-grow rounded-xl bg-[#060608] border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-6">
              
              {/* Subtle Tech Grid lines */}
              <div className="absolute inset-0 bg-[radial-gradient(rgba(212,175,55,0.015)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
              
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-[#d4af37]/40 rounded-tl" />
              <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-[#d4af37]/40 rounded-tr" />
              <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-[#d4af37]/40 rounded-bl" />
              <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-[#d4af37]/40 rounded-br" />

              {/* Crosshair Center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-20">
                <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white" />
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white" />
              </div>

              {/* Central scanning scanner */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-dashed border-[#d4af37]/30 flex items-center justify-center relative overflow-hidden bg-gold-dark-gradient/5 shadow-[0_0_40px_rgba(212,175,55,0.03)]"
                >
                  {/* Glowing camera frame */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-[#d4af37]/15 flex items-center justify-center bg-black/60 relative">
                    <Camera className="w-10 h-10 sm:w-14 sm:h-14 text-[#d4af37]/90 animate-pulse" />
                    
                    {/* Pulsing Scan Coordinates Bounding Box */}
                    <div className="absolute inset-4 border-2 border-dashed border-[#b76e79]/30 rounded-xl animate-pulse" />
                  </div>
                  
                  {/* Animated laser sweep line */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent shadow-[0_0_20px_#d4af37] animate-laser" />
                </motion.div>
                
                <div className="mt-5 text-center">
                  <p className="text-[10px] font-heading font-black tracking-widest text-[#d4af37] uppercase animate-pulse">
                    Scanning Face Vectors
                  </p>
                  <p className="text-[8px] sm:text-[9px] text-gray-500 mt-1 font-mono">
                    Euclidean Metric Match Active &bull; FPS: 60.0
                  </p>
                </div>
              </div>

              {/* Floating Match box coordinate data */}
              <div className="absolute bottom-4 left-4 bg-black/80 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[8px] text-gray-400 space-y-0.5">
                <div>[X: 432.12px, Y: 981.45px]</div>
                <div>LANDMARKS: 512 DETECTED</div>
                <div>GLOW_VEC: ACTIVE</div>
              </div>

              <div className="absolute bottom-4 right-4 bg-black/80 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[8px] text-[#d4af37] flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" />
                <span>SECURE IN-MEMORY MATCH</span>
              </div>
            </div>

            {/* Bottom stats indicators bar */}
            <div className="flex items-center justify-between text-[10px] text-gray-500 border-t border-white/5 pt-4 mt-4">
              <span className="flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#d4af37]/75" /> 
                Parallel matching pipelines
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#d4af37]/75" /> 
                Instant ZIP stream download ready
              </span>
            </div>
          </div>

          {/* Column 3: AI Match Feed & Pipeline Stats */}
          <div className="rounded-2xl bg-[#0c0c10]/70 border border-white/5 p-5 flex flex-col justify-between min-h-[380px]">
            
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-3">
                <Cpu className="w-4 h-4 text-[#d4af37]" />
                <h3 className="font-heading text-xs uppercase tracking-wider font-bold text-white">
                  Match Pipeline Status
                </h3>
              </div>

              {/* Server Status List */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between bg-white/2 px-3 py-2 rounded-xl border border-white/2">
                  <span className="text-[10px] text-gray-400 font-medium">Neural Embeddings</span>
                  <span className="text-[9px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    ONLINE
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/2 px-3 py-2 rounded-xl border border-white/2">
                  <span className="text-[10px] text-gray-400 font-medium">Matching Latency</span>
                  <span className="text-[9px] font-black font-mono text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                    0.18s avg
                  </span>
                </div>
                <div className="flex items-center justify-between bg-white/2 px-3 py-2 rounded-xl border border-white/2">
                  <span className="text-[10px] text-gray-400 font-medium">Database Security</span>
                  <span className="text-[9px] font-black font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> AES-256
                  </span>
                </div>
              </div>

              {/* Feed Title */}
              <div className="text-[9px] font-black uppercase text-gray-500 tracking-wider mb-3">
                Recent Pipeline Matches
              </div>

              {/* Mock Match Feed */}
              <div className="space-y-2.5">
                {/* Match 1 */}
                <div className="flex items-center justify-between bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl p-2.5 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-dark-gradient border border-[#d4af37]/20 flex items-center justify-center font-heading font-black text-[10px] text-[#d4af37]">
                      M1
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">IMG_4821_Guest.jpg</div>
                      <div className="text-[8px] text-gray-500">Vector extracted in 11ms</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                      99.8% Match
                    </span>
                    <span className="text-[7px] text-gray-600 font-mono">Found in 0.12s</span>
                  </div>
                </div>

                {/* Match 2 */}
                <div className="flex items-center justify-between bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl p-2.5 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-rose-gradient/20 border border-[#b76e79]/20 flex items-center justify-center font-heading font-black text-[10px] text-[#ffd1dc]">
                      M2
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">IMG_0982_Main.jpg</div>
                      <div className="text-[8px] text-gray-500">Vector extracted in 9ms</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                      98.9% Match
                    </span>
                    <span className="text-[7px] text-gray-600 font-mono">Found in 0.14s</span>
                  </div>
                </div>

                {/* Match 3 */}
                <div className="flex items-center justify-between bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl p-2.5 transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-dark-gradient border border-[#d4af37]/20 flex items-center justify-center font-heading font-black text-[10px] text-[#d4af37]">
                      M3
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white">IMG_1204_Dance.jpg</div>
                      <div className="text-[8px] text-gray-500">Vector extracted in 15ms</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                      99.4% Match
                    </span>
                    <span className="text-[7px] text-gray-600 font-mono">Found in 0.11s</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA Indicator */}
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-[9px] text-gray-500 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Biometric indices compiled and secured. Ready to find guest snaps.</span>
            </div>

          </div>

        </div>

      </div>
    </motion.section>
  );
}
