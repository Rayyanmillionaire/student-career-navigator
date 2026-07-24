"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "@/components/auth/AuthLayout";
import { TextInput } from "@/components/auth/TextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { TrustSection } from "@/components/auth/TrustSection";
import { authService } from "@/lib/authService";
import useAuth from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/dashboard";
  const { setAuthState } = useAuth();
  
  const [isShake, setIsShake] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password,
      });

      // Handle remember me with token storage
      if (data.rememberMe) {
        localStorage.setItem("token", response.token);
      } else {
        sessionStorage.setItem("token", response.token);
      }
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
      });

      toast.success("Welcome back!");
      router.push(returnUrl);
    } catch (error: any) {
      // Trigger shake animation on error
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
      
      const message = error.response?.data?.error || "An unexpected error occurred.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Log in to continue to your dashboard.">
      <motion.form 
        onSubmit={handleSubmit(onSubmit)} 
        className="space-y-4"
        animate={isShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <TextInput
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={<Mail />}
          {...register("email")}
          error={errors.email?.message}
          autoComplete="email"
        />

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            icon={<Lock />}
            {...register("password")}
            error={errors.password?.message}
            autoComplete="current-password"
          />
          <div className="flex justify-between items-center px-1 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                {...register("rememberMe")}
                className="w-3.5 h-3.5 rounded border-border text-accent-blue focus:ring-accent-blue/20 bg-muted/50"
              />
              <span className="text-xs text-muted-foreground select-none hover:text-foreground transition-colors">Remember Me</span>
            </label>
            <Link 
              href="/forgot-password" 
              className="text-xs font-semibold text-accent-blue hover:text-accent-blue/80 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <LoadingButton 
          type="submit" 
          isLoading={isSubmitting} 
          disabled={!isValid}
          loadingText="Authenticating..."
          className="mt-2"
        >
          Sign In
        </LoadingButton>
      </motion.form>

      <SocialLoginButtons isLoading={isSubmitting} />

      <div className="text-center text-sm text-muted-foreground pt-4">
        Don't have an account?{" "}
        <Link href="/signup" className="font-semibold text-accent-blue hover:text-accent-blue/80 transition-colors">
          Create Account
        </Link>
      </div>

      <TrustSection />
    </AuthLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
