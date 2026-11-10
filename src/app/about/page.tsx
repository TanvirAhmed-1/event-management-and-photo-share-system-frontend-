"use client";

import { Mail, Phone, MapPin, Sparkles, Heart, Users, ShieldCheck, Award } from "lucide-react";
import EventoraLogo from "@/components/shared/EventoraLogo";
import Link from "next/link";

export default function AboutUsPage() {
  const values = [
    {
      title: "One-Stop Marketplace",
      desc: "Connect seamlessly with verified venues, photographers, decorators, and catering masters across Bangladesh.",
      icon: Users,
    },
    {
      title: "AI-Powered Photo Delivery",
      desc: "No more waiting weeks for wedding albums. Guests take a selfie and instantly find all their photos.",
      icon: Sparkles,
    },
    {
      title: "Transparent Pricing",
      desc: "Upfront pricing in BDT (৳), detailed package breakdowns, and secure transaction workflows.",
      icon: ShieldCheck,
    },
    {
      title: "Dedicated Quality",
      desc: "Top customer satisfaction with 24/7 organizer support for every occasion.",
      icon: Award,
    },
  ];

  return (
    <div className="w-full py-12 lg:py-20 bg-[#F8FAFC]">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200 mb-3">
            <Heart className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Our Story & Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#172554] tracking-tight">
            About <span className="text-[#7C3AED]">Eventora</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            Eventora is Bangladesh’s premier event management platform and AI photo-sharing marketplace.
            We empower couples, families, and corporate organizers to plan, book, and celebrate life's most unforgettable moments with ease.
          </p>
        </div>

        {/* 4 Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-[#7C3AED] flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#172554]">{v.title}</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Contact Information */}
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-xl font-bold text-[#172554]">Get in Touch with Our Team</h3>
            <p className="text-xs text-slate-500 mt-1">Have questions or want to become a verified vendor? Contact us today.</p>
            <div className="mt-4 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7C3AED]" />
                <span>support@eventora.com.bd</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7C3AED]" />
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#7C3AED]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          <Link
            href="/register"
            className="px-6 py-3 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-[#7C3AED]/20 whitespace-nowrap"
          >
            Join Eventora Today
          </Link>
        </div>
      </div>
    </div>
  );
}
