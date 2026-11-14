"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  HardDrive,
} from "lucide-react";

interface ComparisonRow {
  feature: string;
  traditional: string;
  eventora: string;
  category: string;
}

const COMPARISONS: ComparisonRow[] = [
  {
    category: "Photo Delivery Speed",
    feature: "Guest Photo Distribution",
    traditional: "3 to 8 weeks waiting for USB pendrives or Google Drive links",
    eventora: "Instant: 0.18s facial recognition search while guests are still at the venue",
  },
  {
    category: "Guest Experience",
    feature: "Finding Individual Pictures",
    traditional: "Guests manually scroll through 5,000+ uncategorized event photos",
    eventora: "Guests take 1 quick selfie & download only their own photos in full resolution",
  },
  {
    category: "Vendor Booking",
    feature: "Stage Decor, Sound & Video",
    traditional: "Negotiating with separate unverified middlemen and informal contractors",
    eventora: "250+ verified, rated vendors bundled in transparent all-inclusive packages",
  },
  {
    category: "Pricing & Trust",
    feature: "Payment Transparency",
    traditional: "Hidden overtime charges, vague per-plate rates, and unexpected markups",
    eventora: "100% transparent BDT prices with per-guest catering & fixed decoration tiers",
  },
  {
    category: "Data Privacy",
    feature: "Photo & Biometric Security",
    traditional: "Public links where strangers can download everyone's private family photos",
    eventora: "Encrypted storage, zero permanent selfie storage, and host-managed permissions",
  },
];

export default function SeoComparisonMatrix() {
  return (
    <section className="w-full py-16 lg:py-24 bg-[#F8FAFC] border-t border-slate-200/80 relative">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200">
            <Zap className="w-3.5 h-3.5 text-[#F5B942]" />
            <span>The Modern Event Standard</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight">
            Traditional Planning vs.{" "}
            <span className="text-[#7C3AED]">Eventora AI Platform</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            See why modern Bangladeshi hosts, couples, and corporate organizers
            choose Eventora over fragmented traditional coordinators.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#172554]">
              0.18s Neural Face Engine
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Proprietary 512-dimensional facial vector embeddings recognize faces
              in low-light receptions, bridal makeup, and candid crowd shots.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#172554]">
              Zero Post-Wedding Stress
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              No more relatives messaging for their photos. Guests scan a venue QR
              code and access high-resolution images instantly.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-[#172554]">
              250+ Verified Vendors
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Strict quality control across decoration, 4K videography, Shahi
              Kacchi catering, and sound equipment with protected booking escrow.
            </p>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold">
                  <th className="py-4 px-6 w-1/4">Key Event Capability</th>
                  <th className="py-4 px-6 w-3/8 text-slate-500">
                    Traditional Coordination
                  </th>
                  <th className="py-4 px-6 w-3/8 bg-purple-50/50 text-[#7C3AED] font-extrabold">
                    Eventora AI Platform ✨
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISONS.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-[#172554]">
                        {row.feature}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {row.category}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-500">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">
                          {row.traditional}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-6 bg-purple-50/30 text-slate-800 font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                        <span className="leading-relaxed font-semibold text-[#172554]">
                          {row.eventora}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action Footer */}
          <div className="p-6 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-extrabold text-[#172554]">
                Ready to elevate your wedding or celebration?
              </div>
              <div className="text-[11px] text-slate-500">
                Join 50,000+ happy guests and 1,200+ completed celebrations in Bangladesh.
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/guest"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition"
              >
                <span>Try Demo Scanner</span>
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-sm shadow-[#7C3AED]/20 transition"
              >
                <span>Start Planning Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
