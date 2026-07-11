"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowLeft } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Toggle Forgot Password instruction view
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || "Invalid email or password.");
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showForgotPassword ? (
          /* LOGIN FORM VIEW */
          <motion.div
            key="login-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to navigate your learning journey.
              </p>
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Forms */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-secondary-foreground" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200"
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-secondary-foreground" htmlFor="password">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium text-accent-blue hover:text-accent-blue/80 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-10 pr-10 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Submit btn */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 mt-2 rounded-md font-sans text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent-blue/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Signup redirects */}
            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-accent-blue hover:text-accent-blue/85 transition-colors">
                Sign Up
              </Link>
            </div>


          </motion.div>
        ) : (
          /* FORGOT PASSWORD INSTRUCTION VIEW */
          <motion.div
            key="forgot-password"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Back Button */}
            <button
              onClick={() => setShowForgotPassword(false)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to Sign In</span>
            </button>

            {/* Icon Block */}
            <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center text-accent-blue">
              <KeyRound className="w-6 h-6" />
            </div>

            {/* Header */}
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold font-sans tracking-tight text-foreground">
                Reset your password
              </h2>
              <p className="text-sm text-muted-foreground">
                Secure credential management is enforced.
              </p>
            </div>

            {/* System Info Callout */}
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] text-sm text-secondary leading-relaxed">
              Forgot your password? Please contact your college administrator to reset it directly from the Admin Portal.
            </div>

            {/* Action instructions */}
            <p className="text-xs text-muted-foreground leading-relaxed">
              To prevent security locks, your administrator will verify your profile details and perform a password overwrite. After the reset, log back in using the default passcode provided.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
