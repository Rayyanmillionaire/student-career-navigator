"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Compass } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";
import Navbar from "@/components/navbar";
import MobileNav from "@/components/mobile-nav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Protection Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // Handle mobile screen size sidebar collapse states
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsSidebarCollapsed(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // trigger initial state
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile slide menu on path updates
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        {/* Double spinning rings loading state */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-accent-blue/20 border-t-accent-blue animate-spin" />
          <div className="absolute inset-1.5 rounded-full border-2 border-accent-purple/20 border-t-accent-purple animate-spin [animation-duration:0.6s] [animation-direction:reverse]" />
        </div>
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest font-mono">
          Hydrating Workspace
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar - Desktop Layout */}
      <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />

      {/* Sidebar - Mobile Sliding Overlay Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop filter blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide drawer menu */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-72 bg-card border-r border-border h-full relative z-10 p-5 flex flex-col justify-between"
            >
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-accent-blue" />
                    <span className="font-bold text-base bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
                      CareerNav
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-7 h-7 rounded-md border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Mobile Drawer Menu Content */}
                <div className="flex flex-col gap-4 text-left">
                  <Link href="/dashboard" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Home Dashboard</Link>
                  <Link href="/roadmaps" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Roadmaps</Link>
                  <Link href="/skills" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Skills Tracker</Link>
                  <Link href="/resume" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Resume Builder</Link>
                  <Link href="/internships" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Applications Board</Link>
                  <Link href="/certifications" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Certifications</Link>
                  <div className="border-t border-white/5 my-2" />
                  <Link href="/goals" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Goals Calendar</Link>
                  <Link href="/productivity" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Productivity Suite</Link>
                  <Link href="/analytics" className="text-sm font-semibold hover:text-accent-blue px-2 py-1.5 rounded transition-colors">Performance Analytics</Link>
                  {user?.role === "admin" && (
                    <Link href="/admin" className="text-sm font-bold text-accent-purple bg-accent-purple/5 px-2 py-1.5 rounded transition-colors">Admin Portal</Link>
                  )}
                </div>
              </div>

              {/* Drawer footer info */}
              <div className="text-[10px] text-muted-foreground border-t border-white/5 pt-4">
                Connected as {user?.email}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Page Layout Section */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300 min-h-screen",
          "md:pl-[260px]",
          isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-[260px]"
        )}
      >
        {/* Top Navbar */}
        <Navbar
          onMenuClick={() => setIsMobileMenuOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Content Slot Panel */}
        <main className="flex-1 pt-16 p-6 sm:p-8 lg:p-10 pb-24 md:pb-8 flex flex-col justify-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Navigation Capsule */}
        <MobileNav />
      </div>
    </div>
  );
}
