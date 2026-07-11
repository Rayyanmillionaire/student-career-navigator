"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Map,
  FileText,
  Briefcase,
  BarChart3,
  Award,
  Calendar,
  CheckCircle,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Animated counters state
  const [stats, setStats] = useState({ students: 0, internships: 0, roadmaps: 0 });

  useEffect(() => {
    // Simple count-up effect
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      setStats({
        students: Math.min(50000, Math.floor((50000 / steps) * step)),
        internships: Math.min(1200, Math.floor((1200 / steps) * step)),
        roadmaps: Math.min(350, Math.floor((350 / steps) * step)),
      });

      if (step >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: "Is CareerNav completely free?",
      a: "Yes! CareerNav is free for individual students. We offer curated roadmaps, resume tools, and career trackers at zero cost to accelerate your professional journey.",
    },
    {
      q: "Does my data sync automatically?",
      a: "Absolutely. All your achievements, skills, and goals sync in real-time with our secure cloud database, so you can access your profile from any device.",
    },
    {
      q: "Can I build ATS-friendly resumes?",
      a: "Yes, our resume builder is specifically designed to output PDF layouts that comply with standard Applicant Tracking Systems (ATS), optimizing your chances.",
    },
    {
      q: "How do roadmaps work?",
      a: "Our roadmaps represent curated career paths (like Full Stack Developer or AI Engineer). You can track step-by-step progress, access learning materials, and mark milestones as completed.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-accent-blue/30 select-none">
      {/* 1. Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/75 backdrop-blur-md border-b border-border px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center shadow-lg shadow-accent-blue/15 group-hover:scale-105 transition-transform duration-300">
            <Compass className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-sans font-bold text-base tracking-tight bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
            CareerNav
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="sm">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-8">
        {/* Lights Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-accent-purple/5 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="space-y-4 max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans tracking-tight leading-[1.1] bg-gradient-to-br from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent"
          >
            Navigate Your Career <br />
            <span className="bg-gradient-to-r from-accent-blue via-accent-purple to-accent-blue bg-clip-text text-transparent bg-[size:200%_auto] animate-shimmer">
              With Confidence
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            The all-in-one platform for students to map target careers, build ATS-friendly resumes, log study hours, and track internships.
          </motion.p>
        </div>

        {/* Hero CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button variant="gradient" size="lg" magnetic>
              Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Explore Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* 3D-angled Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="w-full max-w-5xl pt-10"
        >
          <div className="relative group rounded-xl border border-white/5 bg-card/40 p-4 shadow-2xl backdrop-blur-3xl overflow-hidden hover:border-white/10 transition-all duration-500">
            {/* Header info */}
            <div className="flex justify-between items-center border-b border-white/5 pb-3.5 mb-4">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground bg-white/5 px-3 py-0.5 rounded">
                app.careernav.edu/dashboard
              </div>
              <div className="w-4" />
            </div>

            {/* Dashboard Layout mockup */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left">
              {/* Sidebar widget */}
              <div className="hidden md:flex flex-col gap-2 rounded-lg bg-white/[0.01] p-3 border border-white/5">
                <div className="w-full h-8 bg-white/5 rounded-md flex items-center px-2 text-xs font-semibold">Dashboard</div>
                <div className="w-full h-8 bg-transparent rounded-md flex items-center px-2 text-xs text-muted-foreground">Roadmaps</div>
                <div className="w-full h-8 bg-transparent rounded-md flex items-center px-2 text-xs text-muted-foreground">Skills Tracker</div>
                <div className="w-full h-8 bg-transparent rounded-md flex items-center px-2 text-xs text-muted-foreground">Applications</div>
              </div>

              {/* Center Content widgets */}
              <div className="md:col-span-3 space-y-4">
                {/* Greeting banner */}
                <div className="rounded-lg p-5 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 border border-accent-blue/10 flex justify-between items-center">
                  <div>
                    <h3 className="text-base font-bold text-foreground">Welcome back, student! 👋</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Let&apos;s complete your weekly study milestones.</p>
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-accent-blue bg-accent-blue/10 px-2 py-0.5 rounded-full">
                    Streak: 5 Days
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Skill widget */}
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">React JS</span>
                      <Award className="w-4 h-4 text-accent-blue" />
                    </div>
                    <div>
                      <div className="text-xl font-bold font-mono">85%</div>
                      <div className="text-[10px] text-muted mt-1">Proficiency Level</div>
                    </div>
                  </div>

                  {/* Goal widget */}
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Resume Score</span>
                      <FileText className="w-4 h-4 text-accent-purple" />
                    </div>
                    <div>
                      <div className="text-xl font-bold font-mono">92</div>
                      <div className="text-[10px] text-muted mt-1">ATS Optimization Check</div>
                    </div>
                  </div>

                  {/* Internship widget */}
                  <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4 flex flex-col justify-between h-28">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Applications</span>
                      <Briefcase className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <div className="text-xl font-bold font-mono">12</div>
                      <div className="text-[10px] text-muted mt-1">Active Pipeline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 3. Bento Grid Features Section */}
      <section className="py-20 px-6 border-t border-border bg-white/[0.01]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section titles */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Everything you need to succeed
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              A cohesive suite of tools built specifically for student professional growth.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Card 1: Skill Tracker (Large 2x1) */}
            <Card className="md:col-span-2 flex flex-col justify-between h-72 hoverEffect">
              <CardHeader>
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle>Skill Tracker</CardTitle>
                    <CardDescription>Verify your tech proficiencies dynamically.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between flex-1 gap-8">
                {/* Left side detail */}
                <div className="text-left text-xs text-muted-foreground space-y-1.5 max-w-sm mb-4">
                  <p>Define proficiency sliders directly in your dashboard. Set custom target milestones and earn verified status badges automatically once goals are reached.</p>
                </div>
                {/* Right side graphical mock */}
                <div className="w-48 bg-white/[0.02] border border-white/5 rounded-lg p-3 space-y-2.5 text-left shrink-0">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span>TypeScript</span>
                      <span>80%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-accent-blue h-full w-[80%]" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span>Tailwind CSS</span>
                      <span>95%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="bg-accent-purple h-full w-[95%]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 2: Resume Builder (1x1) */}
            <Card className="h-72 hoverEffect flex flex-col justify-between">
              <CardHeader>
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle>Resume Builder</CardTitle>
                    <CardDescription>ATS-friendly A4 layouts.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1 pb-8">
                {/* A4 Paper mockup graphic */}
                <div className="w-28 h-36 border border-white/10 bg-white/5 rounded shadow-lg p-2.5 space-y-2 relative overflow-hidden select-none">
                  {/* Header mock lines */}
                  <div className="w-1/2 h-1.5 bg-foreground/60 rounded" />
                  <div className="w-2/3 h-1 bg-muted-foreground/30 rounded" />
                  <div className="h-px bg-white/5 my-1" />
                  {/* Content mock lines */}
                  <div className="space-y-1">
                    <div className="w-full h-1 bg-muted-foreground/20 rounded" />
                    <div className="w-full h-1 bg-muted-foreground/20 rounded" />
                    <div className="w-4/5 h-1 bg-muted-foreground/20 rounded" />
                  </div>
                  {/* PDF Badge watermark */}
                  <div className="absolute bottom-2 right-2 text-[8px] font-mono font-bold text-accent-purple bg-accent-purple/10 px-1 rounded">
                    PDF
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 3: Roadmaps (1x1) */}
            <Card className="h-72 hoverEffect flex flex-col justify-between">
              <CardHeader>
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
                    <Map className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle>Learning Roadmaps</CardTitle>
                    <CardDescription>Curated path timelines.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center flex-1 pb-8">
                {/* Timeline node Mock */}
                <div className="flex flex-col items-center gap-1.5 select-none relative">
                  <div className="w-2 h-8 border-l-2 border-dashed border-white/10" />
                  <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-success/20">
                    ✓
                  </div>
                  <div className="text-[10px] font-semibold text-foreground">Beginner Path</div>
                  <div className="w-2 h-6 border-l-2 border-dashed border-white/10" />
                  <div className="w-3 h-3 rounded-full border-2 border-accent-blue bg-background animate-pulse" />
                  <div className="text-[10px] text-muted-foreground">Frameworks</div>
                </div>
              </CardContent>
            </Card>

            {/* Bento Card 4: Analytics (Large 2x1) */}
            <Card className="md:col-span-2 flex flex-col justify-between h-72 hoverEffect">
              <CardHeader>
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue">
                    <BarChart3 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Analyze your daily learning schedules.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-end justify-between flex-1 gap-8">
                {/* Left side details */}
                <div className="text-left text-xs text-muted-foreground space-y-1.5 max-w-sm mb-4">
                  <p>Observe studied hours patterns and application pipelines over time using clean, modern Recharts dashboards. Track streaks dynamically and stay focused on milestones.</p>
                </div>
                {/* Right side mock line chart */}
                <div className="w-48 h-28 border border-white/5 bg-white/[0.01] rounded-lg p-2 flex items-end justify-between gap-1.5 shrink-0 select-none">
                  <div className="w-4 bg-accent-blue/10 hover:bg-accent-blue/20 rounded-t h-[40%] transition-all" />
                  <div className="w-4 bg-accent-blue/10 hover:bg-accent-blue/20 rounded-t h-[65%] transition-all" />
                  <div className="w-4 bg-gradient-to-t from-accent-blue to-accent-purple rounded-t h-[85%] transition-all shadow-lg" />
                  <div className="w-4 bg-accent-blue/10 hover:bg-accent-blue/20 rounded-t h-[50%] transition-all" />
                  <div className="w-4 bg-accent-blue/10 hover:bg-accent-blue/20 rounded-t h-[70%] transition-all" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Stats Counter Row */}
      <section className="py-16 px-6 bg-gradient-to-r from-accent-blue/5 to-accent-purple/5 border-t border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center select-none">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              {stats.students.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Students</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              {stats.internships.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Applications Landed</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
              {stats.roadmaps.toLocaleString()}+
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Curated Roadmaps</div>
          </div>
        </div>
      </section>

      {/* 5. FAQs Accordion Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto w-full space-y-10">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">Answers to common platform details.</p>
        </div>

        <div className="space-y-3.5 text-left">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-border bg-card/30 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-5 text-sm font-semibold text-foreground hover:bg-white/[0.01] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-300",
                    activeFaq === i ? "rotate-180 text-foreground" : ""
                  )}
                />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden bg-white/[0.005]"
                  >
                    <div className="p-5 pt-0 text-xs text-secondary leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Landing Page Footer */}
      <footer className="mt-auto bg-card border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left select-none">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-accent-blue" />
            <span className="font-bold text-base bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent">
              CareerNav
            </span>
          </div>
          
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} CareerNav. All rights reserved.
          </div>

          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all" aria-label="GitHub">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 active:scale-95 transition-all" aria-label="LinkedIn">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
