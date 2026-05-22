import { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn("max-w-[1400px] mx-auto w-full p-2 px-4 sm:px-6 lg:px-8 relative z-10", className)}>
      {children}
    </div>
  );
}
