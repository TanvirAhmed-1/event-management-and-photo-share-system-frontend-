import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ThreeDBackground from "@/components/shared/ThreeDBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Eventora — #1 Event Management Platform & AI Photo Share in Bangladesh",
  description:
    "Plan your perfect event with Eventora. Discover top services, delicious food, expert vendors, curated packages, and instant AI photo sharing for Weddings, Birthdays, and Corporate Events.",
  keywords: [
    "Eventora",
    "event management Bangladesh",
    "wedding planner Dhaka",
    "AI photo finder",
    "wedding catering Bangladesh",
    "stage decoration Dhaka",
    "event photography Bangladesh",
    "kacchi biryani catering",
  ],
  authors: [{ name: "Eventora Team", url: "https://eventora.com.bd" }],
  creator: "Eventora",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    title: "Eventora — Plan Your Perfect Event",
    description: "Discover top services, delicious food, and expert vendors with AI photo sharing.",
    url: "https://eventora.com.bd",
    siteName: "Eventora",
    locale: "en_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Eventora — Event Management & AI Photo Share",
    description: "Discover top services, delicious food, expert vendors, and instant AI selfie photo sharing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaJson = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Eventora",
    "url": "https://eventora.com.bd",
    "description": "Bangladesh's premier event management marketplace with AI face-matching photo distribution.",
    "applicationCategory": "EventManagementApplication",
    "operatingSystem": "All",
    "areaServed": "Bangladesh",
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full scroll-smooth antialiased`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#7C3AED]/20 selection:text-[#7C3AED] font-sans antialiased" suppressHydrationWarning>
        <Providers>
          <ThreeDBackground />
          <Navbar />
          <main className="flex-grow flex flex-col relative z-10">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
