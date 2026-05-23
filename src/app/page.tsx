"use client";

import { useRouter } from "next/navigation";
import { useGetAllPackagesQuery } from "@/redux/features/package/packageApi";
import { motion } from "framer-motion";
import Container from "@/components/shared/Container";

// Split subcomponents from ui/home
import Hero from "@/components/ui/home/Hero";
import ScannerIllustration from "@/components/ui/home/ScannerIllustration";
import HowItWorks from "@/components/ui/home/HowItWorks";
import PlatformBenefits from "@/components/ui/home/PlatformBenefits";
import PricingPlans from "@/components/ui/home/PricingPlans";
import ReviewSlider from "@/components/ReviewSlider";

export default function Home() {
  const router = useRouter();
  const { data: packageResponse, isLoading: packagesLoading } = useGetAllPackagesQuery(undefined);

  const packages = packageResponse?.data || [
    {
      id: "free-mock",
      name: "Free Trial",
      price: 0,
      storageLimitMB: 50,
      description: ["50 MB secure storage", "Instant facial matches", "Multi-upload up to 10 files", "Single downloads only"],
    },
    {
      id: "gold-mock",
      name: "Gold Event Plan",
      price: 19.99,
      storageLimitMB: 2000,
      description: ["2 GB premium storage", "Saves up to 1,000 photos", "Fast ZIP stream downloads", "Pre-processing embeddings", "Guest Selfie Scanner access"],
    },
    {
      id: "premium-mock",
      name: "Elite Lifetime Plan",
      price: 49.99,
      storageLimitMB: 20000,
      description: ["20 GB lifetime storage", "Uncapped high-res uploads", "Super-fast priority processing", "ZIP stream multi-downloads", "Lifetime dashboard metrics", "Premium support"],
    },
  ];

  const handleSelectPackage = (pkgId: string) => {
    if (pkgId.endsWith("-mock")) {
      router.push("/register");
    } else {
      router.push(`/register?packageId=${pkgId}`);
    }
  };

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [0, -12, 0],
      rotate: [0, 2, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="relative w-full overflow-hidden pb-24">

      {/* Absolute Decorative Floating Background Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating Particle 1 */}
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[15%] left-[8%] w-72 h-72 rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.045)_0%, transparent_70%) blur-2xl"
        />

        {/* Floating Particle 2 */}
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[45%] right-[10%] w-[450px] h-[450px] rounded-full bg-radial-gradient(circle, rgba(183,110,121,0.04)_0%, transparent_70%) blur-3xl"
        />

        {/* Floating Particle 3 */}
        <motion.div
          animate={{
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-[10%] left-[15%] w-80 h-80 rounded-full bg-radial-gradient(circle, rgba(212,175,55,0.03)_0%, transparent_70%) blur-2xl"
        />
      </div>

      <Container className="flex flex-col gap-24 py-16 sm:py-24 relative z-10">

        {/* 1. Hero Section */}
        <Hero containerVariants={containerVariants} itemVariants={itemVariants} />

        {/* 2. Interactive Mock Scanner Illustration */}
        <ScannerIllustration floatVariants={floatVariants} />

        {/* 3. How It Works Step-by-Step */}
        <HowItWorks />

        {/* 4. Platform Architectural Benefits & Metrics */}
        <PlatformBenefits />

        {/* 5. SaaS Pricing & Subscription Selection + FAQs Accordion */}
        <PricingPlans
          packages={packages}
          packagesLoading={packagesLoading}
          onSelectPackage={handleSelectPackage}
        />

        {/* 6. Love From Wedding Couples & Guests (Reviews Slider) */}
        <section className="space-y-10 w-full relative">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
              Client Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
              Love From Wedding Couples
            </h2>
            <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
              Read how ShareEventPhoto AI brought smiles to couples and wedding guests by finding their memories instantly.
            </p>
          </div>
          <ReviewSlider />
        </section>

      </Container>
    </div>
  );
}
