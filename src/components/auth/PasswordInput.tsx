import React, { forwardRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Eye, EyeOff, Keyboard } from 'lucide-react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockActive, setCapsLockActive] = useState(false);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.getModifierState) {
          setCapsLockActive(e.getModifierState('CapsLock'));
        }
      };
      
      if (isFocused) {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyDown);
      }
      
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyDown);
      };
    }, [isFocused]);

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value.length > 0);
      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue || (props.value && String(props.value).length > 0) || props.defaultValue;

    return (
      <div className="w-full relative group">
        <div className="relative">
          {/* Animated Background Border / Glow */}
          <div 
            className={cn(
              "absolute inset-0 rounded-[14px] transition-all duration-300 pointer-events-none",
              isFocused && !error ? "ring-2 ring-accent-blue/30 scale-[1.02]" : "scale-100",
              error && isFocused ? "ring-2 ring-danger/30 scale-[1.02]" : ""
            )}
          />

          {icon && (
            <div className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 z-10 pointer-events-none", 
              isFocused ? "text-accent-blue" : "text-muted-foreground", 
              error && "text-danger"
            )}>
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
            onBlur={handleBlur}
            onChange={handleChange}
            className={cn(
              "peer w-full h-[52px] bg-background dark:bg-zinc-900 border text-sm text-foreground transition-all duration-300 focus:outline-none rounded-[14px] relative z-0",
              icon ? "pl-[44px] pr-12" : "px-4 pr-12",
              isFloating ? "pt-4 pb-0" : "py-0",
              error 
                ? "border-danger focus:border-danger bg-danger/5" 
                : "border-border hover:border-border/80 focus:border-accent-blue",
              className
            )}
            placeholder={isFocused ? props.placeholder : ""}
            {...props}
          />

          <label 
            className={cn(
              "absolute left-0 transition-all duration-300 pointer-events-none z-10",
              icon ? "left-[44px]" : "left-4",
              isFloating 
                ? "top-2 text-[10px] font-semibold tracking-wide uppercase text-muted-foreground" 
                : "top-1/2 -translate-y-1/2 text-[14px] text-muted-foreground",
              isFocused && !error ? "text-accent-blue" : "",
              error && isFocused ? "text-danger" : ""
            )}
          >
            {label}
          </label>

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 z-10 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 rounded-md"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {capsLockActive && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center gap-1.5 text-warning text-[12px] font-medium px-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Caps Lock is ON</span>
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              className="flex items-center gap-1.5 text-danger text-[12px] font-medium px-1"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
