"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface SheetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error("Sheet components must be used within <Sheet>");
  }
  return ctx;
}

interface SheetProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sheet({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: SheetProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children: React.ReactNode;
}

export function SheetTrigger({
  asChild = false,
  children,
  onClick,
  ...props
}: SheetTriggerProps) {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...props,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props?.onClick?.(e);
        setOpen(true);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  children?: React.ReactNode;
}

export function SheetClose({
  asChild = false,
  children,
  onClick,
  ...props
}: SheetCloseProps) {
  const { setOpen } = useSheetContext();

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...props,
      onClick: (e: React.MouseEvent<HTMLElement>) => {
        child.props?.onClick?.(e);
        setOpen(false);
      },
    });
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        setOpen(false);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

type SheetSide = "left" | "right" | "top" | "bottom";

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: SheetSide;
  hideCloseButton?: boolean;
}

const SIDE_CLASSES: Record<SheetSide, string> = {
  right:
    "inset-y-0 right-0 h-full w-[90vw] sm:max-w-md border-l border-slate-200 motion-preset-slide-left-md motion-duration-300 motion-ease-spring-smooth",
  left:
    "inset-y-0 left-0 h-full w-[85vw] sm:max-w-xs border-r border-slate-200 motion-preset-slide-right-md motion-duration-300 motion-ease-spring-smooth",
  top: "inset-x-0 top-0 w-full border-b border-slate-200 motion-preset-slide-down-md motion-duration-300",
  bottom: "inset-x-0 bottom-0 w-full border-t border-slate-200 motion-preset-slide-up-md motion-duration-300",
};

export function SheetContent({
  side = "right",
  className,
  hideCloseButton = false,
  children,
  ...props
}: SheetContentProps) {
  const { open, setOpen } = useSheetContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, setOpen]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity motion-preset-fade motion-duration-200"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed z-50 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-out overflow-y-auto",
          SIDE_CLASSES[side],
          className
        )}
        {...props}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 px-6 pt-6 pb-4 border-b border-slate-100 text-left",
        className
      )}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn("text-lg font-extrabold text-[#172554] tracking-tight", className)}
      {...props}
    />
  );
}

export function SheetDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 leading-relaxed", className)} {...props} />
  );
}

export function SheetFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 px-6 py-4 border-t border-slate-100 bg-slate-50/70",
        className
      )}
      {...props}
    />
  );
}
