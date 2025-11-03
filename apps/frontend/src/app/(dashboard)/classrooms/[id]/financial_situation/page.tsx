import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ClassroomFinancialSituation } from "~/components/classrooms/finances/ClassroomFinancialSituation";
import { ErrorFallback } from "~/components/error-fallback";
import { getQueryClient, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomFinancialSituationHeader } from "./ClassroomFinancialSituationHeader";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const fees = await queryClient.fetchQuery(
    trpc.classroom.fees.queryOptions(params.id),
  );

  const balances = await queryClient.fetchQuery(
    trpc.classroom.studentsBalance.queryOptions(params.id),
  );

  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ClassroomFinancialSituationHeader />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ClassroomFinancialSituation fees={fees} balances={balances} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
