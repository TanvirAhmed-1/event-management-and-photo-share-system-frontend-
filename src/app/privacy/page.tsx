import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection &amp; AI Biometrics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#172554]">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: November 2026</p>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Eventora respects your privacy and handles all personal data, event galleries, and facial recognition queries with strict security controls.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">1. AI Facial Recognition &amp; Guest Selfies</h2>
            <p>
              When guests upload a selfie on the AI Photo Portal, the facial embedding is computed ephemerally in memory solely to match photos within the authorized event gallery. Guest selfies are never sold, shared with third parties, or stored permanently after matching.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">2. Event &amp; Account Information</h2>
            <p>
              Host contact details, event schedules, and uploaded photographs are encrypted in transit and stored securely within your assigned cloud storage quota.
            </p>
            <h2 className="text-base font-bold text-[#172554] pt-2">3. Contact</h2>
            <p>
              For privacy requests or data deletion, contact <span className="font-semibold text-[#7C3AED]">support@eventora.com.bd</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
