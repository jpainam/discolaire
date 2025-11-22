import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { EmptyComponent } from "~/components/EmptyComponent";
import { ErrorFallback } from "~/components/error-fallback";
import { ReportCardHeader } from "~/components/students/reportcards/ReportCardHeader";
import { getServerTranslations } from "~/i18n/server";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const classroom = await caller.student.classroom({ studentId: id });
  const { t } = await getServerTranslations();
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  prefetch(trpc.term.all.queryOptions());
  return (
    <div className="flex w-full flex-col gap-2">
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
            <ReportCardHeader classroomId={classroom.id} />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-4 px-4 py-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
