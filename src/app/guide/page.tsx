import type { Metadata } from "next";
import GuideClient from "@/components/ui/guide/GuideClient";

export const metadata: Metadata = {
  title: "User Guide & Onboarding Hub | ShareEventPhoto AI",
  description:
    "Learn how to purchase a package, register, activate your plan, create events, and upload photos for instant AI face-matching.",
  keywords: [
    "user guide",
    "how to use shareeventphoto",
    "wedding photo software guide",
    "facial recognition user manual",
    "register shareeventphoto",
  ],
  openGraph: {
    title: "User Guide & Onboarding Hub | ShareEventPhoto AI",
    description: "Learn how to use ShareEventPhoto AI. Simple steps to buy packages, register, launch events, and upload photos.",
    url: "https://shareeventphoto-ai.com/guide",
    type: "website",
  },
};

export default function GuidePage() {
  return <GuideClient />;
}
