"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-[14px] font-medium text-[#6B7280]">
          {label}
        </label>
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
              {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" } as any)}
            </div>
          )}
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors outline-none"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
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
PasswordInput.displayName = "PasswordInput";
