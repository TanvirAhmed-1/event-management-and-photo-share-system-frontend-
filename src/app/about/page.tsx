"use client";

import Container from "@/components/shared/Container";
import GlassCard from "@/components/shared/GlassCard";
import { Mail, Phone, MapPin, Cpu, Heart, Layers, Users, Sparkles, Code2, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function AboutUsPage() {
  const skills = [
    "Next.js",
    "React.js",
    "Redux Toolkit",
    "TypeScript",
    "Node.js",
    "Express.js",
    "Prisma ORM",
    "PostgreSQL",
    "MongoDB",
    "Tailwind CSS",
    "RESTful APIs",
    "Face Recognition AI"
  ];

  return (
    <Container className="py-16 md:py-24 flex flex-col gap-16 animate-in fade-in duration-500 relative z-10">
      {/* Dynamic Glow Accents */}
      <div className="absolute top-[-10%] left-[20%] w-[400px] h-[400px] bg-radial-gradient(circle, rgba(212,175,55,0.04)_0%, transparent_70%) blur-3xl pointer-events-none z-0"></div>

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37] flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Empowering Celebrations
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
          About <span className="text-rose-gradient font-black">ShareEventPhoto AI</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          We leverage cutting-edge artificial intelligence to revolutionize how hosts and guests cherish wedding memories. ShareEventPhoto AI instantly matches faces to organize hundreds of guest captures seamlessly.
        </p>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Developer Spotlight Card */}
        <div className="lg:col-span-7 space-y-6">
          <GlassCard className="p-8 sm:p-10 border border-white/5 bg-[#0c0c10]/40 space-y-6 relative overflow-hidden" hoverEffect={true}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[#d4af37] text-[10px] font-black uppercase tracking-wider">
                <Code2 className="w-3 h-3" /> Developer Spotlight
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
                Hi, I’m <span className="text-gold-gradient font-black">Tanvir Ahmed</span>
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-rose-400 tracking-wider uppercase font-mono">
                Founder & Full Stack Web Developer
              </p>
            </div>

            <blockquote className="text-xs sm:text-sm text-gray-300 leading-relaxed border-l-2 border-[#d4af37]/40 pl-4 py-1 italic font-medium">
              "I’m Tanvir Ahmed, a passionate Web Developer dedicated to crafting responsive and scalable web applications. I love solving real-world problems with clean, efficient code using modern technologies."
            </blockquote>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Professional Skill Stack</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-400 text-[10px] font-semibold transition-all hover:border-[#d4af37]/30 hover:text-white"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Address & Creator Connection */}
        <div className="lg:col-span-5 space-y-6">
          <GlassCard className="p-8 border border-white/5 bg-[#0c0c10]/40 space-y-6" hoverEffect={false}>
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#d4af37]" /> Contact & Creator Info
            </h3>

            <div className="space-y-4">
              {/* Email Row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Official Email</span>
                  <a href="mailto:tanvir.79.ahmed@gmail.com" className="text-xs text-white hover:text-[#d4af37] font-semibold transition-all">
                    tanvir.79.ahmed@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone Row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Telephone</span>
                  <a href="tel:+8801786924911" className="text-xs text-white hover:text-[#d4af37] font-semibold transition-all font-mono">
                    +8801786924911
                  </a>
                </div>
              </div>

              {/* Location Address Row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Headquarters / Location</span>
                  <span className="text-xs text-white font-semibold">
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>

              {/* Portfolio Link Row */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/5 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Personal Portfolio</span>
                  <Link href="https://tanvirahmed1.netlify.app/" target="_blank" className="text-xs text-[#d4af37] hover:underline font-semibold transition-all">
                    tanvirahmed1.netlify.app
                  </Link>
                </div>
              </div>
            </div>

            {/* Social handles */}
            <div className="flex gap-3 pt-2 border-t border-white/5">
              <Link
                href="https://github.com/TanvirAhmed-1"
                target="_blank"
                className="flex items-center justify-center gap-2 w-full py-2 bg-white/5 border border-white/5 hover:border-white/15 rounded-xl text-gray-400 hover:text-white text-[11px] font-semibold transition-all active:scale-95"
              >
                <Github className="w-3.5 h-3.5" /> Github Portfolio
              </Link>
            </div>
          </GlassCard>
        </div>

      </div>

      {/* Platform Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center border border-white/5 flex flex-col items-center gap-3" hoverEffect={true}>
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Fast AI Extraction</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            High performance multi-threaded Python facial embeddings comparing milliseconds of image vectors.
          </p>
        </GlassCard>

        <GlassCard className="p-6 text-center border border-white/5 flex flex-col items-center gap-3" hoverEffect={true}>
          <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Robust Storage Control</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Dynamic client caps restricting media space automatically relative to selected subscription tier.
          </p>
        </GlassCard>

        <GlassCard className="p-6 text-center border border-white/5 flex flex-col items-center gap-3" hoverEffect={true}>
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Users className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Private & Encrypted</h4>
          <p className="text-[11px] text-gray-400 leading-relaxed">
            Client-specific catalogs secured with customized authentication guarantees absolute photo integrity.
          </p>
        </GlassCard>
      </div>
    </Container>
  );
}
