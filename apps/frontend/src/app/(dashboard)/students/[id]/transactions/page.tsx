//import FinanceHeader from "~/components/students/transactions/FinanceHeader";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { CircleGauge, Recycle } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { StudentTransactionSummary } from "~/components/students/transactions/StudentTransactionSummary";
import { TransactionTable } from "~/components/students/transactions/TransactionTable";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { PlusIcon } from "~/icons";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { PrintAction } from "./PrintAction";
import { StudentTransactionAccountTable } from "./StudentTransactionAccountTable";
import { StudentTransactionCreate } from "./StudentTransactionCreate";
import { StudentTransactionCreateAlert } from "./StudentTransactionCreateAlert";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  batchPrefetch([
    trpc.student.transactions.queryOptions(params.id),
    trpc.student.get.queryOptions(params.id),
    trpc.student.unpaidRequiredFees.queryOptions(params.id),
    trpc.student.contacts.queryOptions(params.id),
    trpc.accountingJournal.all.queryOptions(),
    trpc.studentAccount.getStatements.queryOptions({
      studentId: params.id,
    }),
  ]);
  const queryClient = getQueryClient();
  const classroom = await queryClient.fetchQuery(
    trpc.student.classroom.queryOptions({ studentId: params.id }),
  );
  if (classroom) {
    batchPrefetch([trpc.classroom.fees.queryOptions(classroom.id)]);
  }
  const t = await getTranslations();
  const canCreateTransaction = await checkPermission(
    "transaction",
    PermissionAction.CREATE,
  );
  return (
    <HydrateClient>
      <div className="bg-muted/50 flex justify-end border-b px-4 py-1">
        <PrintAction />
      </div>
      <Tabs defaultValue="transactions" className="px-4 py-2">
        <TabsList>
          <TabsTrigger value="transactions">
            <CircleGauge />
            {t("transactions")}
          </TabsTrigger>
          <TabsTrigger value="account">
            <Recycle />
            {t("account")}
          </TabsTrigger>
          {canCreateTransaction && (
            <TabsTrigger value="create">
              <PlusIcon />
              {t("make_payment")}
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="transactions" className="flex flex-col gap-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 py-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              }
            >
              {/* <TransactionStats studentId={params.id} /> */}
              <StudentTransactionSummary studentId={params.id} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              }
            >
              <TransactionTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="account">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-4 gap-4 p-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full" />
                  ))}
                </div>
              }
            >
              <StudentTransactionAccountTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        {canCreateTransaction && (
          <TabsContent value="create">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<Skeleton className="h-8 w-full" />}>
                <StudentTransactionCreateAlert />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-4 py-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton key={index} className="h-8 w-full" />
                    ))}
                  </div>
                }
              >
                <StudentTransactionCreate />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        )}
      </Tabs>
    </HydrateClient>
  );
}
