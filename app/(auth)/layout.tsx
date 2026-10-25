// src/app/(auth)/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "../../components/shared/full-page-loader";
import { useAuth } from "../../context/auth-context";
import { getHomePath } from "/lib/auth";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(getHomePath(user.role));
    }
  }, [isLoading, user, router]);

  if (isLoading || user) {
    return <FullPageLoader />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      {children}
    </main>
  );
}