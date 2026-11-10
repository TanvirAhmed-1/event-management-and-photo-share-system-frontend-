"use client";

import React from "react";
import Link from "next/link";

interface EventoraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

export default function EventoraLogo({
  className = "",
  size = "md",
  inverted = false,
}: EventoraLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const subTextSizes = {
    sm: "text-[9px]",
    md: "text-[10px]",
    lg: "text-xs",
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 group select-none transition-transform active:scale-95 ${className}`}
    >
      {/* Flower / Mandala Brand Icon */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform duration-300 group-hover:rotate-45"
        >
          {/* Outer Petals */}
          <circle cx="20" cy="8" r="5" fill="#7C3AED" fillOpacity="0.85" />
          <circle cx="20" cy="32" r="5" fill="#7C3AED" fillOpacity="0.85" />
          <circle cx="8" cy="20" r="5" fill="#7C3AED" fillOpacity="0.85" />
          <circle cx="32" cy="20" r="5" fill="#7C3AED" fillOpacity="0.85" />
          {/* Diagonal Petals */}
          <circle cx="11.5" cy="11.5" r="4.5" fill="#F5B942" />
          <circle cx="28.5" cy="11.5" r="4.5" fill="#F5B942" />
          <circle cx="11.5" cy="28.5" r="4.5" fill="#F5B942" />
          <circle cx="28.5" cy="28.5" r="4.5" fill="#F5B942" />
          {/* Center Hub */}
          <circle cx="20" cy="20" r="6" fill="#172554" />
          <circle cx="20" cy="20" r="3" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Text & Tagline */}
      <div className="flex flex-col">
        <span
          className={`font-heading font-extrabold tracking-tight leading-none ${textSizes[size]} ${
            inverted ? "text-white" : "text-[#172554]"
          }`}
        >
          Eventora
        </span>
        <span
          className={`font-sans tracking-wider uppercase font-semibold text-slate-500 mt-0.5 ${subTextSizes[size]} ${
            inverted ? "text-slate-300" : "text-slate-500"
          }`}
        >
          Plan • Book • Celebrate
        </span>
      </div>
    </Link>
  );
}

