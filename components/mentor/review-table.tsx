// components/mentor/review-table.tsx
"use client";

import { Check, ExternalLink, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useReviewSubmission } from "@/hooks/use-review";
import { ReviewSubmission } from "@/types";

export function ReviewTable({ items }: { items: ReviewSubmission[] }) {
  const review = useReviewSubmission();

  // কোন row-তে এখন কাজ চলছে, শুধু সেই row-র বোতাম বন্ধ থাকবে
  const pendingId = review.isPending ? review.variables?.id : undefined;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Student</TableHead>
          <TableHead>Links</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="max-w-[280px]">
              <p className="font-medium">{item.projectName}</p>
              <p className="line-clamp-2 whitespace-normal text-xs text-muted-foreground">
                {item.description}
              </p>
            </TableCell>
            <TableCell>
              <p className="text-sm">{item.student.name}</p>
              <p className="text-xs text-muted-foreground">{item.student.email}</p>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1 text-sm">
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline"
                >
                  Repo <ExternalLink className="h-3 w-3" />
                </a>
                {item.liveLink && (
                  <a
                    href={item.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline"
                  >
                    Live <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </TableCell>
            <TableCell>
              <StatusBadge status={item.status} />
            </TableCell>
            <TableCell className="text-right">
              {item.status === "PENDING" ? (
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={pendingId === item.id}
                    onClick={() => review.mutate({ id: item.id, status: "APPROVED" })}
                  >
                    <Check className="h-4 w-4" /> Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    disabled={pendingId === item.id}
                    onClick={() => review.mutate({ id: item.id, status: "REJECTED" })}
                  >
                    <X className="h-4 w-4" /> Reject
                  </Button>
                </div>
              ) : (
                <span className="text-xs text-muted-foreground">Reviewed</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}