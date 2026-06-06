"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "@/components/shared/GlassCard";
import Container from "@/components/shared/Container";
import { 
  Sparkles, 
  Search, 
  CreditCard, 
  Calendar, 
  Upload, 
  Share2, 
  CheckCircle2, 
  ArrowRight, 
  Languages, 
  HelpCircle,
  Database,
  Lock,
  Zap,
  ChevronDown,
  QrCode,
  Play,
  UserCheck
} from "lucide-react";
import Link from "next/link";

type Lang = "en" | "bn";

export default function GuideClient() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeTab, setActiveTab] = useState<"all" | "purchase" | "event" | "upload">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Simulator State
  const [simStep, setSimStep] = useState(0);
  const [simLoading, setSimLoading] = useState(false);
  const [simData, setSimData] = useState({
    packageName: "",
    accountRegistered: false,
    eventName: "",
    photosCount: 0,
    photoUploaded: false,
    qrCodeGenerated: false,
  });

  const runSimStep = (step: number) => {
    setSimLoading(true);
    setTimeout(() => {
      setSimLoading(false);
      setSimStep(step);
    }, 900);
  };

  const resetSimulator = () => {
    setSimStep(0);
    setSimData({
      packageName: "",
      accountRegistered: false,
      eventName: "",
      photosCount: 0,
      photoUploaded: false,
      qrCodeGenerated: false,
    });
  };

  // Translations Dictionary
  const t = {
    en: {
      title: "Interactive User Guide",
      subtitle: "Master the ShareEventPhoto AI platform step-by-step. Get setup, create events, and upload photos.",
      searchPlaceholder: "Search for guide steps, e.g., 'payment', 'link'...",
      langLabel: "বাংলা সংস্করণ",
      goBack: "Back to Homepage",
      quickSimTitle: "Interactive Flow Simulator",
      quickSimDesc: "Try the process below in this live simulation to see how it works!",
      resetSim: "Reset Simulation",
      
      tabs: {
        all: "Complete Manual",
        purchase: "1. Purchase & Activation",
        event: "2. Creating Events",
        upload: "3. Uploading & Sharing",
      },

      sections: {
        purchase: {
          title: "Package Purchase & Account Registration",
          desc: "How to register, select a plan, and activate your account's cloud capacity.",
          steps: [
            {
              title: "Step 1: Choose Your Package",
              desc: "Browse our flexible pricing packages on the homepage (Free Trial, Gold, Elite). Click 'Get Started' on your preferred tier to initiate registration with that package pre-selected.",
              detail: "Free Trial gives 50MB. Gold plan gives 2GB storage, guest scanner access, and ZIP downloads. Elite plan provides 20GB and priority AI queues."
            },
            {
              title: "Step 2: Complete Registration",
              desc: "Fill in the signup form with your Name, Email, and a secure password. If you chose a premium package, you'll proceed to the checkout system immediately.",
              detail: "If you already have an account, simply sign in first, then visit the pricing section to upgrade."
            },
            {
              title: "Step 3: Secure Payment & Auto-Activation",
              desc: "Complete the transaction through our secure payment gateway. Upon success, your cloud storage quota, pre-processing modules, and event capabilities are automatically activated.",
              detail: "You will instantly be redirected to your updated dashboard showing your active subscription limit."
            }
          ]
        },
        event: {
          title: "Creating Events & Why They Matter",
          desc: "Learn why events are isolated and how to spin one up in seconds.",
          whyTitle: "Why do we create an 'Event'?",
          whyDesc: "An Event is a secure, isolated digital vault dedicated to one wedding/celebration. When you create an Event, our system instantiates a dedicated database and builds local AI facial vectors. Guests scanning their face will ONLY search within this wedding's photos, protecting privacy and preventing facial matches from crossing over to other weddings.",
          steps: [
            {
              title: "Step 1: Go to your Dashboard",
              desc: "After logging in, access your controller dashboard by clicking 'Dashboard' in the top menu bar.",
              detail: "Your active package storage indicator is visible here."
            },
            {
              title: "Step 2: Create a New Event Container",
              desc: "Click the golden '+ Create Event' button. This opens the luxury event configuration form.",
              detail: "You must enter the Event Name (e.g., 'Aria & Liam's Wedding'), Date, and Venue."
            },
            {
              title: "Step 3: Save and Initialize",
              desc: "Click 'Create Event'. The AI engine automatically sets up the backend storage structure and creates unique invite linkages for your guests.",
              detail: "Your event workspace is now live and ready to receive photo assets."
            }
          ]
        },
        upload: {
          title: "Uploading Photos & Sharing Guest Links",
          desc: "The professional photo ingestion system and how guests fetch their pictures.",
          steps: [
            {
              title: "Step 1: Select Event & Drag Photos",
              desc: "Open your active event workspace. Click 'Upload Photos' or drag-and-drop professional high-res photographs into the designated upload glass panel.",
              detail: "Our platform processes JPG and PNG files. Bulk uploading supports dozens of images in parallel."
            },
            {
              title: "Step 2: Background AI Face Indexing",
              desc: "The moment photos are uploaded, our background AI face-scanner automatically begins extracting face embeddings, mapping key facial features, and indexing them instantly.",
              detail: "This processing happens in the background, meaning you don't need to wait for indexing to finish to continue browsing."
            },
            {
              title: "Step 3: Share Guest Link or QR Code",
              desc: "Copy the unique 'Guest Page URL' or print the generated QR Code. Share it via WhatsApp/email or print it directly on wedding invitation cards.",
              detail: "When guests visit the link, they upload a selfie. The AI compares their selfie with the indexed event photos and instantly displays only their photos for download."
            }
          ]
        }
      },

      faq: [
        {
          q: "Does a guest need to register or pay to find their photos?",
          a: "No! Guests do not need to register, create accounts, or pay. They simply scan the QR code/open the link, upload a quick selfie, and instantly see their photos. The host's package covers all guest searches."
        },
        {
          q: "What happens if I run out of storage during photo upload?",
          a: "If your event uploads exceed your package limit, the system will pause uploads. You can easily upgrade to a higher storage tier (e.g. Gold to Elite) directly from your billing settings without losing any existing events or uploaded photos."
        },
        {
          q: "Are the guest photos and selfies kept private?",
          a: "Absolutely. We employ zero-storage face embedding technology. Guest selfies are used transiently to generate search vectors and are not stored on our servers. Furthermore, photos are private to each event."
        }
      ],
      faqTitle: "Frequently Asked Questions"
    },
    bn: {
      title: "ইন্টারেক্টিভ ইউজার গাইড",
      subtitle: "ধাপ-ভিত্তিক নির্দেশিকা অনুসরণ করে ShareEventPhoto AI প্ল্যাটফর্মটি কীভাবে ব্যবহার করবেন তা সহজে শিখে নিন।",
      searchPlaceholder: "পেমেন্ট, লিংক ইত্যাদির মতো শব্দ দিয়ে খুঁজুন...",
      langLabel: "English Version",
      goBack: "হোম পেজে ফিরে যান",
      quickSimTitle: "ইন্টারেক্টিভ ফ্লো সিমুলেটর",
      quickSimDesc: "নিচের লাইভ সিমুলেশনে নিজেই প্রক্রিয়াটি পরীক্ষা করে দেখুন কীভাবে এটি কাজ করে!",
      resetSim: "সিমুলেশন রিসেট করুন",
      
      tabs: {
        all: "সম্পূর্ণ নির্দেশিকা",
        purchase: "১. প্ল্যান ও অ্যাক্টিভেশন",
        event: "২. ইভেন্ট তৈরি",
        upload: "৩. ছবি আপলোড ও শেয়ার",
      },

      sections: {
        purchase: {
          title: "প্যাকেজ ক্রয় এবং অ্যাকাউন্ট রেজিস্ট্রেশন",
          desc: "কীভাবে একটি প্ল্যান বেছে নেবেন, নতুন অ্যাকাউন্ট খুলবেন এবং ক্লাউড স্টোরেজ সক্রিয় করবেন।",
          steps: [
            {
              title: "ধাপ ১: আপনার কাঙ্ক্ষিত প্যাকেজটি বেছে নিন",
              desc: "আমাদের ওয়েবসাইটের হোমপেজে যান এবং আপনার প্রয়োজনীয় প্যাকেজটি (ফ্রি ট্রায়াল, গোল্ড, বা এলিট) নির্বাচন করুন। পছন্দের প্যাকেজের নিচে থাকা 'Get Started' বাটনে ক্লিক করে রেজিস্ট্রেশন প্রক্রিয়া শুরু করুন।",
              detail: "ফ্রি ট্রায়াল প্ল্যানে ৫০ মেগাবাইট, গোল্ড প্ল্যানে ২ জিবি ক্লাউড স্টোরেজ ও জিপ ফাইল ডাউনলোড এবং এলিট প্ল্যানে ২০ জিবি ক্লাউড স্টোরেজ ও অগ্রাধিকার সম্পন্ন স্পিড পাওয়া যায়।"
            },
            {
              title: "ধাপ ২: রেজিস্ট্রেশন সম্পন্ন করুন",
              desc: "রেজিস্ট্রেশন ফরমে আপনার নাম, ইমেইল অ্যাড্রেস এবং একটি নিরাপদ পাসওয়ার্ড দিন। আপনি যদি পেইড বা প্রিমিয়াম প্যাকেজ বেছে নিয়ে থাকেন, তবে পরবর্তী ধাপে পেমেন্ট করার অপশন আসবে।",
              detail: "আপনার যদি আগে থেকেই অ্যাকাউন্ট করা থাকে, তবে সরাসরি লগইন করে ড্যাশবোর্ডে গিয়ে প্ল্যান পরিবর্তন বা আপগ্রেড করতে পারবেন।"
            },
            {
              title: "ধাপ ৩: নিরাপদ পেমেন্ট ও অটো-অ্যাক্টিভেশন",
              desc: "আমাদের নিরাপদ পেমেন্ট গেটওয়ের মাধ্যমে পেমেন্ট সম্পন্ন করুন। পেমেন্ট নিশ্চিত হওয়া মাত্রই স্বয়ংক্রিয়ভাবে আপনার অ্যাকাউন্টে ক্লাউড স্টোরেজ এবং এআই ফিচারসমূহ সক্রিয় হয়ে যাবে।",
              detail: "পেমেন্ট সম্পন্ন হওয়ার সাথে সাথেই আপনাকে আপনার আপডেট হওয়া ড্যাশবোর্ডে নিয়ে যাওয়া হবে যেখানে আপনি অ্যাক্টিভ লিমিট দেখতে পাবেন।"
            }
          ]
        },
        event: {
          title: "ইভেন্ট তৈরি এবং এর প্রয়োজনীয়তা",
          desc: "জানুন কেন প্রতিটি ইভেন্ট আলাদা রাখা হয় এবং কীভাবে কয়েক সেকেন্ডে একটি ইভেন্ট তৈরি করবেন।",
          whyTitle: "কেন আমরা আলাদা 'ইভেন্ট' তৈরি করব?",
          whyDesc: "একটি ইভেন্ট হলো মূলত একটি বিয়ের বা অনুষ্ঠানের জন্য আলাদা এআই ফোল্ডার। যখন আপনি একটি নতুন ইভেন্ট তৈরি করেন, আমাদের সিস্টেম সেটির জন্য একটি আলাদা সিকিউর ডাটাবেস গঠন করে। এতে করে অতিথিরা যখন তাদের ছবি সার্চ করতে সেলফি স্ক্যান করবেন, এআই শুধুমাত্র ওই নির্দিষ্ট ইভেন্টের ফটোগুলোর ভেতরেই সার্চ করবে। এর ফলে অতিথিদের প্রাইভেসি সুরক্ষিত থাকে এবং কোনো ডাটা বা ছবি অন্য ইভেন্টের সাথে মিশে যায় না।",
          steps: [
            {
              title: "ধাপ ১: ড্যাশবোর্ডে প্রবেশ করুন",
              desc: "অ্যাকাউন্টে লগইন করার পর, উপরের নেভিগেশন বার থেকে 'Dashboard'-এ ক্লিক করে আপনার কন্ট্রোল প্যানেলে প্রবেশ করুন।",
              detail: "এখানে আপনার বর্তমান প্যাকেজের মোট স্টোরেজ ও ব্যবহৃত স্টোরেজ গ্রাফ দেখতে পাবেন।"
            },
            {
              title: "ধাপ ২: নতুন ইভেন্ট তৈরি শুরু করুন",
              desc: "ড্যাশবোর্ডের ডান পাশে বা মাঝে থাকা গোল্ডেন রঙের '+ Create Event' বাটনে ক্লিক করুন। এতে একটি নতুন ইভেন্ট ফরম ওপেন হবে।",
              detail: "ফরমে ইভেন্টের নাম (যেমন: 'আরিয়া ও লিয়ামের বিয়ে'), তারিখ এবং ভেন্যুর নাম টাইপ করুন।"
            },
            {
              title: "ধাপ ৩: সেভ করে চালু করুন",
              desc: "'Create Event' বাটনে ক্লিক করে ইভেন্টটি সম্পন্ন করুন। আমাদের এআই ইঞ্জিন সাথে সাথে আপনার অতিথিদের জন্য একটি কিউআর কোড এবং ইনভাইট লিংক তৈরি করে ফেলবে।",
              detail: "আপনার ইভেন্টটি এখন সম্পূর্ণ প্রস্তুত এবং আপনি ছবি আপলোড করা শুরু করতে পারেন।"
            }
          ]
        },
        upload: {
          title: "ছবি আপলোড এবং গেস্ট লিংক শেয়ারিং",
          desc: "পেশাদার ছবি আপলোড করার পদ্ধতি এবং অতিথিরা যেভাবে তাদের ছবিগুলো খুঁজে পাবেন।",
          steps: [
            {
              title: "ধাপ ১: ইভেন্ট নির্বাচন করে ছবি দিন",
              desc: "আপনার ড্যাশবোর্ড থেকে ইভেন্টটি ওপেন করুন। 'Upload Photos' বাটনে ক্লিক করে অথবা সরাসরি ড্র্যাগ অ্যান্ড ড্রপ করে ফটোগ্রাফারের তোলা ছবিগুলো আপলোড করুন।",
              detail: "আমাদের প্ল্যাটফর্ম উচ্চমানের JPG এবং PNG ছবি সাপোর্ট করে। আপনি একসাথে অনেকগুলো ছবি আপলোড করতে পারবেন।"
            },
            {
              title: "ধাপ ২: ব্যাকগ্রাউন্ড এআই ফেস ইনডেক্সিং",
              desc: "ছবি আপলোড হওয়ার সাথে সাথেই আমাদের ক্লাউড এআই স্বয়ংক্রিয়ভাবে ব্যাকগ্রাউন্ডে ছবিগুলো স্ক্যান করা শুরু করে এবং প্রতিটি মুখমণ্ডলের এআই ভেক্টর ডাটা তৈরি করে ইনডেক্স করে রাখে।",
              detail: "এই প্রসেসটি ব্যাকগ্রাউন্ডে চলে, তাই আপনাকে আপলোড সম্পন্ন হওয়া পর্যন্ত অপেক্ষা করতে হবে না; আপনি অন্য কাজ করতে পারবেন।"
            },
            {
              title: "ধাপ ৩: কিউআর কোড বা লিংক শেয়ার করুন",
              desc: "ইভেন্ট পেজে থাকা ইউনিক 'Guest Link' কপি করুন অথবা কিউআর কোডটি ডাউনলোড করুন। এটি হোয়াটসঅ্যাপ, মেসেঞ্জার বা প্রিন্ট করে বিয়ের নিমন্ত্রণ পত্রে দিন।",
              detail: "অতিথিরা এই লিংক বা কিউআর কোড স্ক্যান করে তাদের মোবাইল থেকে একটি সেলফি আপলোড করলেই এআই তাদের ছবিগুলো চোখের পলকে খুঁজে এনে দেখাবে। অতিথিদের কোনো অ্যাকাউন্ট খুলতে হবে না!"
            }
          ]
        }
      },

      faq: [
        {
          q: "ছবি খোঁজার জন্য কি অতিথিদের কোনো টাকা দিতে হবে বা অ্যাকাউন্ট খুলতে হবে?",
          a: "না! অতিথিদের কোনো অ্যাকাউন্ট খুলতে হবে না এবং কোনো পেমেন্টও করতে হবে না। তারা শুধু কিউআর কোডটি স্ক্যান করে একটি সেলফি দিলেই তাদের ছবি পেয়ে যাবেন। ইভেন্ট হোস্টের প্যাকেজের ভেতরেই সব খরচ অন্তর্ভুক্ত।"
        },
        {
          q: "ছবি আপলোড করতে করতে স্টোরেজ শেষ হয়ে গেলে কী করব?",
          a: "স্টোরেজ শেষ হয়ে গেলে আপলোড সাময়িকভাবে থমকে যাবে। আপনি খুব সহজেই যেকোনো সময় ড্যাশবোর্ড থেকে আপনার প্ল্যানটি আপগ্রেড করে নিতে পারেন (যেমন গোল্ড থেকে এলিট প্ল্যানে)। এতে আগের কোনো ছবি বা ইভেন্ট ডিলিট হবে না।"
        },
        {
          q: "অতিথিদের আপলোড করা সেলফি ও ছবিগুলো কি নিরাপদ থাকবে?",
          a: "হ্যাঁ, সম্পূর্ণ নিরাপদ। আমরা জিরো-স্টোরেজ এআই ফেস ম্যাচিং টেকনোলজি ব্যবহার করি। অতিথিদের সার্চ করার জন্য নেওয়া সেলফিগুলো তুলনা করার পরেই মুছে ফেলা হয় এবং সার্ভারে সংরক্ষণ করা হয় না।"
        }
      ],
      faqTitle: "সচরাচর জিজ্ঞাস্য (FAQ)"
    }
  };

  const curr = t[lang];

  // Helper filter function
  const matchesSearch = (text: string) => {
    if (!searchQuery) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="relative w-full overflow-hidden pb-24">
      {/* Decorative Floating Circles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.045)_0%, transparent_70%) blur-3xl" />
        <div className="absolute bottom-[20%] right-[-10%] w-[550px] h-[550px] rounded-full bg-radial-gradient(circle, rgba(183,110,121,0.04)_0%, transparent_70%) blur-3xl" />
      </div>

      <Container className="py-12 sm:py-20 flex flex-col gap-12 relative z-10">
        
        {/* Navigation & Language Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
          <Link 
            href="/" 
            className="text-xs font-semibold tracking-wider text-gray-400 hover:text-[#d4af37] transition-all flex items-center gap-2 group"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            {curr.goBack}
          </Link>
          
          <button
            onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#d4af37]/25 hover:border-[#d4af37]/60 bg-gold-dark-gradient/50 text-[#d4af37] hover:text-white transition-all text-xs font-bold tracking-wide active:scale-95 shadow-md shadow-black/35 cursor-pointer"
          >
            <Languages className="w-4 h-4 animate-pulse" />
            {curr.langLabel}
          </button>
        </div>

        {/* Page Title & Search */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-extrabold tracking-widest uppercase text-gold-gradient flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            Onboarding Center
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-heading text-white tracking-tight leading-none">
            {lang === "en" ? (
              <>ShareEventPhoto <span className="text-gold-gradient">AI Guide</span></>
            ) : (
              <>ব্যবহার নির্দেশিকা <span className="text-gold-gradient">হাব</span></>
            )}
          </h1>
          <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium">
            {curr.subtitle}
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder={curr.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d0d11]/80 border border-white/5 rounded-full pl-11 pr-5 py-3 text-xs text-white focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/40 placeholder:text-gray-600 transition-all font-medium"
            />
          </div>
        </div>

        {/* TAB CONTROLS */}
        <div className="flex flex-wrap justify-center gap-2.5 border-b border-white/5 pb-2">
          {(["all", "purchase", "event", "upload"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer ${
                activeTab === tab 
                  ? "bg-gold-gradient text-black shadow-lg shadow-[#d4af37]/15" 
                  : "bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              {curr.tabs[tab]}
            </button>
          ))}
        </div>

        {/* ---------------- INTERACTIVE LIVE SIMULATOR ---------------- */}
        <div className="w-full pt-4">
          <GlassCard className="border border-white/5 bg-[#08080c]/60 p-6 sm:p-10 rounded-2xl relative overflow-hidden" hoverEffect={false}>
            {/* Background scanner line effect for simulator */}
            {simLoading && (
              <div className="absolute left-0 right-0 h-0.5 bg-gold-gradient animate-laser z-20 pointer-events-none opacity-80" />
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Simulator Control Panel */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-dark-gradient border border-[#d4af37]/25 text-[#d4af37] text-[10px] font-black uppercase tracking-wider mb-4">
                    <Zap className="w-3 h-3 text-[#d4af37] animate-bounce" /> Live Simulation
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                    {curr.quickSimTitle}
                  </h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed font-medium">
                    {curr.quickSimDesc}
                  </p>
                </div>

                {/* Simulator Interactive Button Stages */}
                <div className="flex flex-col gap-3 my-4">
                  {/* Step 1 Control */}
                  <button
                    onClick={() => {
                      setSimData(prev => ({ ...prev, packageName: "Gold Event Plan" }));
                      runSimStep(1);
                    }}
                    disabled={simLoading}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                      simStep >= 1 
                        ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]" 
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-400">1</span>
                      {lang === "en" ? "Purchase Package & Register" : "প্যাকেজ ক্রয় ও রেজিস্ট্রেশন"}
                    </span>
                    {simStep >= 1 && <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />}
                  </button>

                  {/* Step 2 Control */}
                  <button
                    onClick={() => {
                      if (simStep < 1) {
                        setSimData(prev => ({ ...prev, packageName: "Gold Event Plan" }));
                      }
                      setSimData(prev => ({ ...prev, eventName: lang === "en" ? "Aria & Liam's Wedding" : "আরিয়া ও লিয়ামের বিয়ে" }));
                      runSimStep(2);
                    }}
                    disabled={simLoading}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                      simStep >= 2 
                        ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]" 
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-400">2</span>
                      {lang === "en" ? "Create Event Workspace" : "ইভেন্ট তৈরি করুন"}
                    </span>
                    {simStep >= 2 && <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />}
                  </button>

                  {/* Step 3 Control */}
                  <button
                    onClick={() => {
                      if (simStep < 2) {
                        setSimData(prev => ({ 
                          ...prev, 
                          packageName: "Gold Event Plan",
                          eventName: lang === "en" ? "Aria & Liam's Wedding" : "আরিয়া ও লিয়ামের বিয়ে" 
                        }));
                      }
                      setSimData(prev => ({ ...prev, photosCount: 24, photoUploaded: true }));
                      runSimStep(3);
                    }}
                    disabled={simLoading}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                      simStep >= 3 
                        ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]" 
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-400">3</span>
                      {lang === "en" ? "Upload Photos & Trigger AI" : "ছবি আপলোড ও এআই স্ক্যান"}
                    </span>
                    {simStep >= 3 && <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />}
                  </button>

                  {/* Step 4 Control */}
                  <button
                    onClick={() => {
                      if (simStep < 3) {
                        setSimData(prev => ({ 
                          ...prev, 
                          packageName: "Gold Event Plan",
                          eventName: lang === "en" ? "Aria & Liam's Wedding" : "আরিয়া ও লিয়ামের বিয়ে",
                          photosCount: 24,
                          photoUploaded: true 
                        }));
                      }
                      setSimData(prev => ({ ...prev, qrCodeGenerated: true }));
                      runSimStep(4);
                    }}
                    disabled={simLoading}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all text-xs font-bold cursor-pointer ${
                      simStep >= 4 
                        ? "bg-[#d4af37]/10 border-[#d4af37]/40 text-[#d4af37]" 
                        : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-400">4</span>
                      {lang === "en" ? "Generate Guest QR & Share Link" : "কিউআর কোড ও গেস্ট লিংক জেনারেট"}
                    </span>
                    {simStep >= 4 && <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />}
                  </button>
                </div>

                <button
                  onClick={resetSimulator}
                  className="text-[11px] font-bold text-gray-500 hover:text-red-400 underline transition-all self-start cursor-pointer"
                >
                  {curr.resetSim}
                </button>
              </div>

              {/* Simulator Screen Representation */}
              <div className="lg:col-span-7 bg-[#050507] border border-white/5 rounded-xl p-5 sm:p-7 flex flex-col justify-between relative min-h-[340px] shadow-inner">
                {/* Simulated Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-600 tracking-wider">
                    {lang === "en" ? "SIMULATOR_SCREEN" : "সিমুলেটর_স্ক্রিন"}
                  </span>
                </div>

                {/* Simulated Content Screen */}
                <div className="flex-grow flex flex-col justify-center py-6">
                  {simLoading ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                      <div className="w-8 h-8 rounded-full border-2 border-white/5 border-t-[#d4af37] animate-spin" />
                      <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase animate-pulse">
                        {lang === "en" ? "AI Processor Executing..." : "এআই প্রসেসিং হচ্ছে..."}
                      </span>
                    </div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {simStep === 0 && (
                        <motion.div 
                          key="step0"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-center space-y-3"
                        >
                          <Play className="w-10 h-10 text-gray-600 mx-auto" />
                          <h4 className="text-sm font-extrabold text-white">
                            {lang === "en" ? "Ready to Simulate" : "সিমুলেশন শুরু করতে প্রস্তুত"}
                          </h4>
                          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                            {lang === "en" 
                              ? "Click the steps on the left to simulate the entire vendor & guest dashboard experience." 
                              : "বামপাশের ধাপগুলোতে ক্লিক করে সম্পূর্ণ ভেন্ডর এবং গেস্ট ড্যাশবোর্ডের অভিজ্ঞতাটি পরীক্ষা করে দেখুন।"}
                          </p>
                        </motion.div>
                      )}

                      {simStep === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-4"
                        >
                          <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                            <div>
                              <span className="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Active Plan</span>
                              <span className="text-sm font-extrabold text-white">{simData.packageName}</span>
                            </div>
                            <span className="text-[10px] font-black px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] uppercase tracking-wider">Activated</span>
                          </div>

                          <div className="flex items-center gap-3 bg-[#d4af37]/5 p-3 rounded-lg border border-[#d4af37]/10">
                            <UserCheck className="w-5 h-5 text-[#d4af37] shrink-0" />
                            <div>
                              <h5 className="text-xs font-extrabold text-white">
                                {lang === "en" ? "Account Registered Successfully" : "অ্যাকাউন্ট রেজিস্ট্রেশন সফল হয়েছে"}
                              </h5>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {lang === "en" ? "Storage allotted: 2,000 MB (Gold limit)" : "বরাদ্দকৃত স্টোরেজ: ২,০০০ মেগাবাইট (গোল্ড লিমিট)"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {simStep === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <div className="bg-[#0f0f15] border border-white/5 p-4 rounded-xl space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-black text-white">{simData.eventName}</span>
                              <span className="text-[9px] font-bold text-gray-500 font-mono">ID: ev_8f23d1s</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="bg-white/5 p-2 rounded text-center">
                                <span className="text-[9px] text-gray-500 block">Photos</span>
                                <span className="text-xs font-bold text-white">0</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded text-center">
                                <span className="text-[9px] text-gray-500 block">Guests</span>
                                <span className="text-xs font-bold text-white">0 Matches</span>
                              </div>
                              <div className="bg-white/5 p-2 rounded text-center">
                                <span className="text-[9px] text-gray-500 block">Status</span>
                                <span className="text-[10px] font-bold text-green-400 block">Ready</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] text-[#d4af37] font-semibold flex items-center gap-1.5 justify-center">
                            <Sparkles className="w-3 h-3" /> 
                            {lang === "en" ? "Isolated AI Face Embedding container created!" : "আলাদা এআই ফেস এমবেডিং ফোল্ডার তৈরি হয়েছে!"}
                          </span>
                        </motion.div>
                      )}

                      {simStep === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-3"
                        >
                          <div className="bg-white/5 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Upload className="w-5 h-5 text-[#d4af37] animate-pulse" />
                              <div>
                                <span className="text-xs font-extrabold text-white">
                                  {lang === "en" ? "Ingested 24 Professional Photos" : "২৪টি হাই-রেজ ছবি আপলোড করা হয়েছে"}
                                </span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">
                                  {lang === "en" ? "AI Model indexing faces..." : "এআই ফেস ইন্ডেক্সিং সম্পন্ন করছে..."}
                                </span>
                              </div>
                            </div>
                            <span className="text-[10px] font-mono text-[#d4af37]">100%</span>
                          </div>

                          <div className="bg-[#1c1912]/40 border border-[#d4af37]/20 p-3 rounded-lg flex items-center gap-2">
                            <Database className="w-4 h-4 text-[#d4af37] shrink-0" />
                            <span className="text-[10px] text-gray-300">
                              {lang === "en" 
                                ? "Successfully built 148 face embeddings from 24 pictures." 
                                : "২৪টি ছবি থেকে ১৪৮টি মুখমণ্ডলের এআই ভেক্টর সফলভাবে তৈরি হয়েছে।"}
                            </span>
                          </div>
                        </motion.div>
                      )}

                      {simStep === 4 && (
                        <motion.div 
                          key="step4"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
                        >
                          {/* Mock QR Code */}
                          <div className="w-24 h-24 bg-white p-2 rounded-lg flex items-center justify-center shrink-0 shadow-lg">
                            <QrCode className="w-20 h-20 text-black" />
                          </div>

                          <div className="space-y-2 flex-grow">
                            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                              {lang === "en" ? "Event Link & Invitation QR" : "ইভেন্ট লিংক ও আমন্ত্রণ কিউআর কোড"}
                            </h5>
                            <div className="bg-black/40 border border-white/5 px-2.5 py-1.5 rounded text-[10px] font-mono text-gray-300 break-all select-all">
                              https://shareeventphoto-ai.com/guest/ev_8f23d1s
                            </div>
                            <p className="text-[9px] text-gray-400">
                              {lang === "en" 
                                ? "Guests scan QR -> Take Selfie -> Instantly view their wedding photos!" 
                                : "অতিথিরা কোড স্ক্যান করে সেলফি তুলবেন এবং চোখের পলকে নিজের ছবিগুলো পেয়ে যাবেন!"}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>

                {/* Simulated Footer status bar */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[9px] font-mono text-gray-500">
                  <span>SYSTEM: OK</span>
                  <span>STEP: {simStep}/4</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* ---------------- DOCUMENTATION CARDS GRID ---------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
          
          {/* SECTION 1: REGISTRATION & PLAN */}
          {(activeTab === "all" || activeTab === "purchase") && matchesSearch(curr.sections.purchase.title) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              <GlassCard className="flex-grow flex flex-col justify-between border border-white/5 bg-[#0c0c10]/40 p-6 sm:p-8 hoverEffect={true}">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-heading text-white">
                      {curr.sections.purchase.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">
                      {curr.sections.purchase.desc}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-white/5">
                    {curr.sections.purchase.steps.map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-wider">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed font-medium bg-black/25 p-2 rounded border border-white/5">
                          {step.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* SECTION 2: CREATE EVENT & WHY */}
          {(activeTab === "all" || activeTab === "event") && matchesSearch(curr.sections.event.title) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col"
            >
              <GlassCard className="flex-grow flex flex-col justify-between border border-white/5 bg-[#0c0c10]/40 p-6 sm:p-8 hoverEffect={true}">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-heading text-white">
                      {curr.sections.event.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">
                      {curr.sections.event.desc}
                    </p>
                  </div>

                  {/* Why create event - CRITICAL REQUIREMENT */}
                  <div className="bg-purple-950/20 border border-purple-500/15 p-3 rounded-lg space-y-1">
                    <h4 className="text-[11px] font-black text-purple-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3 h-3" /> {curr.sections.event.whyTitle}
                    </h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                      {curr.sections.event.whyDesc}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-white/5">
                    {curr.sections.event.steps.map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-wider">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed font-medium bg-black/25 p-2 rounded border border-white/5">
                          {step.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {/* SECTION 3: UPLOAD & SHARE */}
          {(activeTab === "all" || activeTab === "upload") && matchesSearch(curr.sections.upload.title) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col"
            >
              <GlassCard className="flex-grow flex flex-col justify-between border border-white/5 bg-[#0c0c10]/40 p-6 sm:p-8 hoverEffect={true}">
                <div className="space-y-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black font-heading text-white">
                      {curr.sections.upload.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed font-medium">
                      {curr.sections.upload.desc}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-white/5">
                    {curr.sections.upload.steps.map((step, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#d4af37] uppercase tracking-wider">
                          {step.title}
                        </h4>
                        <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                          {step.desc}
                        </p>
                        <p className="text-[10px] text-gray-500 italic leading-relaxed font-medium bg-black/25 p-2 rounded border border-white/5">
                          {step.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

        </div>

        {/* ---------------- FAQs SECTION ---------------- */}
        <div className="pt-12 border-t border-white/5">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-2xl font-extrabold font-heading text-white text-center flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#d4af37]" /> {curr.faqTitle}
            </h3>

            <div className="space-y-4">
              {curr.faq.map((item, index) => (
                <div 
                  key={index}
                  className="bg-[#0b0b0f] border border-white/5 rounded-xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex justify-between items-center p-5 text-left text-xs font-bold text-white hover:text-[#d4af37] transition-all cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        expandedFaq === index ? "rotate-180 text-[#d4af37]" : ""
                      }`} 
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="p-5 pt-0 text-[11px] text-gray-400 leading-relaxed border-t border-white/5 bg-white/[0.01]">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

      </Container>
    </div>
  );
}
