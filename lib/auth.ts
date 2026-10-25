// src/lib/auth.ts
import { Role } from "@/types";

// Role অনুযায়ী কোন পেজে যাবে
export function getHomePath(role: Role): string {
  return role === "STUDENT" ? "/student" : "/mentor";
}