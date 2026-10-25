// components/mentor/stats-cards.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReviewStats } from "@/hooks/use-review";

export function StatsCards() {
  const { data, isPending } = useReviewStats();

  const items = [
    { label: "Total", value: data?.total },
    { label: "Pending", value: data?.pending },
    { label: "Approved", value: data?.approved },
    { label: "Rejected", value: data?.rejected },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {item.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{isPending ? "–" : (item.value ?? 0)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}