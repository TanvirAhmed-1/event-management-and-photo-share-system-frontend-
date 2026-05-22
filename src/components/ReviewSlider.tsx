"use client";

import { useState, useEffect, useRef } from "react";
import { useGetAllReviewsQuery, IReview } from "@/redux/features/review/reviewApi";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, MessageSquareQuote } from "lucide-react";
import GlassCard from "@/components/shared/GlassCard";

// Safe image path parser helper
const getImageUrl = (url?: string) => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";
  const root = base.replace(/\/api$/, "");
  return `${root}/${url.replace(/^\//, "")}`;
};

export default function ReviewSlider() {
  const { data: reviewResponse, isLoading } = useGetAllReviewsQuery();
  const reviews = reviewResponse?.data || [];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll logic
  const startAutoScroll = () => {
    stopAutoScroll();
    timerRef.current = setInterval(() => {
      if (reviews.length > 1) {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }
    }, 6000);
  };

  const stopAutoScroll = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  useEffect(() => {
    if (reviews.length > 1) {
      startAutoScroll();
    }
    return () => stopAutoScroll();
  }, [reviews]);

  const handlePrev = () => {
    if (reviews.length <= 1) return;
    stopAutoScroll();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    startAutoScroll();
  };

  const handleNext = () => {
    if (reviews.length <= 1) return;
    stopAutoScroll();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
    startAutoScroll();
  };

  // Slider animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    })
  };

  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="rounded-3xl border border-white/5 bg-[#0a0a0d]/30 p-8 backdrop-blur-md relative overflow-hidden flex flex-col items-center">
          <div className="w-full h-44 animate-pulse flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white/5" />
            <div className="w-32 h-4 bg-white/5 rounded" />
            <div className="w-64 h-3 bg-white/5 rounded" />
            <div className="w-48 h-3 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // If no reviews yet, show a nice empty message
  if (reviews.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto px-4 text-center py-12">
        <div className="rounded-2xl border border-white/5 bg-[#0a0a0d]/40 p-12 backdrop-blur-md flex flex-col items-center gap-4">
          <MessageSquareQuote className="w-12 h-12 text-[#d4af37]/35 animate-pulse" />
          <h3 className="font-heading font-bold text-lg text-white uppercase tracking-wider">No Reviews Yet</h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
            Be the first to share your gorgeous wedding photo retrieval experiences! Go to your dashboard to submit a review.
          </p>
        </div>
      </div>
    );
  }

  const activeReview = reviews[currentIndex];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
      
      {/* Decorative slider background glow behind active review */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.065)_0%, transparent_70%) blur-3xl pointer-events-none z-0" />

      {/* Main Review Card Slider Container */}
      <div className="relative min-h-[340px] flex items-center justify-center z-10">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeReview.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-2xl"
          >
            <GlassCard
              className="p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden flex flex-col items-center text-center cursor-grab active:cursor-grabbing hover:border-[#d4af37]/45"
              hoverEffect={true}
            >
              {/* Decorative Quote Icon */}
              <MessageSquareQuote className="absolute top-6 right-8 w-16 h-16 text-white/3 pointer-events-none" />

              {/* Reviewer Avatar */}
              <div className="relative mb-6">
                {activeReview.imageUrl ? (
                  <img
                    src={getImageUrl(activeReview.imageUrl)}
                    alt={activeReview.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gold-dark-gradient border-2 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.25)] flex items-center justify-center text-white font-heading font-black text-xl">
                    {activeReview.name.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Visual badge overlay */}
                <div className="absolute -bottom-1 -right-1 bg-black border border-[#d4af37]/35 rounded-full p-1 shadow-lg">
                  <Star className="w-3 h-3 text-[#d4af37] fill-[#d4af37]" />
                </div>
              </div>

              {/* Star Rating Rendering */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < activeReview.rating
                        ? "text-[#d4af37] fill-[#d4af37] drop-shadow-[0_0_4px_rgba(212,175,55,0.45)]"
                        : "text-gray-600 fill-transparent"
                    }`}
                  />
                ))}
              </div>

              {/* Review Comment Text */}
              <p className="text-sm sm:text-base text-gray-300 italic font-medium leading-relaxed mb-6 max-w-xl">
                "{activeReview.comment}"
              </p>

              {/* Reviewer Name */}
              <h3 className="font-heading font-bold text-white text-base tracking-wide uppercase">
                {activeReview.name}
              </h3>

              {/* Relative Date */}
              <span className="text-[9px] text-gray-500 font-mono mt-2 tracking-wider uppercase">
                {new Date(activeReview.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {reviews.length > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 z-20 relative">
          <button
            onClick={handlePrev}
            className="w-11 h-11 rounded-full border border-white/5 hover:border-[#d4af37]/30 text-gray-400 hover:text-[#d4af37] bg-white/2 hover:bg-white/5 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1.5">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  stopAutoScroll();
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                  startAutoScroll();
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-[#d4af37]" : "bg-white/10"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            className="w-11 h-11 rounded-full border border-white/5 hover:border-[#d4af37]/30 text-gray-400 hover:text-[#d4af37] bg-white/2 hover:bg-white/5 flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-105 active:scale-95"
            aria-label="Next review"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
