import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

//import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { Skeleton } from "@repo/ui/components/skeleton";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorFallback } from "~/components/error-fallback";
import { TransactionStats } from "~/components/students/transactions/transaction-stats";
import { TransactionTable } from "~/components/students/transactions/TransactionTable";
import { caller, HydrateClient, prefetch, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const classroom = await caller.student.classroom({ studentId: id });

  const { t } = await getServerTranslations();
  prefetch(trpc.student.transactions.queryOptions(id));

  return (
    <HydrateClient>
      <div className="flex w-full flex-col gap-2">
        {classroom && (
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 px-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              }
            >
              <TransactionStats classroomId={classroom.id} />
            </Suspense>
          </ErrorBoundary>
        )}
        {classroom ? (
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 px-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              }
            >
              <TransactionTable />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <EmptyState
            className="my-8"
            title={t("student_not_registered_yet")}
          />
        )}
      </div>
    </HydrateClient>
  );
}
