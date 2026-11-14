import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="w-full py-12 lg:py-20 bg-[#F8FAFC] min-h-[75vh]">
      <div className="mx-auto max-w-[880px] px-4 sm:px-6 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-xs font-bold border border-purple-200">
            <FileText className="w-3.5 h-3.5" />
            <span>Platform Guidelines</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172554]">Terms of Service</h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              By accessing or using Eventora, you agree to comply with these terms governing event bookings, vendor services, and AI photo sharing.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">1. Event Workspaces &amp; Bookings</h2>
            <p>
              Organizers are responsible for accurate guest counts, event dates, and venue information when configuring dynamic event workspaces and catering orders.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">2. Cloud Storage &amp; AI Processing</h2>
            <p>
              Each account operates within its selected storage plan quota (Free, Basic, or Premium). Uploaded media must comply with applicable copyright and privacy laws.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
