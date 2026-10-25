// app/student/page.tsx
"use client";

import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { MySubmissions } from "@/components/student/my-submissions";
import { SubmissionForm } from "@/components/student/submission-form";

export default function StudentPage() {
  return (
    <AuthGuard allowedRoles={["STUDENT"]}>
      <DashboardShell
        title="Student Dashboard"
        subtitle="Submit your project and track its review status"
      >
        <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:items-start">
          <SubmissionForm />
          <MySubmissions />
        </div>
      </DashboardShell>
    </AuthGuard>
  );
}