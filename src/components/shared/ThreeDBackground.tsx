"use client";

import { useEffect, useRef } from "react";

export default function ThreeDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      z: number; // 3D depth coordinate
      vx: number;
      vy: number;
      vz: number;
      radius: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse coordinates tracker
    const mouse = { x: -1000, y: -1000, radius: 180 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Populate particles based on viewport area
    const particleCount = Math.min(75, Math.floor((window.innerWidth * window.innerHeight) / 22000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 800 + 200, // Z depth plane
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        vz: (Math.random() - 0.5) * 0.15,
        radius: Math.random() * 1.5 + 0.6,
        color: Math.random() > 0.65 ? "212, 175, 55" : "183, 110, 121", // Luxury gold vs rose gold theme
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Increment coordinate values
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        // Bounce bounds inside canvas
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        if (p.z < 200 || p.z > 1000) p.vz *= -1;

        // 3D Perspective Projection calculation
        const perspective = 500;
        const scale = perspective / (perspective + p.z);
        const projX = (p.x - canvas.width / 2) * scale + canvas.width / 2;
        const projY = (p.y - canvas.height / 2) * scale + canvas.height / 2;
        const projRadius = p.radius * scale * 3.5;

        // Interactive mouse avoidance physics in 2D projected coordinates
        const dx = projX - mouse.x;
        const dy = projY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let shiftX = 0;
        let shiftY = 0;

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          // Deeper nodes shift slightly less to maintain parallax perception
          const multiplier = force * 20 * scale; 
          shiftX = (dx / dist) * multiplier;
          shiftY = (dy / dist) * multiplier;
        }

        // Draw particle with scale and z-depth opacity
        const opacity = Math.min(0.65, Math.max(0.08, scale * 1.2));
        ctx.beginPath();
        ctx.arc(projX + shiftX, projY + shiftY, projRadius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${opacity})`;
        ctx.fill();

        // Trace connections to other projected nodes close in Z-depth
        particles.forEach((other) => {
          if (p === other) return;
          const otherScale = perspective / (perspective + other.z);
          const otherProjX = (other.x - canvas.width / 2) * otherScale + canvas.width / 2;
          const otherProjY = (other.y - canvas.height / 2) * otherScale + canvas.height / 2;

          const ldx = projX - otherProjX;
          const ldy = projY - otherProjY;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);

          // Connection rule: closer particles of similar depth connect
          if (ldist < 140 && Math.abs(p.z - other.z) < 180) {
            const linkOpacity = (1 - ldist / 140) * 0.045 * Math.min(opacity, otherScale);
            ctx.beginPath();
            ctx.moveTo(projX + shiftX, projY + shiftY);
            ctx.lineTo(otherProjX, otherProjY);
            ctx.strokeStyle = `rgba(212, 175, 55, ${linkOpacity})`;
            ctx.lineWidth = 0.6 * scale;
            ctx.stroke();
          }
        });
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
