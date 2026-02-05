"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ErrorFallback } from "../error-fallback";
import { Skeleton } from "../ui/skeleton";
import { NotificationStatsCards } from "./NotificationStats";
import { NotificationTable } from "./NotificationTable";

export function NotificationOverview({
  recipientId,
  recipientProfile,
}: {
  recipientId: string;
  recipientProfile: "student" | "staff" | "contact";
}) {
  return (
    <div className="flex flex-col gap-4 px-4 py-2">
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
              {Array.from({ length: 7 }).map((_, t) => (
                <Skeleton className="h-20" key={t} />
              ))}
            </div>
          }
        >
          <NotificationStatsCards
            recipientId={recipientId}
            profile={recipientProfile}
          />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary errorComponent={ErrorFallback}>
        <NotificationTable
          recipientId={recipientId}
          recipientProfile={recipientProfile}
        />
      </ErrorBoundary>
    </div>
  );
}
