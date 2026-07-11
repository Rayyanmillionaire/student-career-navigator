"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link" | "gradient" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", magnetic = false, children, ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Spring physics configuration for magnetic offsets
    const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
    const x = useSpring(0, springConfig);
    const y = useSpring(0, springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magnetic || !buttonRef.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
      
      // Calculate cursor offsets from the center of the button
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      // Magnetic pull limits (max 10px translate)
      const pullX = (clientX - centerX) * 0.35;
      const pullY = (clientY - centerY) * 0.35;

      const maxPull = 12;
      const clampedX = Math.max(-maxPull, Math.min(maxPull, pullX));
      const clampedY = Math.max(-maxPull, Math.min(maxPull, pullY));

      x.set(clampedX);
      y.set(clampedY);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    // Class styles based on Design Bible
    const variantStyles = {
      default: "bg-muted text-foreground border border-border hover:bg-accent hover:text-accent-foreground",
      outline: "bg-transparent text-foreground border border-border hover:border-white/20 hover:bg-white/5",
      ghost: "bg-transparent text-muted-foreground hover:bg-white/5 hover:text-foreground",
      link: "bg-transparent text-accent-blue underline-offset-4 hover:underline p-0 border-none",
      gradient: "bg-gradient-to-r from-accent-blue to-accent-purple text-white shadow-lg shadow-accent-blue/15 hover:brightness-110 border-none",
      danger: "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
      success: "bg-success/10 text-success border border-success/20 hover:bg-success/20",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    const baseClass = cn(
      "inline-flex items-center justify-center rounded-md font-medium select-none transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-accent-blue/30 focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
      variantStyles[variant],
      variant !== "link" ? sizeStyles[size] : "",
      className
    );

    if (magnetic) {
      return (
        <motion.button
          ref={(node) => {
            buttonRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          style={{ x, y }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={baseClass}
          {...(props as any)}
        >
          <motion.span
            animate={{ scale: isHovered ? 1.015 : 1 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            {children}
          </motion.span>
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={baseClass} {...props}>
        <span className="flex items-center gap-1.5">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
