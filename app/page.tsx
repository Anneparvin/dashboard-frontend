// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FullPageLoader } from "../components/shared/full-page-loader";
import { useAuth } from "../context/auth-context";
import { getHomePath } from "@/lib/auth";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    router.replace(user ? getHomePath(user.role) : "/login");
  }, [isLoading, user, router]);

  return <FullPageLoader />;
}