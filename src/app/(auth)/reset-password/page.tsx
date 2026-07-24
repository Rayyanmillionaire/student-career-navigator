"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "@/components/auth/AuthLayout";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { authService } from "@/lib/authService";

const resetSchema = z.object({
  password: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetFormValues = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: "onChange",
  });

  const currentPassword = watch("password", "");

  const onSubmit = async (data: ResetFormValues) => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    try {
      await authService.resetPassword({ token, password: data.password });
      setIsSuccess(true);
      toast.success("Password reset successfully!");
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to reset password. The link might be expired.";
      toast.error(message);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center space-y-4 py-4"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <h2 className="text-xl font-bold">Password Reset Complete</h2>
          <p className="text-sm text-muted-foreground px-4">
            Your password has been successfully changed. You can now use your new password to sign in.
          </p>
          <Link 
            href="/login" 
            className="mt-6 w-full h-11 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-semibold flex items-center justify-center transition-colors"
          >
            Go to Login
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Create new password" subtitle="Please enter your new password below.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
        <div className="space-y-1">
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            icon={<Lock />}
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordStrength password={currentPassword} />
        </div>

        <PasswordInput
          label="Confirm New Password"
          placeholder="••••••••"
          icon={<Lock />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <LoadingButton 
          type="submit" 
          isLoading={isSubmitting} 
          disabled={!isValid || !token}
          loadingText="Resetting Password..."
          className="mt-4"
        >
          Reset Password
        </LoadingButton>
      </form>

      {!token && (
        <div className="mt-4 p-3 bg-danger/10 border border-danger/20 rounded-md text-danger text-sm text-center">
          Missing reset token. Please use the link sent to your email.
        </div>
      )}

      <div className="text-center mt-6">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  );
}
