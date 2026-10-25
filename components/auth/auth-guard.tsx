// src/components/auth/auth-guard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "@/components/shared/full-page-loader";
import { useAuth } from "@/context/auth-context";
import { getHomePath } from "@/lib/auth";
import { Role } from "@/types";

interface AuthGuardProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export function AuthGuard({ allowedRoles, children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAllowed = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
    } else if (!isAllowed) {
      router.replace(getHomePath(user.role));
    }
  }, [isLoading, user, isAllowed, router]);

  if (isLoading || !isAllowed) {
    return <FullPageLoader />;
  }

  return <>{children}</>;
}