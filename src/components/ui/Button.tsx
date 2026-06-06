import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-heading font-semibold uppercase tracking-wider text-xs transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98] cursor-pointer";

  const variants = {
    primary:
      "bg-gold-gradient text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:brightness-105",
    secondary:
      "glass-panel border border-[#d4af37]/25 text-white hover:border-[#d4af37]/50 hover:bg-white/5",
    danger:
      "bg-red-650 hover:bg-red-700 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]",
    ghost:
      "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-sm",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
