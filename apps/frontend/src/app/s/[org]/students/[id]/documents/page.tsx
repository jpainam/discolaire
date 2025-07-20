import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentDocumentHeader } from "~/components/students/documents/StudentDocumentHeader";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";
import { StudentDocumentTable } from "./StudentDocumentTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  prefetch(trpc.student.documents.queryOptions(params.id));
  const student = await caller.student.get(params.id);
  let userId = student.userId;
  if (!userId) {
    const user = await caller.user.create({
      entityId: student.id,
      profile: "student",
      username:
        `${student.firstName?.toLowerCase()}.${student.lastName?.toLowerCase()}`.replace(
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
          <StudentDocumentHeader userId={userId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          key={params.id}
          fallback={
            <div className="grid gap-4 px-4 py-2 md:grid-cols-3">
              {Array.from({ length: 16 }).map((_, index) => (
                <Skeleton key={index} className="h-8" />
              ))}
            </div>
          }
        >
          <StudentDocumentTable />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
