"use client";

import HeroSection from "@/components/ui/home/HeroSection";
import BrowseCategories from "@/components/ui/home/BrowseCategories";
import PremiumServices from "@/components/ui/home/PremiumServices";
import FeaturedPackages from "@/components/ui/home/FeaturedPackages";
import AiPhotoAndWorkflow from "@/components/ui/home/AiPhotoAndWorkflow";
import SeoComparisonMatrix from "@/components/ui/home/SeoComparisonMatrix";
import SeoLocationsAndVenues from "@/components/ui/home/SeoLocationsAndVenues";
import TestimonialsAndStats from "@/components/ui/home/TestimonialsAndStats";
import SeoFaqSection from "@/components/ui/home/SeoFaqSection";
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

      {/* 6. SEO Comparison Matrix: Traditional Coordination vs. Eventora AI Platform */}
      <SeoComparisonMatrix />

      {/* 7. SEO Regional Coverage & Partner Venues across Bangladesh */}
      <SeoLocationsAndVenues />

      {/* 8. What Our Customers Say & Statistics */}
      <TestimonialsAndStats />

      {/* 9. SEO FAQ Section with FAQPage JSON-LD Schema */}
      <SeoFaqSection />

      {/* 10. Bottom CTA Banner: Ready to Plan Your Next Event? */}
      <BottomCtaBanner />
    </div>
  );
}
