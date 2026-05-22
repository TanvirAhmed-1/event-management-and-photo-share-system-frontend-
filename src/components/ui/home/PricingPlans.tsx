"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Button from "@/components/ui/Button";

interface PricingPlansProps {
  packages: any[];
  packagesLoading: boolean;
  onSelectPackage: (pkgId: string) => void;
}

export default function PricingPlans({ packages, packagesLoading, onSelectPackage }: PricingPlansProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the AI Photo Finder work?",
      a: "Our system uses advanced neural embeddings to analyze uploaded wedding photos and extract face vectors. When a guest uploads a selfie on the public scanner page, our Flask AI service compares it against the event's photo embeddings to instantly fetch all matching pictures in seconds.",
    },
    {
      q: "Is guest selfie data secure?",
      a: "Absolutely. We do not store guest selfies. They are processed in-memory to generate face embeddings for the comparison matching and instantly discarded. All photo assets are highly encrypted and secured in PostgreSQL and cloud nodes.",
    },
    {
      q: "Can I download all my matched photos at once?",
      a: "Yes! Event organizers can download all uploaded images as a single zipped archive. Guests can download individual matched photos directly from the guest selfie matching page.",
    },
    {
      q: "What happens if I exceed my storage limit?",
      a: "Each package offers a generous storage size. If you exceed your limit, you can easily upgrade to a higher tier package from your user dashboard at any time to instantly unlock more storage space.",
    },
  ];

  return (
    <div className="flex flex-col gap-24 w-full z-10 relative">
      
      {/* Pricing Matrix */}
      <section id="pricing" className="flex flex-col gap-12 w-full">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
            SaaS Packages
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white mt-1 mb-4">
            Premium <span className="text-gold-gradient font-black">Subscription Tiers</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Choose the database size package that perfectly matches your celebration scale.
          </p>
        </div>

        {packagesLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37]/20 border-t-[#d4af37] animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto w-full">
            {packages.map((pkg: any, idx: number) => {
              const isPopular = pkg.name.toLowerCase().includes("gold") || idx === 1;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                    isPopular
                      ? "bg-gold-dark-gradient/30 border-2 border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.15)] scale-[1.03]"
                      : "bg-[#0c0c10]/60 border border-white/5 hover:border-white/10"
                  }`}
                >
                  {isPopular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold-gradient text-black font-heading font-black text-[9px] uppercase tracking-widest px-4.5 py-1 rounded-full shadow-lg z-10">
                      Best Value Tier
                    </span>
                  )}

                  <div>
                    <h3 className="text-base font-heading font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="flex items-baseline gap-1.5 mb-6">
                      <span className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
                        ${pkg.price}
                      </span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">/ wedding pool</span>
                    </div>

                    <div className="text-[10px] font-semibold text-[#d4af37] uppercase tracking-wider mb-6">
                      Allocation: {pkg.storageLimitMB >= 1000 ? `${(pkg.storageLimitMB / 1000).toFixed(0)} GB` : `${pkg.storageLimitMB} MB`} Secure Storage
                    </div>

                    <ul className="space-y-4 mb-8 text-[11px] text-gray-400 font-medium border-t border-white/5 pt-4">
                      {(pkg.description || Array.isArray(pkg.description) ? pkg.description : []).map((feature: string, fIdx: number) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {(!pkg.description || pkg.description.length === 0) && (
                        <>
                          <li className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>Instant facial vector matching</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>Guest Face Scanner link access</span>
                          </li>
                          <li className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                            <span>100% encrypted image storage</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <Button
                    onClick={() => onSelectPackage(pkg.id)}
                    variant={isPopular ? "primary" : "secondary"}
                    className="w-full mt-auto font-heading uppercase text-[10px] tracking-wider font-bold"
                  >
                    Select Plan
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ Block */}
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-12 pt-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
            FAQ Overview
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white mt-1 mb-4">
            Common <span className="text-rose-gradient font-black">Questions</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Everything you need to know about our luxury AI photo system.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-white/5 bg-[#0b0b0f]/60 overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                >
                  <span className="font-heading font-semibold text-sm sm:text-base text-white pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4.5 h-4.5 text-[#d4af37] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
