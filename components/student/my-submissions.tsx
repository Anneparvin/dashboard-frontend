// components/student/my-submissions.tsx
"use client";

import { ExternalLink } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMySubmissions } from "@/hooks/use-submissions";
import { getErrorMessage } from "@/lib/api";

export function MySubmissions() {
  const { data, isPending, isError, error } = useMySubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>My submissions</CardTitle>
        <CardDescription>Track the review status of your projects.</CardDescription>
      </CardHeader>
      <CardContent>
        {isPending && <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>}

        {isError && (
          <p className="py-8 text-center text-sm text-destructive">{getErrorMessage(error)}</p>
        )}

        {data && data.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            You haven&apos;t submitted any project yet.
          </p>
        )}

        {data && data.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Links</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[260px]">
                    <p className="font-medium">{item.projectName}</p>
                    <p className="line-clamp-2 whitespace-normal text-xs text-muted-foreground">
                      {item.description}
                    </p>
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
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}