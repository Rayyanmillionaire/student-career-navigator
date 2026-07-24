"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { Briefcase, BarChart, CheckCircle2, TrendingUp, Sparkles, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-background relative flex w-full overflow-hidden selection:bg-accent-blue/30 selection:text-foreground">
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
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            fontWeight: 500,
            fontSize: '14px',
          },
        }} 
      />

      {/* Left Column: Auth Section */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 min-h-screen bg-background/50 backdrop-blur-3xl">
        {/* Subtle dynamic background gradient strictly for the left side */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-[20%] -left-[20%] w-[70%] h-[70%] rounded-full bg-accent-blue/10 blur-[140px] opacity-70" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-accent-purple/10 blur-[140px] opacity-70" />
        </div>

        {/* Auth Content Container */}
        <div className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col justify-center h-full">
          
          {/* Logo / Brand Header */}
          <div className="mb-10 text-center lg:text-left flex flex-col items-center lg:items-start space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 transform group-hover:scale-105 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                CareerNav
              </span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={title || 'auth-card'}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full bg-white/75 dark:bg-card/75 backdrop-blur-2xl border border-black/5 dark:border-white/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] rounded-[24px] p-8 sm:p-10 flex flex-col"
            >
              {(title || subtitle) && (
                <div className="space-y-2 mb-8">
                  {title && <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>}
                  {subtitle && <p className="text-sm text-muted-foreground font-medium leading-relaxed">{subtitle}</p>}
                </div>
              )}
              
              <div className="w-full">
                {children}
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* Right Column: Premium Branding Section */}
      <div className="hidden lg:flex w-1/2 relative bg-zinc-950 items-center justify-center overflow-hidden border-l border-white/5">
        
        {/* Animated Orbs */}
        <div className="absolute inset-0 z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-accent-blue/30 blur-[150px] mix-blend-screen"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              rotate: [0, -90, 0],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] rounded-full bg-accent-purple/30 blur-[150px] mix-blend-screen"
          />
        </div>

        {/* Abstract Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] z-0 mask-image:linear-gradient(to_bottom,transparent,black,transparent)" style={{ WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, #000 40%, transparent 100%)' }} />

        {mounted && (
          <div className="relative z-10 w-full max-w-lg h-[600px] flex items-center justify-center">
            
            {/* Center Main Metric */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="absolute bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl z-20 w-80 text-white flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-purple/30 mb-4">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">AI Resume Score</h3>
              <div className="mt-3 text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">94%</div>
              <p className="text-xs text-white/50 font-medium mt-3 leading-relaxed">Top 5% of candidates for Full-Stack Developer roles</p>
            </motion.div>

            {/* Floating Card 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -50, y: -50 }}
              animate={{ opacity: 1, x: -120, y: -160 }}
              transition={{ duration: 1, delay: 0.4, type: "spring", bounce: 0.4 }}
              className="absolute bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl w-48 text-white z-10"
              style={{ rotate: -6 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="font-semibold text-sm">Growth</div>
              </div>
              <div className="text-2xl font-bold">+28%</div>
              <div className="text-[10px] text-white/50 mt-1">Interview Readiness</div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              initial={{ opacity: 0, x: 50, y: 50 }}
              animate={{ opacity: 1, x: 130, y: 150 }}
              transition={{ duration: 1, delay: 0.6, type: "spring", bounce: 0.4 }}
              className="absolute bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-xl w-52 text-white z-30"
              style={{ rotate: 4 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-accent-blue" />
                </div>
                <div className="font-semibold text-sm">Matches</div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ delay: 1, duration: 1 }} className="h-full bg-accent-blue rounded-full" />
                </div>
                <div className="h-1.5 w-[70%] bg-white/10 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "60%" }} transition={{ delay: 1.2, duration: 1 }} className="h-full bg-accent-purple rounded-full" />
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>

    </div>
  );
}
