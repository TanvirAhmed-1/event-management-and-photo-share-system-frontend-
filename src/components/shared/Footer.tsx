import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-auto border-t border-white/5 bg-[#060608]/80 py-12 relative overflow-hidden">
      {/* Background glow dots */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-radial-gradient(circle, rgba(212,175,55,0.02)_0%, transparent_70%) blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/5 pb-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-black font-heading tracking-wider uppercase text-gold-gradient">
                AURA<span className="text-white">FIND</span>
              </span>
            </Link>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              SaaS AI-powered wedding facial recognition and instant photo finder.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-sm">
            <Link href="/" className="text-gray-400 hover:text-[#d4af37] transition-all">Home</Link>
            <a href="#features" className="text-gray-400 hover:text-[#d4af37] transition-all">Features</a>
            <a href="#pricing" className="text-gray-400 hover:text-[#d4af37] transition-all">Pricing</a>
            <Link href="/login" className="text-gray-400 hover:text-[#d4af37] transition-all">Sign In</Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} AuraFind AI. All rights reserved.
          </p>
          <p className="text-[10px] tracking-wider text-gray-600 uppercase font-semibold">
            Designed for luxurious experiences &bull; Powered by Deep Face embeddings
          </p>
        </div>
      </div>
    </footer>
  );
}
