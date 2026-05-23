import { InputHTMLAttributes, forwardRef, useState } from "react";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="font-heading text-xs uppercase tracking-widest text-[#d4af37]/75 font-semibold">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            type={actualType}
            ref={ref}
            className={cn(
              "w-full px-4 py-3 bg-[#0a0a0d] border border-white/5 hover:border-white/10 rounded-xl font-medium text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/30 transition-all duration-300",
              isPassword && "pr-11",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#d4af37] transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4.5 h-4.5" />
              ) : (
                <Eye className="w-4.5 h-4.5" />
              )}
            </button>
          )}
        </div>
        {error && <span className="text-[10px] font-semibold tracking-wide text-red-400">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
