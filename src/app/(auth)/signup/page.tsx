"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import useAuth from "@/hooks/useAuth";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password strength logic
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Empty", color: "bg-border", percent: "w-0" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: "Weak", color: "bg-red-500", percent: "w-1/3" };
    if (score <= 4) return { score, label: "Medium", color: "bg-yellow-500", percent: "w-2/3" };
    return { score, label: "Strong", color: "bg-green-500", percent: "w-full" };
  };

  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const res = await signup(name, email);
    if (res.success) {
      // Auto redirects to dashboard on signup success
      router.push("/dashboard");
    } else {
      setErrorMsg(res.error || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-sans tracking-tight text-foreground">
          Create account
        </h1>
        <p className="text-sm text-muted-foreground">
          Get started with CareerNav today.
        </p>
      </div>

      {/* Alert box */}
      {errorMsg && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger/10 border border-danger/25 text-danger text-xs animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary-foreground" htmlFor="name">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rayyan Millionaire"
              className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200"
            />
          </div>
        </div>

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
              placeholder="rayyan.officialx@gmail.com"
              className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary-foreground" htmlFor="password">
            Password
          </label>
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

          {/* Password strength gauge */}
          {password && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-muted-foreground">Password strength:</span>
                <span className="font-semibold text-foreground uppercase tracking-wide">
                  {strength.label}
                </span>
              </div>
              <div className="h-1 bg-border rounded-full overflow-hidden">
                <div className={`h-full ${strength.percent} ${strength.color} transition-all duration-300`} />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary-foreground" htmlFor="confirm-password">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 pl-10 pr-4 bg-muted border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 transition-all duration-200"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-4 rounded-md font-sans text-sm font-semibold text-white bg-gradient-to-r from-accent-blue to-accent-purple hover:brightness-110 active:scale-[0.98] shadow-lg shadow-accent-blue/20 disabled:opacity-50 disabled:pointer-events-none transition-all duration-150"
        >
          {isLoading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      {/* Redirect back to Login */}
      <div className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent-blue hover:text-accent-blue/85 transition-colors">
          Sign In
        </Link>
      </div>
    </div>
  );
}
