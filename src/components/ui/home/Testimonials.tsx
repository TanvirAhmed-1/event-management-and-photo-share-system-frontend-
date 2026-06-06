"use client";
import React from "react";
import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "Finding our wedding photos among 3,000+ photographer uploads was instant for our guests! The face scanner worked like magic, and everyone got their beautiful photos within seconds.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Briana Patton",
    role: "Happy Bride",
  },
  {
    text: "As a wedding photographer, this SaaS has completely revolutionized how I deliver photos. My clients love the speed, and it saves me days of sorting and emailing links.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Bilal Ahmed",
    role: "Lead Photographer",
  },
  {
    text: "The support team is exceptional, helping me set up the QR codes for the tables. Guests were amazed at how fast they could scan and find their pictures.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Saman Malik",
    role: "Wedding Planner",
  },
  {
    text: "This AI tool is a game-changer! I uploaded a single selfie and instantly downloaded all 42 high-resolution photos of me and my wife from my best friend's wedding.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Omar Raza",
    role: "Wedding Guest",
  },
  {
    text: "I was worried about privacy, but the secure face-matching pipeline and encrypted downloads made us feel extremely safe. Excellent design!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    name: "Zainab Hussain",
    role: "Happy Bride",
  },
  {
    text: "Absolutely smooth implementation. Setup took less than 10 minutes, and the interface is incredibly premium and clean. Highly recommended for any event organizer.",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    name: "Farhan Siddiqui",
    role: "Event Coordinator",
  },
  {
    text: "Our guests couldn't stop talking about how cool the AI matching was. No more hunting through huge Google Drive or Dropbox links!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    name: "Aliza Khan",
    role: "Bride",
  },
  {
    text: "The ZIP-stream download feature worked flawlessly. Guests downloaded all their matched photos in high-res in one click. Outstanding value.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    name: "Hassan Ali",
    role: "Groom",
  },
  {
    text: "This platform has elevated our premium wedding package tier. Giving couples a QR code for instant guest photo retrieval is now our signature feature.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80",
    name: "Sana Sheikh",
    role: "Wedding Agency CEO",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="bg-background my-20 relative overflow-hidden">
      <div className="container z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] border border-[#d4af37]/20 px-3 py-1 rounded-full bg-[#d4af37]/5">
              Client Stories
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
            Love From <span className="text-gold-gradient font-black">Wedding Couples</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
            Read how ShareEventPhoto AI brought smiles to couples and wedding guests by finding their memories instantly.
          </p>
        </motion.div>

        {/* Scrolling columns layout */}
        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[660px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={25} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={30} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={27} />
        </div>
      </div>
    </section>
  );
}
