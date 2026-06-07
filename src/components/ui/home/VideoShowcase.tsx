"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, Sparkles, ShieldCheck, Zap, Check, Volume2 } from "lucide-react";

export default function VideoShowcase() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative w-full py-16 lg:py-24 border-t border-white/5">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#d4af37]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[#b76e79]/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Features (col-span-5) */}
          <div className="lg:col-span-5 space-y-6 text-left relative z-10">
            {/* Floating luxury badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#d4af37] text-xs font-black uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.05)]">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
              <span>Product Walkthrough</span>
            </div>

            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              See Wedding AI in <br />
              <span className="text-gold-gradient">Real Action</span>
            </h2>
            
            <p className="text-sm sm:text-base text-gray-400 font-medium leading-relaxed">
              Experience the magic yourself. Watch how photographers upload galleries and how guests discover their wedding memories instantly using just their faces.
            </p>

            {/* Feature points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Drag & Drop Upload</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Upload thousands of photos simultaneously using our parallel multi-threaded system.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Sub-0.2s Matching Speed</h4>
                  <p className="text-xs text-gray-400 mt-0.5">Guests snap a selfie and view their personalized photo collections in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-1">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Zero-Storage Privacy</h4>
                  <p className="text-xs text-gray-400 mt-0.5">In-memory processing ensures selfie coordinates are purged instantly from RAM.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Autoplaying Video Mockup (col-span-7) */}
          <div className="lg:col-span-7 relative z-10">
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(212,175,55,0.08)] group cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              {/* Autoplaying, muted, looping video uploaded by user */}
              <video
                src="/demo1.mp4"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 "
                autoPlay
                muted
                loop
                playsInline
              />

              {/* Dark overlay with grid/vibe */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 pointer-events-none" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/80 backdrop-blur-md border border-emerald-500/35 rounded-full px-3.5 py-1.5 text-[9px] font-mono text-white tracking-widest uppercase">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Click to Hear Audio</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Premium Video Player Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-10"
            onClick={() => setIsOpen(false)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all duration-200 z-50 cursor-pointer"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>

              {/* Custom Video Playing with sound unmuted */}
              <video
                src="/demo.mp4"
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                loop
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
