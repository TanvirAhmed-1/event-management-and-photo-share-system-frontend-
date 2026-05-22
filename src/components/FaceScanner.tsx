"use client";

import { useEffect, useState } from "react";
import { Sparkles, Cpu, Search, Activity } from "lucide-react";

interface FaceScannerProps {
  imageSrc: string;
}

export default function FaceScanner({ imageSrc }: FaceScannerProps) {
  const [scanStep, setScanStep] = useState(0);

  const scanLogs = [
    "Initializing neural embedding framework...",
    "Isolating facial boundaries & landmark keypoints...",
    "Computing 128-dimensional Euclidean distance map...",
    "Executing database vector spatial lookups...",
    "Compiling facial matching matrices..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScanStep((prev) => (prev < scanLogs.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-8 relative py-6">
      
      {/* Laser Scanning Screen */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-[#d4af37]/35 bg-[#0a0a0d] shadow-[0_0_40px_rgba(212,175,55,0.15)] group">
        
        {/* The Selfie */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Scanning target"
            className="w-full h-full object-cover brightness-[0.7] saturate-[0.8]"
          />
        )}

        {/* Futuristic Tech Corner Brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#d4af37] rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#d4af37] rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#d4af37] rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#d4af37] rounded-br-lg"></div>

        {/* Sweeping Laser Line */}
        <div className="absolute left-0 w-full h-1 bg-[#d4af37] shadow-[0_0_20px_#d4af37,0_0_35px_#d4af37] animate-laser"></div>

        {/* Glowing Face Mesh Dot Overlay */}
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 p-8 pointer-events-none opacity-45">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              {i % 5 === 0 && (
                <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-ping" style={{ animationDelay: `${i * 150}ms` }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Scanner Radar Sweeper Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,transparent_70%)] animate-pulse"></div>
      </div>

      {/* Typing Logs Readouts */}
      <div className="w-full max-w-sm glass-panel p-4 rounded-xl border border-[#d4af37]/15 bg-[#0e0e12]/80 flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[10px] font-black uppercase text-[#d4af37] tracking-widest border-b border-white/5 pb-2">
          <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> Core Neural Scanner</span>
          <span className="flex items-center gap-1"><Activity className="w-3.5 h-3.5 animate-pulse" /> PROCESSING</span>
        </div>

        <div className="space-y-1.5 min-h-[50px]">
          {scanLogs.slice(0, scanStep + 1).map((log, i) => (
            <p
              key={i}
              className={`text-[10px] font-medium font-mono leading-normal ${
                i === scanStep ? "text-[#d4af37] animate-pulse" : "text-gray-500"
              }`}
            >
              &gt; {log}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}
