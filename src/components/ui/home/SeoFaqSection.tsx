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
} from "lucide-react";

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
      "Guests simply scan a QR code at the venue or open the event link, take or upload one quick selfie, and Eventora's neural 512-D biometric vector engine matches all photos they appear in within 0.18 seconds. Guests can download full-resolution images instantly without sifting through thousands of pictures.",
  },
  {
    id: "services-bundle",
    category: "Event Planning",
    icon: Camera,
    question: "Can I book vendors, stage decorators, and catering together?",
    answer:
      "Yes! Eventora offers curated all-inclusive packages combining royal floral stage decoration, professional 4K cinematography, authentic Shahi Kacchi catering, sound systems, and dedicated coordinators. You can also customize individual vendor services to fit your exact budget.",
  },
  {
    id: "bangladesh-locations",
    category: "Service Areas",
    icon: Sparkles,
    question: "Which areas and cities in Bangladesh does Eventora cover?",
    answer:
      "We provide end-to-end event management, vendor coordination, and AI photo distribution across all 64 districts in Bangladesh, with premier coverage in Dhaka (Gulshan, Banani, Dhanmondi, Uttara, Mirpur, Puran Dhaka), Chittagong, Sylhet, and Cox's Bazar destination weddings.",
  },
  {
    id: "kacchi-catering",
    category: "Food & Catering",
    icon: UtensilsCrossed,
    question: "How does Eventora guarantee catering taste and hygiene?",
    answer:
      "Our catering partners feature master chefs specializing in traditional Shahi Mutton Kacchi, Basmati Biryani, Chicken Roast, Jorda, and Borhani. All food preparation strictly adheres to food safety standards, with customized per-person pricing and live tasting sessions for large celebrations.",
  },
  {
    id: "photo-privacy",
    category: "Security & Privacy",
    icon: ShieldCheck,
    question: "Are guest selfies and event photo pools private and secure?",
    answer:
      "Absolutely. Eventora uses enterprise-grade zero-storage selfie matching. Guest selfies are processed in-memory solely for biometric vector matching and are never sold or stored permanently. Hosts retain full administrative control over gallery visibility, guest download permissions, and photo pool management.",
  },
  {
    id: "storage-plans",
    category: "Host Plans",
    icon: HelpCircle,
    question: "What storage limits are available for event organizers and photographers?",
    answer:
      "Every new account starts with a Free 500 MB cloud vault. Organizers and studios can instantly upgrade to Basic (5.1 GB) or Premium (20.5 GB) storage plans with unlimited guest scans, high-speed ZIP downloads, and dedicated support for large multi-day wedding festivals.",
  },
];

export default function SeoFaqSection() {
  const [openId, setOpenId] = useState<string>("ai-scanner");

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  // Structured Data for Google Rich Snippets (FAQPage Schema)
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
      className="w-full py-16 lg:py-24 bg-[#F8FAFC] border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* FAQ Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ambient background glows */}
      <div className="absolute top-1/2 -left-32 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Heading, SEO Explanatory Intro, Support CTA (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7C3AED] text-[11px] font-bold border border-purple-200 mb-2">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172554] tracking-tight leading-tight">
                Everything You Need to Know About{" "}
                <span className="text-[#7C3AED]">Eventora</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-3 leading-relaxed">
                Got questions about AI photo matching, Bangladeshi wedding
                packages, authentic Kacchi catering, or vendor bookings? Browse
                answers to our most popular questions below.
              </p>
            </div>

            {/* Quick Feature Highlights Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3.5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#172554]">
                Why Eventora is #1 in Bangladesh
              </h3>
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Instant Selfie Search:</strong> 0.18s facial
                    recognition eliminates 5,000-photo manual gallery scrolling.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Curated Local Vendors:</strong> Verified stage
                    decorators, 4K videographers, and authentic caterers.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>Transparent BDT Pricing:</strong> Clear per-person
                    and fixed package costs with zero hidden charges.
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-gradient-to-br from-[#172554] to-[#3B0764] text-white space-y-3">
              <h4 className="text-sm font-extrabold">Have a Special Request?</h4>
              <p className="text-xs text-purple-200 leading-relaxed">
                Our Dhaka-based event coordination concierge is available 24/7 to
                customize your wedding or corporate celebration.
              </p>
              <div className="pt-1 flex items-center gap-3">
                <Link
                  href="/guide"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5B942] hover:bg-[#eab308] text-[#172554] text-xs font-bold transition"
                >
                  <span>Explore Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/about"
                  className="text-xs font-bold text-purple-200 hover:text-white underline underline-offset-4"
                >
                  Contact Concierge
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Accordion FAQs (7 cols) */}
          <div className="lg:col-span-7 space-y-3.5">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              const Icon = faq.icon;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-[#7C3AED]/40 shadow-md ring-2 ring-[#7C3AED]/10"
                      : "bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? "bg-purple-50 text-[#7C3AED]"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          {faq.category}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-[#172554] leading-snug">
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? "bg-purple-100 text-[#7C3AED] rotate-180"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100/80 motion-preset-fade motion-duration-200">
                      <p className="pl-12">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
