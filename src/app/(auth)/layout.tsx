"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel: Form Container */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:flex-none lg:w-[480px] xl:w-[540px] border-r border-border bg-card/20 backdrop-blur-md">
        {/* Header Branding */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/20 group-hover:scale-105 transition-transform duration-300">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              CareerNav
            </span>
          </Link>
        </div>

        {/* Center content: Form slot */}
        <main className="my-auto py-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
            className="w-full max-w-[400px] mx-auto"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer info */}
        <div className="text-xs text-muted-foreground text-center lg:text-left mt-auto">
          &copy; {new Date().getFullYear()} CareerNav. Built for student career acceleration.
        </div>
      </div>

      {/* Right panel: High-Fidelity App Dashboard Mockup (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-background relative overflow-hidden">
        {/* Mesh Background Lights */}
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] bg-accent-purple/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Clean Line Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Floating Mockup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, rotateY: -8, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, rotateY: -4, rotateX: 3 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          className="w-[560px] h-[420px] rounded-xl border border-white/5 bg-card/60 shadow-2xl backdrop-blur-2xl p-6 relative flex flex-col justify-between hover:border-white/10 hover:shadow-accent-blue/5 transition-colors duration-500"
        >
          {/* Mockup Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/30" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/30" />
              <span className="w-3 h-3 rounded-full bg-green-500/30" />
            </div>
            <div className="text-[11px] font-mono text-muted-foreground bg-white/5 px-2.5 py-1 rounded">
              app.careernav.edu/dashboard
            </div>
            <div className="w-4" />
          </div>

          {/* Mockup Content Grid */}
          <div className="grid grid-cols-3 gap-4 my-6 flex-1 text-left">
            {/* Bento Card 1 */}
            <div className="col-span-2 rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono tracking-wider text-muted uppercase">Target Career Path</div>
                <div className="text-sm font-bold text-foreground mt-1">Full Stack Engineer</div>
              </div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-gradient-to-r from-accent-blue to-accent-purple h-full w-[70%]" />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">Level 7 of 10 steps completed</div>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-accent-purple/40 flex items-center justify-center text-accent-purple text-xs font-bold font-mono">
                85%
              </div>
              <div className="text-[10px] text-muted-foreground mt-2 text-center">Profile Completion</div>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 text-center">
              <div className="text-lg font-bold text-foreground">15</div>
              <div className="text-[10px] text-muted-foreground">Skills Mastered</div>
            </div>

            {/* Bento Card 4 */}
            <div className="col-span-2 rounded-lg border border-white/5 bg-white/[0.02] p-4 flex justify-between items-center">
              <div>
                <div className="text-[10px] text-muted-foreground">Recent Accomplishment</div>
                <div className="text-xs font-bold mt-0.5">Landed Frontend Internship</div>
              </div>
              <span className="text-[9px] font-bold text-success bg-success/15 px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          </div>

          {/* Mockup Footer */}
          <div className="flex justify-between items-center text-[10px] text-muted-foreground border-t border-white/5 pt-4">
            <span>Powered by AI suggestions</span>
            <span>Syncing database...</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
