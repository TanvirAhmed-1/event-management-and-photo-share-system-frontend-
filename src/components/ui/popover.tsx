"use client";

import React, { useState, useRef, useEffect, createContext, useContext, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/utils/cn";

interface PopoverContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextType>({
  open: false,
  setOpen: () => {},
  triggerRef: { current: null },
  contentRef: { current: null },
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

  const setOpen: React.Dispatch<React.SetStateAction<boolean>> = useCallback(
    (value) => {
      const next = typeof value === "function" ? value(open) : value;
      if (onOpenChange) onOpenChange(next);
      else setUncontrolledOpen(next);
    },
    [open, onOpenChange]
  );

  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        (!contentRef.current || !contentRef.current.contains(target))
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, setOpen]);

  return (
    <PopoverContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      <div ref={triggerRef} className="relative inline-block w-full">
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({
  children,
  asChild: _asChild,
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
  const { open, triggerRef, contentRef } = useContext(PopoverContext);
  const [coords, setCoords] = useState<{ top: number; left: number; openUp: boolean } | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 340 && rect.top > 340;

    let left = rect.left;
    if (align === "center") left = rect.left + rect.width / 2;
    if (align === "end") left = rect.right;

    setCoords({
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      left: Math.max(12, Math.min(left, window.innerWidth - 320)),
      openUp,
    });
  }, [align, triggerRef]);

  useEffect(() => {
    if (!open) {
      setCoords(null);
      return;
    }
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  if (!open || typeof document === "undefined" || !coords) return null;

  return createPortal(
    <div
      ref={contentRef}
      style={{
        position: "fixed",
        top: coords.top,
        left: coords.left,
        transform: coords.openUp
          ? align === "center"
            ? "translate(-50%, -100%)"
            : "translateY(-100%)"
          : align === "center"
          ? "translateX(-50%)"
          : undefined,
      }}
      className={cn(
        "z-[9999] rounded-2xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 motion-preset-fade motion-duration-150",
        className
      )}
    >
      {children}
    </div>,
    document.body
  );
}
