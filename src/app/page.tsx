"use client";

import HeroSection from "@/components/ui/home/HeroSection";
import BrowseCategories from "@/components/ui/home/BrowseCategories";
import PremiumServices from "@/components/ui/home/PremiumServices";
import FeaturedPackages from "@/components/ui/home/FeaturedPackages";
import AiPhotoAndWorkflow from "@/components/ui/home/AiPhotoAndWorkflow";
import TestimonialsAndStats from "@/components/ui/home/TestimonialsAndStats";
import BottomCtaBanner from "@/components/ui/home/BottomCtaBanner";

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      {/* 1. Hero Section with Bangladeshi Wedding Couple & Search Filter */}
      <HeroSection />

      {/* 2. Browse Event Categories (6 cards) */}
      <BrowseCategories />

      {/* 3. Our Premium Services & Smart Event Planning with AI */}
      <PremiumServices />

      {/* 4. Featured Event Packages & Delicious Food Catering */}
      <FeaturedPackages />

      {/* 5. Find Your Photos with AI & How It Works (4 simple steps) */}
      <AiPhotoAndWorkflow />

      {/* 6. What Our Customers Say & Statistics */}
      <TestimonialsAndStats />

      {/* 7. Bottom CTA Banner: Ready to Plan Your Next Event? */}
      <BottomCtaBanner />
    </div>
  );
}
