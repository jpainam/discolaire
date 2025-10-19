import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  createLoader,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { ClassroomAttendanceTable } from "./ClassroomAttendanceTable";

const attendanceSearchSchema = {
  termId: parseAsString,
  attendanceType: parseAsStringLiteral(["daily", "periodic"]),
  date: parseAsIsoDate.withDefault(new Date()),
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

const attendanceSearchParams = createLoader(attendanceSearchSchema);

export default async function Page(props: PageProps) {
  const searchParams = await attendanceSearchParams(props.searchParams);
  const params = await props.params;
  batchPrefetch([
    trpc.attendance.all.queryOptions({
      classroomId: params.id,
    }),
  ]);
  return (
    <HydrateClient>
      <ErrorBoundary errorComponent={ErrorFallback}>
        <Suspense>
          <ClassroomAttendanceTable classroomId={params.id} />
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
}
