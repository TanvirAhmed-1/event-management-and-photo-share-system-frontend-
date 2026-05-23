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
  title: "ShareMyPhoto AI - Luxury AI Wedding Photo Finder & Face Matcher",
  description:
    "An elegant SaaS photo finder for weddings. Guests can upload a selfie to instantly find all professional wedding photos containing their faces via secure AI scanning.",
  keywords: [
    "wedding photo finder",
    "facial recognition saas",
    "wedding guest face matcher",
    "luxury wedding photography saas",
    "ai wedding photo organizer",
    "share my photo ai",
    "tanvir ahmed",
  ],
  authors: [{ name: "Tanvir Ahmed", url: "https://tanvirahmed1.netlify.app/" }],
  creator: "Tanvir Ahmed",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "ShareMyPhoto AI - Luxury AI Wedding Photo Finder",
    description: "An elegant SaaS photo finder for weddings. Guests can find professional photos instantly via secure AI facial recognition scanning.",
    url: "https://sharemyphoto-ai.com",
    siteName: "ShareMyPhoto AI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareMyPhoto AI - Luxury AI Wedding Photo Finder",
    description: "Guests upload a selfie to instantly find all professional wedding photos containing their faces.",
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
    "name": "ShareMyPhoto AI",
    "url": "https://sharemyphoto-ai.com",
    "description": "An elegant SaaS photo finder for weddings. Guests can upload a selfie to instantly find all professional wedding photos containing their faces via secure AI scanning.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "All",
    "creator": {
      "@type": "Person",
      "name": "Tanvir Ahmed",
      "jobTitle": "Full Stack Web Developer",
      "url": "https://tanvirahmed1.netlify.app/"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} h-full scroll-smooth antialiased dark`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJson) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#060608] text-[#f4f4f7] selection:bg-[#d4af37]/20 selection:text-[#d4af37] font-sans" suppressHydrationWarning>
        <Providers>
          <ThreeDBackground />
          <Navbar />
          <main className="flex-grow flex flex-col relative">
            {/* Background glowing overlays */}
            <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-radial-gradient(circle, rgba(212,175,55,0.03)_0%, transparent_70%) blur-3xl pointer-events-none z-0"></div>
            <div className="absolute top-[40%] right-[5%] w-[600px] h-[600px] bg-radial-gradient(circle, rgba(183,110,121,0.03)_0%, transparent_70%) blur-3xl pointer-events-none z-0"></div>
            
            <div className="relative z-10 flex flex-col flex-grow w-full">
              {children}
            </div>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
