import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function AuthLayout({ children, title, subtitle }: { children: React.ReactNode, title?: string, subtitle?: string }) {
  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-blue/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md p-6 mx-auto">
        {/* Toast Provider */}
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(var(--card))',
              color: 'hsl(var(--foreground))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
          }} 
        />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={title || 'auth-card'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "w-full bg-card/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[18px] overflow-hidden p-8 flex flex-col gap-6"
            )}
          >
            {title && (
              <div className="text-center space-y-2 mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
              </div>
            )}
            
            {children}
            
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
