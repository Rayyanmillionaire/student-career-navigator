import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);

    // Caps lock detection
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.getModifierState('CapsLock')) {
          setCapsLockOn(true);
        } else {
          setCapsLockOn(false);
        }
      };
      
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 'CapsLock') {
          setCapsLockOn(e.getModifierState('CapsLock'));
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

    return (
      <div className="space-y-1.5 w-full">
        <label className="text-xs font-medium text-secondary-foreground flex justify-between" htmlFor={props.id}>
          <span>{label}</span>
          {capsLockOn && isFocused && (
            <span className="text-warning text-[10px] uppercase font-bold animate-pulse">Caps Lock is ON</span>
          )}
        </label>
        <div className="relative">
          {icon && (
            <div className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-colors duration-200", isFocused ? "text-accent-blue" : "text-muted-foreground", error && "text-danger")}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "w-full h-10 bg-muted/50 border rounded-md text-sm text-foreground placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 pr-10",
              icon ? "pl-10" : "pl-4",
              error 
                ? "border-danger focus:border-danger focus:ring-danger/20" 
                : "border-border focus:border-accent-blue focus:ring-accent-blue/20 focus:bg-background",
              className
            )}
            {...props}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
          </button>
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
PasswordInput.displayName = 'PasswordInput';
