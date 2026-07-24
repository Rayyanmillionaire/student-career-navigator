import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
}

export function LoadingButton({
  children,
  isLoading,
  loadingText,
  className,
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      className={cn(
        "relative w-full h-[56px] rounded-xl font-bold text-[16px] text-white transition-all duration-300",
        "bg-gradient-to-r from-[#6366F1] to-[#818CF8]",
        "hover:shadow-[0_8px_20px_-6px_rgba(99,102,241,0.5)] hover:-translate-y-0.5",
        "active:scale-[0.98] active:translate-y-0",
        "disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center gap-2 transition-opacity",
        isLoading ? "opacity-0" : "opacity-100"
      )}>
        {children}
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingText && <span>{loadingText}</span>}
        </div>
      )}
    </button>
  );
}
