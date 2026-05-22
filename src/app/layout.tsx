import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ThreeDBackground from "@/components/shared/ThreeDBackground";

export const metadata: Metadata = {
  title: "AuraFind AI - Luxury AI Wedding Photo Finder & Face Matcher",
  description:
    "An elegant SaaS photo finder for weddings. Guests can upload a selfie to instantly find all professional wedding photos containing their faces via secure AI scanning.",
  keywords: "wedding photo finder, facial recognition saas, wedding guest face matcher, luxury wedding photography saas",
  authors: [{ name: "AuraFind AI Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased dark" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#060608] text-[#f4f4f7] selection:bg-[#d4af37]/20 selection:text-[#d4af37]" suppressHydrationWarning>
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
