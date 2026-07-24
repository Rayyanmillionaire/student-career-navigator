"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Sparkles, TrendingUp, Briefcase, FileText, Target, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen flex w-full bg-white text-[#111827] font-sans selection:bg-[#6366F1]/20">
      
      {/* LEFT PANEL - Form Section */}
      <div className="w-full lg:w-[480px] flex flex-col p-8 sm:p-12 relative z-10 bg-white">
        
        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 mb-16"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-[#6366F1]/20 transition-transform hover:scale-105 cursor-pointer">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-[#111827]">
            CareerNav
          </span>
        </motion.div>

        {/* Dynamic Form Content */}
        <div className="flex-1 flex flex-col justify-center max-w-[400px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-[40px] leading-[48px] font-bold tracking-tight mb-3 text-[#111827]">{title}</h1>
            <p className="text-[#6B7280] text-base mb-10">{subtitle}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-[13px] text-[#6B7280] font-medium flex justify-between items-center"
        >
          <span>© 2026 CareerNav Inc.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#111827] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#111827] transition-colors">Terms</a>
          </div>
        </motion.div>
      </div>

      {/* RIGHT PANEL - Premium Illustration */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-[#F8FAFC]">
        
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.08),rgba(255,255,255,0))]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 w-full h-full opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        {/* Animated Gradient Blobs */}
        <motion.div 
          animate={{ y: [0, -30, 0], scale: [1, 1.05, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[25%] w-[400px] h-[400px] bg-[#6366F1]/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ y: [0, 30, 0], scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[20%] w-[500px] h-[500px] bg-emerald-400/10 rounded-full blur-[120px]"
        />

        {/* Central UI Presentation */}
        <div className="relative z-10 w-full max-w-[600px] aspect-square">
          
          {/* Main Floating Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white/90 backdrop-blur-xl border border-[#E5E7EB] rounded-[24px] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] flex flex-col items-center text-center z-20"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E5E7EB] flex items-center justify-center mb-6 shadow-sm">
              <Sparkles className="w-8 h-8 text-[#6366F1]" />
            </div>
            <h3 className="text-xl font-bold text-[#111827] mb-2">AI-Powered Journey</h3>
            <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
              Track applications, optimize your resume, and prepare for interviews intelligently.
            </p>
            
            <div className="w-full bg-[#F8FAFC] rounded-xl h-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "75%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-xl"
              />
            </div>
            <div className="flex justify-between w-full mt-2 text-[11px] font-medium text-[#6B7280]">
              <span>Profile Strength</span>
              <span className="text-[#6366F1]">75%</span>
            </div>
          </motion.div>

          {/* Floating Feature Cards */}
          <FloatingCard 
            delay={0.4} 
            className="top-[15%] left-[5%] z-10"
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            title="Application Tracking"
            subtitle="Real-time updates"
          />
          <FloatingCard 
            delay={0.6} 
            className="bottom-[20%] left-[10%] z-30"
            icon={<FileText className="w-5 h-5 text-purple-500" />}
            title="Resume AI"
            subtitle="ATS optimized"
          />
          <FloatingCard 
            delay={0.5} 
            className="top-[25%] right-[5%] z-10"
            icon={<Target className="w-5 h-5 text-emerald-500" />}
            title="Interview Prep"
            subtitle="Targeted questions"
          />
          <FloatingCard 
            delay={0.7} 
            className="bottom-[15%] right-[12%] z-30"
            icon={<TrendingUp className="w-5 h-5 text-orange-500" />}
            title="Career Analytics"
            subtitle="Predictive insights"
          />
          
        </div>
      </div>
    </div>
  );
}

function FloatingCard({ icon, title, subtitle, className, delay }: { icon: React.ReactNode, title: string, subtitle: string, className: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, type: "spring", bounce: 0.4 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={cn("absolute bg-white/90 backdrop-blur-md border border-[#E5E7EB] rounded-[16px] p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.08)] flex items-center gap-4 cursor-default", className)}
    >
      <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center border border-[#E5E7EB]">
        {icon}
      </div>
      <div>
        <h4 className="text-[13px] font-bold text-[#111827]">{title}</h4>
        <p className="text-[11px] font-medium text-[#6B7280]">{subtitle}</p>
      </div>
    </motion.div>
  );
}
