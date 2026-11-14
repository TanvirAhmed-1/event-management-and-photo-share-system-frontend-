import React from "react";
import Link from "next/link";
import { Cookie, ArrowLeft } from "lucide-react";

export default function CookiePolicyPage() {
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
            <Cookie className="w-3.5 h-3.5" />
            <span>Session &amp; Preferences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172554]">Cookie Policy</h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Eventora uses essential cookies and local storage tokens solely to keep you securely signed in and preserve your event workspace preferences.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">1. Essential Authentication Cookies</h2>
            <p>
              HTTP-only and session tokens are used to verify your identity across the Host Dashboard, Admin Suite, and API requests.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
