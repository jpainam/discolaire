import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { StaffDocumentHeader } from "./StaffDocumentHeader";
import { StaffDocumentTable } from "./StaffDocumentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.staff.documents.queryOptions(params.id));
  const staff = await caller.staff.get(params.id);
  let userId = staff.userId;
  if (!userId) {
    const user = await caller.user.create({
      entityId: staff.id,
      profile: "staff",
      username:
        `${staff.firstName?.toLowerCase()}.${staff.lastName?.toLowerCase()}`.replace(
          /[^a-zA-Z0-9]/g,
          "",
        ),
    });
    userId = user.id;
  }

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8" />
            </div>
          }
        >
          <StaffDocumentHeader userId={userId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid gap-4 px-4 py-2 md:grid-cols-2">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <StaffDocumentTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
