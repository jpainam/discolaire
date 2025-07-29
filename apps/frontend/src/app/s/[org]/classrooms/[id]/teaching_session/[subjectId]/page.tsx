import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { SubjectJournalEditor } from "./SubjectJournalEditor";
import { SubjectJournalHeader } from "./SubjectJournalHeader";
import { SubjectJournalList } from "./SubjectJournalList";

export default async function Page(props: {
  params: Promise<{ subjectId: string; pageIndex?: string; pageSize?: string }>;
}) {
  const params = await props.params;
  const { subjectId } = params;
  const session = await getSession();

  batchPrefetch([
    trpc.teachingSession.bySubject.queryOptions({
      subjectId: Number(params.subjectId),
      pageIndex: params.pageIndex ? Number(params.pageIndex) : 0,
      pageSize: params.pageSize ? Number(params.pageSize) : 10,
    }),
    trpc.subject.get.queryOptions(Number(subjectId)),
  ]);

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="px-4 py-2">
              <Skeleton className="h-8 w-full" />
            </div>
          }
        >
          <SubjectJournalHeader />
        </Suspense>
      </ErrorBoundary>
      {session?.user.profile == "staff" && (
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-2 px-4 py-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            }
          >
            <SubjectJournalEditor />
          </Suspense>
          <Separator />
        </ErrorBoundary>
      )}

      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="grid grid-cols-4 gap-4 px-4 py-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          }
        >
          <SubjectJournalList />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
