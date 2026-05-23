"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hook";
import { useCreateReviewMutation } from "@/redux/features/review/reviewApi";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Upload, Sparkles, X, Heart, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import confetti from "canvas-confetti";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Trigger luxury gold & rose gold confetti explosion
const triggerConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 45 * (timeLeft / duration);
    
    // Left side gold/white splash
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
      colors: ["#d4af37", "#f5e29f", "#b76e79", "#ffffff"],
    });
    
    // Right side gold/rose splash
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
      colors: ["#d4af37", "#f5e29f", "#b76e79", "#ffffff"],
    });
  }, 200);
};

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const activeUser = useAppSelector((state) => state.auth.user);
  const [createReview, { isLoading: isSubmitting }] = useCreateReviewMutation();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [customName, setCustomName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isSuperAdmin = activeUser?.role === "SUPER_ADMIN";

  // Pre-fill name from active profile
  const userName = isSuperAdmin ? (customName || "Lovely Couple") : (activeUser?.name || "Lovely Couple");

  // Clean up thumbnail preview URL
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar size should be less than 2MB!");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Avatar size should be less than 2MB!");
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitName = isSuperAdmin ? customName.trim() : userName;
    if (!submitName) {
      toast.error("Please enter a couple/reviewer name!");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please tell us your thoughts!");
      return;
    }

    // Prepare FormData payload for Multipart upload
    const formData = new FormData();
    formData.append("name", submitName);
    formData.append("rating", rating.toString());
    formData.append("comment", comment.trim());
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await createReview(formData).unwrap();
      if (response.success) {
        triggerConfetti();
        toast.success("Thank you for your beautiful feedback!");
        
        // Reset states
        setRating(5);
        setComment("");
        setCustomName("");
        setAvatarFile(null);
        setAvatarPreview(null);
        
        // Close modal
        onClose();
      }
    } catch (err: any) {
      console.error("Failed to submit review:", err);
      toast.error(err?.data?.message || "Failed to submit review. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 20, stiffness: 120 }}
            className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/25 bg-[#08080b]/95 relative shadow-[0_0_60px_rgba(212,175,55,0.18)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient visual glowing spheres */}
            <div className="absolute -top-24 -right-24 w-52 h-52 rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.14)_0%, transparent_70%) blur-xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-52 h-52 rounded-full bg-radial-gradient(circle, rgba(183,110,121,0.08)_0%, transparent_70%) blur-xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0a0a0d]/90 relative z-10">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#b76e79] animate-pulse fill-[#b76e79]/30" />
                <h3 className="font-heading font-black text-xs uppercase tracking-widest text-gold-gradient">
                  Share Your Story
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 relative z-10">
              
              {/* Dynamic Welcome Capsule / Custom Name Input */}
              {isSuperAdmin ? (
                <div className="space-y-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5 pl-1">
                    Couple / Reviewer Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jessica & David"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    required
                    className="w-full px-5 py-4 bg-[#050507] border border-white/10 hover:border-[#d4af37]/35 rounded-2xl font-medium text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/30 transition-all duration-300"
                  />
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[8px] uppercase tracking-widest text-gray-500 font-bold font-mono">Reviewing As</span>
                    <h4 className="text-xs font-black text-white font-heading uppercase mt-0.5 tracking-wider">
                      {userName}
                    </h4>
                  </div>
                  <span className="text-[8px] uppercase tracking-widest font-black bg-[#d4af37]/10 text-[#d4af37] px-2.5 py-1 rounded border border-[#d4af37]/15">
                    Couple Account
                  </span>
                </div>
              )}

              {/* Star Rating Selectors */}
              <div className="flex flex-col items-center justify-center gap-2 text-center py-2">
                <span className="text-[10px] font-heading font-black uppercase tracking-widest text-[#d4af37]">
                  Your Experience Rating
                </span>
                
                <div className="flex items-center gap-1.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isLit = hoverRating !== null ? star <= hoverRating : star <= rating;
                    return (
                      <motion.button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        whileHover={{ scale: 1.25 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15 }}
                        className="p-1 text-gray-600 hover:text-[#d4af37] transition-colors cursor-pointer"
                      >
                        <Star
                          className={`w-8 h-8 transition-all duration-200 ${
                            isLit
                              ? "text-[#d4af37] fill-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.45)]"
                              : "text-gray-700 fill-transparent"
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Text Area */}
              <div className="space-y-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1.5 pl-1">
                  Couple's Thoughts *
                </label>
                <textarea
                  placeholder="Tell couples how easy it was to find your wedding memories! Did ShareEventPhoto AI save you hours of searching?..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-5 py-4 bg-[#050507]/90 border border-white/5 hover:border-[#d4af37]/35 rounded-2xl font-medium text-xs leading-relaxed text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/70 focus:ring-1 focus:ring-[#d4af37]/30 transition-all duration-300 resize-none"
                />
              </div>

              {/* Avatar Drag-Drop Zone & Preview */}
              <div className="space-y-2">
                <label className="font-heading text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-1.5 pl-1">
                  Upload Couple Avatar (Optional)
                </label>
                
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/10 hover:border-[#d4af37]/40 bg-[#050507]/60 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {avatarPreview ? (
                    <div className="flex items-center gap-4 w-full">
                      <img
                        src={avatarPreview}
                        alt="Avatar Preview"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                      />
                      <div className="text-left">
                        <span className="text-[10px] font-black text-white uppercase truncate max-w-[200px] block">
                          {avatarFile?.name}
                        </span>
                        <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-0.5 block">
                          {(avatarFile!.size / 1024).toFixed(1)} KB • Click to change
                        </span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#d4af37]/10 text-gray-500 group-hover:text-[#d4af37] transition-all">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                          Drag & drop image here
                        </p>
                        <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold mt-1">
                          or click to browse from desktop
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.45)]"
                >
                  Submit Review
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
