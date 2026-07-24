"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "@/components/auth/AuthLayout";
import { TextInput } from "@/components/auth/TextInput";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { authService } from "@/lib/authService";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotFormValues) => {
    try {
      await authService.forgotPassword(data.email);
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    } catch (error: any) {
      // Even if email isn't found, we pretend it succeeded for security (prevent email enumeration)
      setIsSubmitted(true);
      toast.success("Reset link sent!");
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Email Sent" subtitle="Check your inbox.">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center space-y-4 py-4"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="text-[14px] text-[#6B7280] px-4">
            We've sent password reset instructions to your email address. If it doesn't arrive in a minute, check your spam folder.
          </p>
          <Link 
            href="/login" 
            className="mt-6 flex items-center gap-2 text-[14px] font-semibold text-[#6366F1] hover:text-[#4F46E5] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <TextInput
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={<Mail />}
          {...register("email")}
          error={errors.email?.message}
        />

        <LoadingButton 
          type="submit" 
          isLoading={isSubmitting} 
          disabled={!isValid}
          loadingText="Sending Link..."
          className="mt-4"
        >
          Send Reset Link
        </LoadingButton>
      </form>

      <div className="text-center mt-6">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#6B7280] hover:text-[#111827] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
