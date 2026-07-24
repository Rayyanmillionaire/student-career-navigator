import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        <label className="text-[14px] font-medium text-[#6B7280]">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" } as any)}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full h-[56px] bg-white border border-[#D1D5DB] rounded-[14px] px-4 py-4 text-[16px] text-[#111827] placeholder:text-[#9CA3AF] outline-none transition-all duration-200",
              "hover:border-[#9CA3AF]",
              "focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10",
              icon && "pl-11",
              error && "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/10 hover:border-[#EF4444]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[#EF4444] text-[13px] font-medium mt-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);
TextInput.displayName = "TextInput";
