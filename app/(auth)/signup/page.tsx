// src/app/(auth)/signup/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AuthCard } from "../../../components/auth/auth-card";
import { FormField } from "../../../components/forms/form-field";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../context/auth-context";
import { getErrorMessage } from "../../../lib/api";
import { getHomePath } from "../../../lib/auth";
import { SignupValues, signupSchema } from "../../../validations/auth";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async ({ name, email, password }: SignupValues) => {
    try {
      const user = await signup({ name, email, password });
      toast.success("Account created successfully!");
      router.replace(getHomePath(user.role));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthCard
      title="Create an account"
      description="Sign up as a student to submit your projects"
      footer={
        <>
          Already have an account?&nbsp;
          <Link href="/login" className="font-medium text-foreground underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          label="Full name"
          placeholder="Your name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
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
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}