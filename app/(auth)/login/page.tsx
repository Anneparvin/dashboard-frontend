// src/app/(auth)/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthCard } from "../../../components/auth/auth-card";
import { FormField } from "../../../components/forms/form-field";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../context/auth-context";
import { getErrorMessage } from "../../../lib/api";
import { getHomePath } from "../../../lib/auth";
import { LoginValues, loginSchema } from "../../../validations/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    try {
      const user = await login(values);
      toast.success("Welcome back!");
      router.replace(getHomePath(user.role));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Log in to your account"
      footer={
        <>
          Don&apos;t have an account?&nbsp;
          <Link href="/signup" className="font-medium text-foreground underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
    </AuthCard>
  );
}