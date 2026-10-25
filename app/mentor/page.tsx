// app/mentor/page.tsx
"use client";

import { useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReviewTable } from "@/components/mentor/review-table";
import { StatsCards } from "@/components/mentor/stats-cards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewSubmissions } from "@/hooks/use-review";
import { getErrorMessage } from "@/lib/api";
import { StatusFilter } from "@/types";

const PAGE_SIZE = 10;

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function MentorPage() {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const { data, isPending, isError, error, isPlaceholderData } = useReviewSubmissions({
    page,
    limit: PAGE_SIZE,
    status,
  });

  const items = data?.data ?? [];
  const totalPages = Math.max(data?.meta.totalPages ?? 1, 1);

  const changeFilter = (value: StatusFilter) => {
    setStatus(value);
    setPage(1); // filter বদলালে প্রথম পেজে ফিরবে
  };

  return (
    <AuthGuard allowedRoles={["MENTOR", "ADMIN"]}>
      <DashboardShell
        title="Mentor Dashboard"
        subtitle="Review student project submissions"
      >
        <StatsCards />

        <Card>
          <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Submissions</CardTitle>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((filter) => (
                <Button
                  key={filter.value}
                  size="sm"
                  variant={status === filter.value ? "default" : "outline"}
                  onClick={() => changeFilter(filter.value)}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isPending && (
              <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
            )}

            {isError && (
              <p className="py-8 text-center text-sm text-destructive">{getErrorMessage(error)}</p>
            )}

            {data && items.length === 0 && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No submissions found.
              </p>
            )}

            {items.length > 0 && (
              <div className={isPlaceholderData ? "opacity-60 transition-opacity" : undefined}>
                <ReviewTable items={items} />
              </div>
            )}

            {data && (
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground">
                  Page {data.meta.page} of {totalPages} · {data.meta.total} total
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages || isPlaceholderData}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </DashboardShell>
    </AuthGuard>
  );
}