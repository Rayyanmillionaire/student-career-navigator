import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ isLoading, loadingText, children, className, disabled, ...props }: LoadingButtonProps) {
  return (
    <motion.button
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : undefined}
      disabled={disabled || isLoading}
      className={cn(
        "relative w-full h-11 rounded-md font-sans text-sm font-bold text-white shadow-lg overflow-hidden transition-all duration-200",
        disabled || isLoading
          ? "opacity-70 cursor-not-allowed bg-accent-blue/80 shadow-none"
          : "bg-gradient-to-r from-accent-blue to-accent-purple hover:brightness-110 shadow-accent-blue/20",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Loader2 className="w-4.5 h-4.5 animate-spin" />
          </motion.div>
        )}
        <span>{isLoading && loadingText ? loadingText : children}</span>
      </div>
    </motion.button>
  );
}
