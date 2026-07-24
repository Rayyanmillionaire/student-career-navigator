"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Mail, Lock, User as UserIcon, GraduationCap, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

import AuthLayout from "@/components/auth/AuthLayout";
import { TextInput } from "@/components/auth/TextInput";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { LoadingButton } from "@/components/auth/LoadingButton";
import { SocialLoginButtons } from "@/components/auth/SocialLoginButtons";
import { authService } from "@/lib/authService";
import useAuth from "@/hooks/useAuth";

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
  confirmPassword: z.string(),
  college: z.string().optional(),
  role: z.enum(["student", "faculty", "recruiter", "admin"]),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and privacy policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { setAuthState } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      role: "student",
    }
  });

  const currentPassword = watch("password", "");

  const onSubmit = async (data: SignupFormValues) => {
    try {
      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        college: data.college,
        role: data.role,
      });

      // Save token
      localStorage.setItem("token", response.token);
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: response.user,
      });

      toast.success("Account created successfully!");
      // Redirect to verify email or dashboard
      router.push("/verify-email");
    } catch (error: any) {
      const message = error.response?.data?.error || "Signup failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join CareerNav and accelerate your future.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="First Name"
            placeholder="John"
            icon={<UserIcon />}
            {...register("firstName")}
            error={errors.firstName?.message}
          />
          <TextInput
            label="Last Name"
            placeholder="Doe"
            icon={<UserIcon />}
            {...register("lastName")}
            error={errors.lastName?.message}
          />
        </div>

        <TextInput
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          icon={<Mail />}
          {...register("email")}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            icon={<Lock />}
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordStrength password={currentPassword} />
        </div>

        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          icon={<Lock />}
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <TextInput
            label="College / University (Optional)"
            placeholder="e.g. Stanford"
            icon={<GraduationCap />}
            {...register("college")}
            error={errors.college?.message}
          />
          
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-medium text-secondary-foreground">I am a...</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground z-10" />
              <select
                {...register("role")}
                className="w-full h-10 pl-10 pr-4 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 appearance-none transition-all duration-200"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </div>
            {errors.role && <span className="text-danger text-[11px] font-medium">{errors.role.message}</span>}
          </div>
        </div>

        <label className="flex items-start gap-2.5 pt-2 cursor-pointer group">
          <div className="pt-0.5">
            <input 
              type="checkbox" 
              {...register("acceptTerms")}
              className="w-4 h-4 rounded border-border text-accent-blue focus:ring-accent-blue/20 bg-muted/50 cursor-pointer"
            />
          </div>
          <span className="text-[11px] text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-accent-blue font-medium hover:underline">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-accent-blue font-medium hover:underline">Privacy Policy</Link>.
          </span>
        </label>
        {errors.acceptTerms && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-danger text-[11px] font-medium mt-1">
            {errors.acceptTerms.message}
          </motion.div>
        )}

        <LoadingButton 
          type="submit" 
          isLoading={isSubmitting} 
          disabled={!isValid}
          loadingText="Creating Account..."
          className="mt-4"
        >
          Create Account
        </LoadingButton>
      </form>

      <SocialLoginButtons isLoading={isSubmitting} />

      <div className="text-center text-xs text-muted-foreground pt-2">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-accent-blue hover:text-accent-blue/80 transition-colors">
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}
