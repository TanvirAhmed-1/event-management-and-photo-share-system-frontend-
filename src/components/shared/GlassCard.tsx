"use client";

import { ReactNode, useState, useRef, MouseEvent } from "react";
import { cn } from "@/utils/cn";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export default function GlassCard({ children, className, hoverEffect = true }: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [shineStyle, setShineStyle] = useState({ opacity: 0, x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!hoverEffect || !cardRef.current) return;
    const card = cardRef.current;
    const box = card.getBoundingClientRect();
    
    // Get mouse coordinates relative to the card's box bounds
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    
    // Normalize coordinates from -0.5 to 0.5
    const normalizedX = x / box.width - 0.5;
    const normalizedY = y / box.height - 0.5;
    
    // Calculate rotation angles (up to 12 degrees max rotation for premium control)
    const rotateX = -normalizedY * 12;
    const rotateY = normalizedX * 12;
    
    setRotate({ x: rotateX, y: rotateY });
    
    // Dynamic light reflection shine position on the glass overlay
    setShineStyle({
      opacity: 0.14,
      x: (x / box.width) * 100,
      y: (y / box.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    // Reset rotations smoothly
    setRotate({ x: 0, y: 0 });
    setShineStyle({ opacity: 0, x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-panel rounded-2xl p-6 sm:p-8 overflow-hidden relative group transition-all duration-300 ease-out select-none",
        className
      )}
      style={{
        transform: hoverEffect
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`
          : undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 3D Glass Light Shine Reflection Layer */}
      {hoverEffect && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
          style={{
            opacity: shineStyle.opacity,
            background: `radial-gradient(circle 180px at ${shineStyle.x}% ${shineStyle.y}%, rgba(255, 255, 255, 0.35), transparent)`,
          }}
        />
      )}

      {/* Subtle top left ambient glow on hover */}
      {hoverEffect && (
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-radial-gradient(circle, rgba(212,175,55,0.06)_0%, transparent_70%) opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      )}
      
      {/* Parallax Content Container (Lifts items 30px off the glass backing!) */}
      <div 
        className="relative z-10" 
        style={{ 
          transform: hoverEffect ? "translateZ(30px)" : undefined,
          transformStyle: "preserve-3d"
        }}
      >
        {children}
      </div>
    </div>
  );
}
