"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  ScanFace,
  UtensilsCrossed,
  Camera,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Container from "@/components/shared/Container";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const FAQS: FAQItem[] = [
  {
    id: "ai-scanner",
    category: "AI Photo Finder",
    icon: ScanFace,
    question: "How does the AI face photo finder work for wedding guests?",
    answer:
      "Guests simply scan a QR code at the venue or open the event link, take or upload one quick selfie, and Eventora's neural 512-D biometric vector engine matches all photos they appear in within 0.18 seconds.",
  },
  {
    id: "services-bundle",
    category: "Event Planning",
    icon: Camera,
    question: "Can I book vendors, stage decorators, and catering together?",
    answer:
      "Yes! Eventora offers curated all-inclusive packages combining floral stage decoration, 4K cinematography, authentic Shahi Kacchi catering, sound systems, and dedicated coordinators.",
  },
  {
    id: "bangladesh-locations",
    category: "Service Areas",
    icon: Sparkles,
    question: "Which areas and cities in Bangladesh does Eventora cover?",
    answer:
      "We provide end-to-end event management, vendor coordination, and AI photo distribution across all 64 districts in Bangladesh, including Dhaka, Chittagong, Sylhet, Rajshahi, and Cox's Bazar.",
  },
  {
    id: "kacchi-catering",
    category: "Food & Catering",
    icon: UtensilsCrossed,
    question: "How does Eventora guarantee catering taste and hygiene?",
    answer:
      "Our catering partners feature master chefs specializing in traditional Shahi Mutton Kacchi, Basmati Biryani, Chicken Roast, and Borhani with customized per-person pricing and strict food safety.",
  },
  {
    id: "photo-privacy",
    category: "Security & Privacy",
    icon: ShieldCheck,
    question: "Are guest selfies and event photo pools private and secure?",
    answer:
      "Absolutely. Eventora uses zero-storage selfie matching—guest selfies are processed transiently in memory for matching and are never stored permanently.",
  },
  {
    id: "storage-plans",
    category: "Host Plans",
    icon: HelpCircle,
    question: "What storage limits are available for organizers and photographers?",
    answer:
      "Every new account starts with a Free 500 MB cloud vault. Organizers and studios can upgrade to Basic (5.1 GB) or Premium (20.5 GB) plans with unlimited guest scans and high-speed ZIP downloads.",
  },
];

export default function SeoFaqSection() {
  const [openId, setOpenId] = useState<string>("ai-scanner");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section
      id="faq"
      className="relative w-full py-6 lg:py-8 bg-[#FAF8FF] border-t border-purple-100 overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="absolute -top-24 -left-24 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-stretch">
          {/* Left Column: Compact Royal-Violet FAQ Highlight Card (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#1B1145] via-[#341A7C] to-[#6D28D9] text-white p-5 flex flex-col justify-between shadow-lg shadow-purple-950/15 relative overflow-hidden">
            <div className="absolute -bottom-14 -right-14 w-48 h-48 rounded-full bg-fuchsia-400/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/12 border border-white/20 text-purple-100 text-[10px] font-bold">
                <HelpCircle className="w-3 h-3 text-[#F5B942]" />
                <span>Have Questions?</span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-snug">
                  Find Answers in{" "}
                  <span className="text-[#F5B942]">Our FAQ</span>
                </h2>
                <p className="text-xs text-purple-100/85 mt-1 leading-relaxed">
                  Quick answers about AI selfie matching, event packages, catering &amp; gallery security.
                </p>
              </div>

              <ul className="space-y-1.5 text-[11px] text-purple-100">
                {[
                  "0.18s AI facial recognition photo delivery",
                  "Verified photographers, caterers & venues",
                ].map((pt) => (
                  <li key={pt} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F5B942] shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 pt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/guide"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white text-[#1B1145] hover:bg-purple-50 text-xs font-extrabold shadow-md transition hover:scale-[1.02]"
              >
                <span>View Full Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition"
              >
                <span>Read Blog</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Compact Interactive Accordion FAQs (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-extrabold text-[#172554]">
                Frequently Asked Questions
              </h3>
              <Link
                href="/guide"
                className="text-xs font-bold text-[#7C3AED] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="space-y-1.5">
              {FAQS.slice(0, 4).map((faq) => {
                const isOpen = openId === faq.id;
                const Icon = faq.icon;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden bg-white ${
                      isOpen
                        ? "border-[#7C3AED]/50 shadow-sm ring-1 ring-[#7C3AED]/10"
                        : "border-purple-100/90 hover:border-purple-200 shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      className="w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? "bg-[#7C3AED] text-white"
                              : "bg-purple-50 text-[#7C3AED]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#172554] leading-snug truncate">
                          {faq.question}
                        </h4>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "bg-purple-100 text-[#7C3AED] rotate-180"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3 pt-1.5 text-[11px] sm:text-xs text-slate-600 leading-relaxed border-t border-slate-100 motion-preset-fade motion-duration-150">
                        <p className="pl-9">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
