import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="font-heading text-xs uppercase tracking-widest text-[#d4af37]/75 font-semibold">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 hover:border-white/10 rounded-xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/30 transition-all duration-300",
            error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-[10px] font-semibold tracking-wide text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
