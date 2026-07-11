"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, glowEffect = false, children, ...props }, ref) => {
    const cardClass = cn(
      "rounded-lg border border-border bg-card/60 text-card-foreground shadow-md backdrop-blur-xl relative overflow-hidden transition-all duration-300",
      hoverEffect ? "hover:border-white/10 hover:shadow-lg hover:-translate-y-1 hover:shadow-black/20" : "",
      className
    );

    if (hoverEffect || glowEffect) {
      return (
        <motion.div
          ref={ref}
          whileHover={hoverEffect ? { y: -4, scale: 1.005 } : undefined}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={cardClass}
          {...(props as any)}
        >
          {glowEffect && (
            <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-500 bg-[radial-gradient(400px_circle_at_var(--mouse-x,0)_var(--mouse-y,0),rgba(59,130,246,0.06),transparent_80%)]" />
          )}
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={cardClass} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 border-t border-white/5 mt-4", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";
