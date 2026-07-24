import React, { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-xs font-medium text-secondary-foreground" htmlFor={props.id}>
          {label}
        </label>
        <div className="relative">
          {icon && (
            <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200", isFocused ? "text-accent-blue" : "text-muted-foreground", error && "text-danger")}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full h-10 bg-muted/50 border rounded-md text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2",
              icon ? "pl-10 pr-4" : "px-4",
              error 
                ? "border-danger focus:border-danger focus:ring-danger/20" 
                : "border-border focus:border-accent-blue focus:ring-accent-blue/20 focus:bg-background",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mt-1 text-danger text-[11px] font-medium"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </motion.div>
        )}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';
