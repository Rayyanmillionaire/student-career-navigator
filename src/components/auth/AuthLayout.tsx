"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, CheckCircle2, TrendingUp, Briefcase } from "lucide-react";

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
    <div className="min-h-screen flex w-full bg-white text-gray-900 font-sans selection:bg-blue-100">
      
      {/* LEFT PANEL - Form Section */}
      <div className="w-full lg:w-[480px] flex flex-col justify-between p-8 sm:p-12 border-r border-gray-200 bg-white relative z-10 shadow-2xl shadow-gray-200/50">
        
        {/* Brand Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Compass className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Student Career Navigator
          </span>
        </motion.div>

        {/* Dynamic Form Content */}
        <div className="flex-1 flex flex-col justify-center mt-12 mb-8 max-w-[400px] w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">{title}</h1>
            <p className="text-gray-500 text-sm mb-8">{subtitle}</p>
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
          className="text-xs text-gray-400 font-medium tracking-wide"
        >
          © 2026 CareerNav Inc. • Secured by AES-256
        </motion.div>
      </div>

      {/* RIGHT PANEL - Premium Light Theme Branding Presentation */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-slate-50">
        
        {/* Background Gradients & Textures */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        {/* Floating Abstract Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[300px] h-[300px] bg-blue-400/20 rounded-full blur-[80px]"
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px]"
        />

        {/* Central Presentation Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
          className="relative z-10 max-w-[500px] w-full mx-8"
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] text-center relative overflow-hidden">
            {/* Glossy highlight */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 shadow-sm mb-6">
              <TrendingUp className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Elevate Your Career Trajectory
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Join thousands of top-tier students landing their dream roles at Fortune 500 companies through our intelligent application tracking platform.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col gap-3">
              <FeaturePill icon={<CheckCircle2 className="w-4 h-4 text-emerald-500" />} text="AI-Powered Resume Optimization" />
              <FeaturePill icon={<Briefcase className="w-4 h-4 text-blue-500" />} text="Real-time Application Tracking" />
              <FeaturePill icon={<TrendingUp className="w-4 h-4 text-purple-500" />} text="Predictive Salary Analytics" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, x: 5 }}
      className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl shadow-sm cursor-default transition-colors hover:border-blue-100"
    >
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-100">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </motion.div>
  );
}
