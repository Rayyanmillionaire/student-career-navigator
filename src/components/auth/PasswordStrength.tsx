import React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password?: string;
}

export function PasswordStrength({ password = "" }: PasswordStrengthProps) {
  const reqs = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter", met: /[a-z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const score = reqs.filter((r) => r.met).length;
  
  return (
    <div className="mt-3 space-y-3">
      {/* Animated Progress Bar */}
      <div className="h-1.5 w-full bg-[#F3F4F6] rounded-full overflow-hidden flex gap-1">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "h-full flex-1 transition-all duration-500 rounded-full",
              i < score ? "bg-[#22C55E]" : "bg-transparent"
            )}
          />
        ))}
      </div>

      {/* Requirements List */}
      <div className="grid grid-cols-2 gap-y-2">
        {reqs.map((req, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px]">
            {req.met ? (
              <Check className="w-3.5 h-3.5 text-[#22C55E]" />
            ) : (
              <Circle className="w-3 h-3 text-[#9CA3AF]" />
            )}
            <span className={cn(
              "font-medium transition-colors",
              req.met ? "text-[#111827]" : "text-[#6B7280]"
            )}>
              {req.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
