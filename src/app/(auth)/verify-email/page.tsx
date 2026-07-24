"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { MailCheck, RefreshCcw, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "@/components/auth/AuthLayout";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { authService } from "@/lib/authService";
import useAuth from "@/hooks/useAuth";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { user } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (token && !isVerified) {
      verifyToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const verifyToken = async (t: string) => {
    setIsVerifying(true);
    try {
      await authService.verifyEmail(t);
      setIsVerified(true);
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error("Invalid or expired verification link.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    if (cooldown > 0) return;
    
    // In a real app, call API to resend email here
    toast.success("Verification email resent!");
    setCooldown(60); // 60 second cooldown
  };

  if (isVerified) {
    return (
      <AuthLayout title="Success" subtitle="Email Verified">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center space-y-4 py-4"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
            <MailCheck className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">Email Verified!</h2>
          <p className="text-[14px] text-[#6B7280] px-4">
            Your email has been successfully verified. You can now access all features of CareerNav.
          </p>
          <Link 
            href="/dashboard" 
            className="mt-6 w-full h-[56px] bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 transition-colors"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Verify your email" subtitle={`We sent a link to ${user?.email || 'your email address'}.`}>
      <div className="flex flex-col items-center space-y-6 mt-2">
        
        {isVerifying ? (
          <div className="flex flex-col items-center gap-3">
            <RefreshCcw className="w-8 h-8 text-[#6366F1] animate-spin" />
            <p className="text-[14px] font-medium text-[#111827]">Verifying your email...</p>
          </div>
        ) : (
          <div className="bg-[#F8FAFC] border border-[#E5E7EB] p-4 rounded-xl text-[14px] text-center text-[#6B7280]">
            Click the link in the email to verify your account. If you don't see it, check your spam folder.
          </div>
        )}

        <div className="w-full space-y-3">
          <LoadingButton
            type="button"
            isLoading={false}
            disabled={cooldown > 0 || isVerifying}
            onClick={handleResend}
            className="bg-white text-[#111827] hover:bg-[#F8FAFC] shadow-none border border-[#E5E7EB]"
          >
            {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend Verification Email"}
          </LoadingButton>
          
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full text-[14px] text-[#6B7280] hover:text-[#111827] transition-colors font-medium py-2"
          >
            Skip for now
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
