import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { getFullName } from "~/utils";
import { StudentTimetablesCalendar } from "./StudentTimetablesCalendar";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  batchPrefetch([trpc.student.timetables.queryOptions(params.id)]);
  const queryClient = getQueryClient();
  const student = await queryClient.fetchQuery(
    trpc.student.get.queryOptions(params.id),
  );
  const t = await getTranslations();
  return (
    <HydrateClient>
      <BreadcrumbsSetter
        items={[
          { label: t("students"), href: "/students" },
          { label: getFullName(student), href: `/students/${params.id}` },
          { label: t("timetable"), href: `/students/${params.id}/timetables` },
        ]}
      />
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense fallback={<Skeleton className="m-4 h-[700px] w-full" />}>
          <StudentTimetablesCalendar studentId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
