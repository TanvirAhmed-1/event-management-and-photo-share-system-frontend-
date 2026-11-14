"use client";

import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/utils/cn";

interface SelectContextType {
  value: string;
  onValueChange: (val: string) => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  labels: Record<string, string>;
  registerLabel: (val: string, label: string) => void;
}

const SelectContext = createContext<SelectContextType>({
  value: "",
  onValueChange: () => {},
  open: false,
  setOpen: () => {},
  labels: {},
  registerLabel: () => {},
});

export function Select({
  value = "",
  onValueChange,
  children,
}: {
  value?: string;
  onValueChange: (val: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const registerLabel = React.useCallback((val: string, label: string) => {
    setLabels((prev) => (prev[val] === label ? prev : { ...prev, [val]: label }));
  }, []);

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
    <SelectContext.Provider
      value={{ value, onValueChange, open, setOpen, labels, registerLabel }}
    >
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open, setOpen } = useContext(SelectContext);

  return (
    <button
      type="button"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2 text-xs font-medium text-[#172554] hover:bg-white focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all cursor-pointer",
        className
      )}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2",
          open && "rotate-180 text-[#7C3AED]"
        )}
      />
    </button>
  );
}

export function SelectValue({ placeholder = "Select an option..." }: { placeholder?: string }) {
  const { value, labels } = useContext(SelectContext);
  const display = value ? labels[value] || value : null;

  return (
    <span className={cn("truncate", !display && "text-slate-400 font-normal")}>
      {display || placeholder}
    </span>
  );
}

export function SelectContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { open } = useContext(SelectContext);
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute left-0 right-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10 motion-preset-fade motion-preset-slide-up-sm motion-duration-150",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: selected, onValueChange, setOpen, registerLabel } =
    useContext(SelectContext);
  const isSelected = selected === value;

  useEffect(() => {
    if (typeof children === "string") {
      registerLabel(value, children);
    }
  }, [value, children, registerLabel]);

  return (
    <button
      type="button"
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors cursor-pointer",
        isSelected
          ? "bg-purple-50 text-[#7C3AED] font-bold"
          : "text-slate-700 hover:bg-slate-50 hover:text-[#172554]",
        className
      )}
    >
      <span className="truncate">{children}</span>
      {isSelected && <Check className="h-3.5 w-3.5 text-[#7C3AED] shrink-0 ml-2" />}
    </button>
  );
}
