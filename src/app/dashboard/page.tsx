"use client";

import { useGetUserDashboardQuery } from "@/redux/features/user/userApi";
import { useGetAllEventsQuery, useCreateEventMutation, useDeleteEventMutation } from "@/redux/features/event/eventApi";
import { useState } from "react";
import { Plus, Camera, Copy, ExternalLink, Calendar, Trash2, HardDrive, LayoutDashboard, Sparkles, Layers, Image as ImageIcon, X, Heart, AlertCircle, Play, QrCode, Download } from "lucide-react";
import toast from "react-hot-toast";
import GlassCard from "@/components/shared/GlassCard";
import Input from "@/components/shared/Input";
import Button from "@/components/ui/Button";
import Link from "next/link";
import Swal from "sweetalert2";
import Container from "@/components/shared/Container";
import { motion, AnimatePresence } from "framer-motion";
import ReviewModal from "./ReviewModal";

export default function Dashboard() {
  const { data: dashboardResponse, isLoading: dashboardLoading, refetch: refetchDashboard } = useGetUserDashboardQuery(undefined);
  const { data: eventsResponse, isLoading: eventsLoading, refetch: refetchEvents } = useGetAllEventsQuery(undefined);
  const [createEvent, { isLoading: createLoading }] = useCreateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [activeShareEvent, setActiveShareEvent] = useState<{ id: string; title: string } | null>(null);
  const [newEventData, setNewEventData] = useState({
    title: "",
    coverImage: "",
  });

  const dashboardData = dashboardResponse?.data || {
    profile: { name: "Organizer" },
    packageInfo: { name: "Free Plan", storageLimitMB: 50 },
    stats: { totalEvents: 0, totalPhotos: 0, storageLimitMB: 50, storageUsedMB: 0, remainingStorageMB: 50 },
  };

  const events = eventsResponse?.data || [];

  const handleCopyLink = (eventId: string) => {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/guest/${eventId}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success("Guest scanner link copied to clipboard!");
    }
  };

  const handleDownloadQrCode = async (eventId: string, eventTitle: string) => {
    try {
      toast.loading("Generating printable QR card...", { id: "qr-toast" });
      const shareUrl = `${window.location.origin}/guest/${eventId}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(shareUrl)}`;

      // Create a canvas element
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1200;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");

      // 1. Draw luxury background
      const gradient = ctx.createLinearGradient(0, 0, 0, 1200);
      gradient.addColorStop(0, "#08080c");
      gradient.addColorStop(0.5, "#0d0d14");
      gradient.addColorStop(1, "#050507");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 1200);

      // 2. Draw golden double borders
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 1140);
      
      ctx.strokeStyle = "rgba(212, 175, 55, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 720, 1120);

      // Decorative corner brackets
      const drawCorners = (x: number, y: number, w: number, h: number, size: number) => {
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 5;
        // Top Left
        ctx.beginPath(); ctx.moveTo(x + size, y); ctx.lineTo(x, y); ctx.lineTo(x, y + size); ctx.stroke();
        // Top Right
        ctx.beginPath(); ctx.moveTo(x + w - size, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + size); ctx.stroke();
        // Bottom Left
        ctx.beginPath(); ctx.moveTo(x, y + h - size); ctx.lineTo(x, y + h); ctx.lineTo(x + size, y + h); ctx.stroke();
        // Bottom Right
        ctx.beginPath(); ctx.moveTo(x + w - size, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - size); ctx.stroke();
      };
      drawCorners(48, 48, 704, 1104, 30);

      // 3. Draw Header Texts
      ctx.fillStyle = "#d4af37";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("SHARE EVENT PHOTOS", 400, 120);

      ctx.fillStyle = "#ffffff";
      ctx.font = "normal 22px sans-serif";
      ctx.fillText("Scan to find your photos automatically!", 400, 160);
      ctx.fillStyle = "#a0a0ab";
      ctx.font = "normal 18px sans-serif";
      ctx.fillText("আপনার সব ছবি খুঁজে পেতে কিউআর কোডটি স্ক্যান করুন!", 400, 195);

      // 4. Load & Draw the QR Code
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const qrImg = new Image();
      qrImg.src = blobUrl;

      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = () => reject(new Error("Failed to load QR code image"));
      });

      // Draw white card background for QR code
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      // Draw rounded rectangle manually for compatibility
      const x = 200, y = 260, w = 400, h = 400, r = 30;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
      ctx.fill();

      // Draw QR code image on top of white card background
      ctx.drawImage(qrImg, 225, 285, 350, 350);
      URL.revokeObjectURL(blobUrl);

      // 5. Draw Event Name Card
      const goldGrad = ctx.createLinearGradient(150, 720, 650, 720);
      goldGrad.addColorStop(0, "#b8860b");
      goldGrad.addColorStop(0.5, "#e6ca65");
      goldGrad.addColorStop(1, "#b8860b");
      ctx.fillStyle = goldGrad;
      ctx.beginPath();
      
      const ex = 100, ey = 720, ew = 600, eh = 90, er = 15;
      ctx.moveTo(ex + er, ey);
      ctx.arcTo(ex + ew, ey, ex + ew, ey + eh, er);
      ctx.arcTo(ex + ew, ey + eh, ex, ey + eh, er);
      ctx.arcTo(ex, ey + eh, ex, ey, er);
      ctx.arcTo(ex, ey, ex + ew, ey, er);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#000000";
      ctx.font = "bold 30px sans-serif";
      ctx.fillText(eventTitle.toUpperCase(), 400, 775);

      // 6. Draw How to Use Instructions
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("INSTRUCTIONS / নিয়মাবলী", 400, 875);

      // Draw underline for instructions
      ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(250, 890); ctx.lineTo(550, 890); ctx.stroke();

      const instructions = [
        "1. Scan this QR Code with your phone camera.",
        "   আপনার ফোনের ক্যামেরা দিয়ে কিউআর কোডটি স্ক্যান করুন।",
        "2. Snap a quick selfie to search your photos.",
        "   খুঁজে পেতে আপনার একটি সুন্দর সেলফি তুলুন।",
        "3. Download all matched high-resolution photos!",
        "   ম্যাচিং হওয়া আপনার সব ছবি একসাথে ডাউনলোড করুন!"
      ];

      ctx.textAlign = "left";
      let yOffset = 940;
      instructions.forEach((line, idx) => {
        if (idx % 2 === 0) {
          ctx.fillStyle = "#d4af37";
          ctx.font = "bold 18px sans-serif";
          ctx.fillText(line, 120, yOffset);
          yOffset += 28;
        } else {
          ctx.fillStyle = "#a0a0ab";
          ctx.font = "normal 16px sans-serif";
          ctx.fillText(line, 140, yOffset);
          yOffset += 35;
        }
      });

      // Footer brand/logo
      ctx.textAlign = "center";
      ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
      ctx.font = "italic 16px sans-serif";
      ctx.fillText("Powered by ShareEventPhoto AI", 400, 1160);

      // 7. Download Canvas as Image
      const cardImageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = cardImageUrl;
      link.download = `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}-printable-qr-card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Printable QR card downloaded successfully!", { id: "qr-toast" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate printable QR card.", { id: "qr-toast" });
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventData.title) {
      toast.error("Event title is required!");
      return;
    }

    try {
      const res = await createEvent({
        title: newEventData.title,
        coverImage: newEventData.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
      }).unwrap();

      if (res.success) {
        toast.success("Wedding event created successfully!");
        setModalOpen(false);
        setNewEventData({ title: "", coverImage: "" });
        refetchDashboard();
        refetchEvents();
      }
    } catch (err: any) {
      console.error("Failed to create event:", err);
      toast.error(err?.data?.message || "Failed to create event pool.");
    }
  };

  const handleDeleteEvent = async (id: string, name: string) => {
    const confirmResult = await Swal.fire({
      title: "Delete Wedding Event?",
      text: `Are you sure you want to permanently delete "${name}"? All uploaded guest images and neural embedding maps will be destroyed. This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b76e79",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Yes, delete it!",
      background: "#131315",
      color: "#f4f4f7",
    });

    if (confirmResult.isConfirmed) {
      try {
        const res = await deleteEvent(id).unwrap();
        toast.success(res?.message || "Event deleted successfully!");
        refetchDashboard();
        refetchEvents();
      } catch (err: any) {
        console.error("Failed to delete event:", err);
        toast.error(err?.data?.message || "Failed to delete event.");
      }
    }
  };

  const stats = dashboardData.stats;
  const storageLimit = stats.storageLimitMB;
  const storageUsed = stats.storageUsedMB;
  // Calculate percentage used
  const storagePercentage = storageLimit > 0 ? Math.min(100, (storageUsed / storageLimit) * 100) : 0;

  const getExpirationText = () => {
    if (!dashboardData.packageInfo?.packageExpiredAt) return null;
    const expDate = new Date(dashboardData.packageInfo.packageExpiredAt);
    const diffTime = expDate.getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || dashboardData.packageInfo.isExpired) {
      return "Expired";
    }
    if (diffDays === 0 || diffTime < 1000 * 60 * 60 * 24) {
      const hours = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60)));
      return `${hours} hours remaining`;
    }
    return `${diffDays} days remaining`;
  };

  return (
    <Container className="py-10 flex flex-col gap-10">

      {/* Account Inactive Warning Banner */}
      {!dashboardData.profile.isActive && (
        <div className="bg-amber-950/60 border-2 border-amber-500/50 rounded-[2.5rem] p-8 sm:p-10 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          {/* Neon Glow decorative background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-600/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
          </div>
          <div className="text-center md:text-left space-y-2 flex-grow">
            <h3 className="font-heading font-black text-lg sm:text-2xl uppercase text-white tracking-wider flex items-center justify-center md:justify-start gap-2">
              🚨 Event Pool Status: Inactive
            </h3>
            <p className="text-sm sm:text-lg text-gray-200 font-medium leading-relaxed">
              Please activate your plan and contact admin. Phone:{" "}
              <span className="font-extrabold text-[#d4af37] text-lg sm:text-2xl bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.15)] inline-block mt-1 sm:mt-0 font-mono">
                01786924911
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Subscription Expired Warning Banner */}
      {dashboardData.packageInfo?.isExpired && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0">
              <X className="w-6 h-6 animate-pulse" />
            </div>
            <div className="text-left">
              <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
                Subscription Plan Expired
              </h3>
              <p className="text-[11px] text-gray-400 mt-1 leading-relaxed max-w-xl">
                Your subscription package has expired. To resume creating events, uploading images, and utilizing the high-performance AI face finder, please upgrade or renew your plan.
              </p>
            </div>
          </div>
          <Link href="/register" className="shrink-0 relative z-10">
            <Button className="bg-red-500 hover:bg-red-600 text-white border-none text-[10px] font-black tracking-wider uppercase px-6 py-3">
              Upgrade Subscription
            </Button>
          </Link>
        </div>
      )}

      {/* Header & Greetings */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
            Event Pool Dashboard
          </span>
          <div className="flex flex-wrap items-center gap-4 mt-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
              Welcome, <span className="text-gold-gradient">{dashboardData.profile.name}</span>
            </h1>
            
            {/* Event Status right side of greeting */}
            <div className="flex items-center gap-2 bg-[#0c0c10]/40 border border-white/5 px-3 py-1.5 rounded-2xl shadow-inner shrink-0">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Event Status:</span>
              {dashboardData.profile.isActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[9px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.15)] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[9px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                  Inactive
                </span>
              )}
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Manage your wedding photo finder catalogs and guest accesses</p>
        </div>

        <Button 
          onClick={() => {
            if (!dashboardData.profile.isActive) {
              toast.error("Please activate your plan and contact admin. Phone: 01786924911", { duration: 5000 });
            } else {
              setModalOpen(true);
            }
          }} 
          className={`md:self-center shrink-0 ${!dashboardData.profile.isActive ? "opacity-50 cursor-not-allowed hover:bg-amber-950/20" : ""}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Review CTA Banner */}
      <GlassCard 
        className="border border-[#d4af37]/15 bg-gold-dark-gradient/5 p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6" 
        hoverEffect={true}
      >
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] shrink-0">
            <Heart className="w-6 h-6 animate-pulse fill-[#d4af37]/20" />
          </div>
          <div className="text-left">
            <h3 className="font-heading font-black text-sm uppercase text-white tracking-wide">
              Loving ShareEventPhoto AI?
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed max-w-lg">
              Share your magical wedding memory retrieval experience with other newlywed couples! Your thoughts help make our AI scanner even better.
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setReviewModalOpen(true)} 
          variant="secondary" 
          className="shrink-0 font-heading text-[10px] uppercase tracking-wider font-bold border border-[#d4af37]/30 hover:bg-[#d4af37]/10"
        >
          <Sparkles className="w-4 h-4 mr-2 text-[#d4af37]" />
          Write a Review
        </Button>
      </GlassCard>

      {/* Storage Progress Panel & Overview Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Storage Limit Box */}
        <GlassCard className="lg:col-span-2 border border-[#d4af37]/10 flex flex-col justify-between" hoverEffect={false}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#d4af37]" />
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">Database Pool Storage</h3>
            </div>
            <span className="text-[10px] font-black uppercase bg-[#d4af37]/10 text-[#d4af37] px-3 py-1 rounded-full border border-[#d4af37]/15">
              {dashboardData.packageInfo?.name || "SaaS Plan"}
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline justify-between text-xs font-medium">
              <span className="text-gray-400">Used Storage Limit</span>
              <span className="text-white font-bold">
                {storageUsed >= 1000 ? `${(storageUsed / 1000).toFixed(2)} GB` : `${storageUsed.toFixed(1)} MB`}{" "}
                <span className="text-gray-600 font-normal">/</span>{" "}
                {storageLimit >= 1000 ? `${(storageLimit / 1000).toFixed(0)} GB` : `${storageLimit} MB`}
              </span>
            </div>

            {/* Glowing Progress Bar */}
            <div className="w-full h-3 rounded-full bg-[#0a0a0d] border border-white/5 overflow-hidden p-[2px]">
              <div
                className="h-full rounded-full bg-gold-gradient transition-all duration-500 glow-gold"
                style={{ width: `${storagePercentage}%` }}
              ></div>
            </div>

            {dashboardData.packageInfo?.packageExpiredAt && (
              <div className="flex items-center justify-between text-[10px] border-t border-white/5 pt-2">
                <span className="text-gray-400">Validity Period</span>
                <span className={`font-bold ${dashboardData.packageInfo.isExpired ? "text-red-400 animate-pulse" : "text-[#d4af37]"}`}>
                  Expires: {new Date(dashboardData.packageInfo.packageExpiredAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })} ({getExpirationText()})
                </span>
              </div>
            )}

            <p className="text-[10px] text-gray-500 leading-normal">
              Storage allocation depends on your package. Uploading images automatically computes AI embeddings maps that consume storage.
            </p>
          </div>
        </GlassCard>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
            <Layers className="w-5 h-5 text-[#d4af37] mb-2" />
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{stats.totalEvents}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Wedding Pools</span>
          </GlassCard>

          <GlassCard className="flex flex-col items-center justify-center p-6 text-center border border-white/5" hoverEffect={true}>
            <ImageIcon className="w-5 h-5 text-rose-400 mb-2" />
            <span className="text-2xl sm:text-3xl font-extrabold font-heading text-white">{stats.totalPhotos}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mt-1">Total Photos</span>
          </GlassCard>
        </div>
      </div>

      {/* Video Tutorial Walkthrough Section */}
      <GlassCard className="border border-white/5 bg-[#0a0a0e]/50 p-6 sm:p-8 rounded-2xl relative overflow-hidden" hoverEffect={true}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Descriptions */}
          <div className="lg:col-span-5 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dark-gradient border border-[#d4af37]/25 text-[#d4af37] text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" /> Walkthrough Guide
            </span>
            
            <h3 className="text-xl sm:text-2xl font-black font-heading text-white">
              Platform Tutorial <span className="text-[#d4af37]">/ ভিডিও টিউটোরিয়াল</span>
            </h3>
            
            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              Watch this video to learn how to create events, upload professional photo pools, and share the AI face-matcher link with guests.
              <span className="block mt-1 text-[#d4af37]/90">ভিডিওটি দেখে জেনে নিন কীভাবে ইভেন্ট তৈরি করবেন, ছবি আপলোড করবেন এবং অতিথিদের সাথে লিংক শেয়ার করবেন।</span>
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0 mt-0.5 font-mono">1</div>
                <div className="text-xs text-gray-300">
                  <strong className="text-white">Create Event:</strong> Enter title & cover image.
                  <span className="block text-[11px] text-gray-500 font-semibold">ইভেন্ট তৈরি করুন: নাম ও কভার ছবি দিয়ে শুরু করুন।</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0 mt-0.5 font-mono">2</div>
                <div className="text-xs text-gray-300">
                  <strong className="text-white">Upload Photos:</strong> Drag professional photo files.
                  <span className="block text-[11px] text-gray-500 font-semibold">ছবি আপলোড করুন: ফটোগ্রাফারের তোলা সব ছবি ড্র্যাগ অ্যান্ড ড্রপ করুন।</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] text-xs font-bold shrink-0 mt-0.5 font-mono">3</div>
                <div className="text-xs text-gray-300">
                  <strong className="text-white">AI Face Match & Share:</strong> Guests scan QR & download.
                  <span className="block text-[11px] text-gray-500 font-semibold">লিংক শেয়ার ও এআই ম্যাচিং: অতিথিরা কিউআর স্ক্যান করে ছবি পেয়ে যাবেন।</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Autoplaying Video Preview */}
          <div className="lg:col-span-7">
            <div 
              onClick={() => setIsVideoOpen(true)}
              className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-lg group cursor-pointer"
            >
              <video
                className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-[1.02] transition-transform duration-500"
                autoPlay
                muted
                loop
                playsInline
              >
                <source src="/demo1.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 rounded-full bg-gold-dark-gradient border border-[#d4af37]/50 flex items-center justify-center text-white shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-110 transition-transform duration-300"
                >
                  <Play className="w-6 h-6 fill-white ml-1 text-white" />
                </motion.div>
              </div>
              <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur px-2.5 py-1 rounded text-[8px] font-mono text-gray-400 uppercase tracking-widest">
                Walkthrough Video
              </span>
            </div>
          </div>

        </div>
      </GlassCard>

      {/* Events List Catalog */}
      <div className="flex-grow flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#d4af37]" /> Active Wedding Events
        </h2>

        {eventsLoading ? (
          <div className="flex justify-center items-center py-20 flex-grow">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
          </div>
        ) : events.length === 0 ? (
          <GlassCard className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-white/10" hoverEffect={false}>
            <Camera className="w-12 h-12 text-gray-600 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold font-heading text-white mb-1">No Event Pools Initialized</h3>
            <p className="text-xs text-gray-400 max-w-sm mb-6 leading-relaxed">
              Create your very first luxurious event to start uploading photographer pools and enabling guests scanning.
            </p>
            <Button onClick={() => setModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" /> Create Event Pool
            </Button>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event: any) => (
              <div
                key={event.id}
                className="group flex flex-col justify-between rounded-2xl bg-[#0c0c10]/60 border border-white/5 hover:border-[#d4af37]/20 transition-all duration-300 overflow-hidden"
              >
                {/* Cover Image Container */}
                <div className="relative aspect-[16/10] w-full bg-[#131316] overflow-hidden border-b border-white/5">
                  <img
                    src={event.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent opacity-85"></div>

                  {/* Photo count pill */}
                  <span className="absolute top-4 right-4 text-[9px] font-black uppercase bg-black/75 backdrop-blur px-2.5 py-1 rounded-full text-white border border-white/10 flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#d4af37]" />
                    {event._count?.photos ?? 0} photos
                  </span>
                </div>

                {/* Event Information */}
                <div className="p-6 flex-grow flex flex-col justify-between gap-6">
                  <div>
                    <h3 className="text-base font-bold font-heading text-white truncate">{event.title}</h3>
                    <p className="text-[10px] text-gray-500 mt-1 font-semibold flex items-center gap-1">
                      Created: {new Date(event.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <Link href={`/dashboard/events/${event.id}`} className="w-full">
                        <Button variant="secondary" size="sm" className="w-full font-heading">
                          Manage Catalog
                        </Button>
                      </Link>

                      <button
                        onClick={() => {
                          setActiveShareEvent({ id: event.id, title: event.title });
                          setShareModalOpen(true);
                        }}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] rounded-full border border-white/5 hover:border-[#d4af37]/30 text-gray-400 hover:text-white bg-white/5 hover:bg-[#d4af37]/5 transition-all font-semibold uppercase tracking-wider hover:scale-[1.02] cursor-pointer"
                        title="Share Event & Download QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        Share & QR
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <Link
                        href={`/guest/${event.id}`}
                        target="_blank"
                        className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1 hover:underline uppercase tracking-wider"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open Scanner
                      </Link>

                      <button
                        onClick={() => handleDeleteEvent(event.id, event.title)}
                        className="text-gray-600 hover:text-red-400 p-1.5 rounded transition-all hover:scale-105 cursor-pointer"
                        title="Delete Pool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="w-full max-w-lg glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/30 bg-[#08080b]/95 relative shadow-[0_0_50px_rgba(212,175,55,0.15)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Luxury Ambient Accent */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.15)_0%, transparent_70%) blur-xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between p-7 border-b border-white/5 bg-[#0a0a0d]/90 relative z-10">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#d4af37] animate-pulse" />
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest text-gold-gradient">
                    Create Event Pool
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateEvent} className="p-7 space-y-6 relative z-10">
                
                {/* Event Title */}
                <div className="space-y-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]/75" /> Wedding Event Title *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Liam & Sophia's Royal Nuptials"
                      value={newEventData.title}
                      onChange={(e) => setNewEventData({ ...newEventData, title: e.target.value })}
                      className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 pl-12"
                      required
                    />
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>

                {/* Cover Image URL */}
                <div className="space-y-2">
                  <label className="font-heading text-[10px] uppercase tracking-widest text-[#d4af37] font-bold flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#d4af37]/75" /> Cover Image URL (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or blank"
                      value={newEventData.coverImage}
                      onChange={(e) => setNewEventData({ ...newEventData, coverImage: e.target.value })}
                      className="w-full px-5 py-4 bg-[#050507] border border-white/5 hover:border-[#d4af37]/30 rounded-2xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/65 focus:ring-1 focus:ring-[#d4af37]/35 transition-all duration-300 pl-12"
                    />
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1 pl-1 leading-normal">
                    Provide a landscape photo URL from Unsplash or Pinterest to display as the cover banner. Left blank, an elegant fallback illustration is automatically assigned.
                  </p>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-6 border-t border-white/5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setModalOpen(false)}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    isLoading={createLoading}
                    className="w-full py-4 text-xs font-bold uppercase tracking-wider rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:shadow-[0_0_25px_rgba(212,175,55,0.45)]"
                  >
                    Create Event
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ReviewModal isOpen={reviewModalOpen} onClose={() => setReviewModalOpen(false)} />

      {/* Video Modal Player Popup */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 sm:p-6 md:p-10"
            onClick={() => setIsVideoOpen(false)}
          >
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
                onClick={() => setIsVideoOpen(false)}
              >
                <X className="w-5 h-5" />
              </button>

              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
                loop
              >
                <source src="/demo1.mp4" type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share & QR Code Modal */}
      <AnimatePresence>
        {shareModalOpen && activeShareEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => {
              setShareModalOpen(false);
              setActiveShareEvent(null);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 20, stiffness: 120 }}
              className="w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-[#d4af37]/35 bg-[#08080b]/95 relative shadow-[0_0_50px_rgba(212,175,55,0.15)] p-6 space-y-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#d4af37]" />
                  <h3 className="font-heading font-black text-sm uppercase tracking-widest text-gold-gradient">
                    Printable QR Invitation Card
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setShareModalOpen(false);
                    setActiveShareEvent(null);
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Printable Card Preview Mockup */}
              <div className="relative border border-[#d4af37]/40 rounded-2xl bg-[#050507] p-5 space-y-4 text-center overflow-hidden shadow-inner">
                {/* Decorative golden corner details */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#d4af37]/50"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-[#d4af37]/50"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-[#d4af37]/50"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#d4af37]/50"></div>

                {/* Card Title */}
                <div className="space-y-0.5">
                  <h4 className="text-[10px] font-black uppercase text-[#d4af37] tracking-widest">Share Event Photos</h4>
                  <p className="text-[8px] text-gray-400">Scan to find your photos automatically! / ছবিগুলো পেতে স্ক্যান করুন!</p>
                </div>

                {/* QR Code Wrapper */}
                <div className="bg-white p-3 rounded-xl w-36 h-36 mx-auto flex items-center justify-center shadow-lg border-2 border-[#d4af37]/20">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                      `${typeof window !== "undefined" ? window.location.origin : ""}/guest/${activeShareEvent.id}`
                    )}`}
                    alt="Event QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Event Name Gold Badge */}
                <div className="py-1 px-4 bg-gold-gradient text-black rounded-lg inline-block max-w-full font-heading font-black text-xs uppercase tracking-wider shadow">
                  {activeShareEvent.title}
                </div>

                {/* Instructions */}
                <div className="text-[8px] text-gray-400 space-y-1 pt-1.5 border-t border-white/5 text-left max-w-xs mx-auto">
                  <p className="font-bold text-[#d4af37] uppercase tracking-wide">INSTRUCTIONS / নিয়মাবলী:</p>
                  <p>1. Scan QR code using phone camera / কোডটি স্ক্যান করুন।</p>
                  <p>2. Upload your clear selfie / একটি সুন্দর সেলফি আপলোড করুন।</p>
                  <p>3. Download matching photos instantly / আপনার সব ছবি ডাউনলোড করুন!</p>
                </div>
              </div>

              {/* Share URL Input */}
              <div className="space-y-2">
                <label className="block text-left text-[9px] font-black uppercase text-[#d4af37] tracking-widest">
                  Guest Invitation Link
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${typeof window !== "undefined" ? window.location.origin : ""}/guest/${activeShareEvent.id}`}
                    className="w-full px-4 py-2.5 bg-[#050507] border border-white/5 rounded-xl text-xs text-gray-300 font-mono focus:outline-none select-all"
                  />
                  <button
                    onClick={() => {
                      handleCopyLink(activeShareEvent.id);
                    }}
                    className="px-4 rounded-xl bg-[#d4af37] text-black font-semibold text-xs hover:bg-white transition-all uppercase tracking-wider shrink-0 cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-3">
                <Button
                  onClick={() => handleDownloadQrCode(activeShareEvent.id, activeShareEvent.title)}
                  className="w-full py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4 animate-bounce" /> Download Printable Flyer (PNG)
                </Button>
                <p className="text-[9px] text-gray-500 leading-normal text-center">
                  This generates a high-resolution printable table tent card containing the QR code, event title, and guest scan steps.
                </p>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
}
