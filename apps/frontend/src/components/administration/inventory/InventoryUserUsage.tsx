"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Progress } from "@repo/ui/components/progress";
import { cn } from "@repo/ui/lib/utils";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export function InventoryUserUsage({ className }: { className?: string }) {
  const trpc = useTRPC();
  const { data: usages } = useSuspenseQuery(
    trpc.inventoryUsage.usageSummary.queryOptions(),
  );
  // const maxUsage = Math.max(...usages.map((usage) => usage.count), 0);
  // const maxWidth = 100; // Set the maximum width for the progress bar
  const { t } = useLocale();
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Teacher Assignments</CardTitle>
        <CardDescription>Items assigned to teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {usages.map((usage, index) => {
            return (
              <div key={index} className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{usage.name}</div>
                    <div className="text-muted-foreground text-sm">
                      {usage.count} {t("items")}
                    </div>
                  </div>
                  <Progress value={usage.count} />
                  {/* <div className="mt-1 h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: "28%" }}
                    ></div>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
