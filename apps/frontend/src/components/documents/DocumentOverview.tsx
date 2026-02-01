"use client";

import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { Skeleton } from "../ui/skeleton";
import { DocumentFileList } from "./DocumentFileList";
import { DocumentRecentActivity } from "./DocumentRecentActivity";
import { DocumentStorageCard } from "./DocumentStorageCard";

export type ViewType =
  | "all"
  | "starred"
  | "recent"
  | "shared"
  | "trash"
  | "folder";

export function DocumentOverview({
  entityType,
  entityId,
}: {
  entityType: "staff" | "student" | "contact";
  entityId: string;
}) {
  const trpc = useTRPC();
  const { data: stats, isPending: statsIsPending } = useQuery(
    trpc.document.stats.queryOptions({
      entityId,
      entityType,
    }),
  );

  return (
    <div className="w-full flex-1 overflow-auto">
      <div className="flex flex-col gap-4 p-2 md:p-2 xl:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          {statsIsPending ? (
            <div className="grid gap-2 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          ) : (
            <DocumentStorageCard stats={stats} />
          )}
          <DocumentFileList entityId={entityId} entityType={entityType} />
        </div>

        <div className="w-full shrink-0 space-y-4 xl:w-80">
          <DocumentRecentActivity entityId={entityId} entityType={entityType} />
        </div>
      </div>
    </div>
  );
}
