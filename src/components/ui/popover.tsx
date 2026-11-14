"use client";

import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { cn } from "@/utils/cn";

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PopoverContext = createContext<PopoverContextType>({
  open: false,
  setOpen: () => {},
});

export function Popover({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const next = typeof value === "function" ? value(open) : value;
    if (onOpenChange) onOpenChange(next);
    else setUncontrolledOpen(next);
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block w-full">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild,
  className,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}) {
  const { open, setOpen } = useContext(PopoverContext);

  return (
    <div
      onClick={() => setOpen(!open)}
      className={cn("cursor-pointer w-full", className)}
      aria-expanded={open}
    >
      {children}
    </div>
  );
}

export function PopoverContent({
  children,
  className,
  align = "start",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const { open } = useContext(PopoverContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-2 rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/15 motion-preset-fade motion-preset-slide-up-sm motion-duration-200",
        align === "end"
          ? "right-0"
          : align === "center"
          ? "left-1/2 -translate-x-1/2"
          : "left-0",
        className
      )}
    >
      {children}
    </div>
  );
}
