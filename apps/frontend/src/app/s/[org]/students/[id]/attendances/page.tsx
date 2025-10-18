import { Suspense } from "react";

import { Skeleton } from "@repo/ui/components/skeleton";

import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { StudentAttendanceTable } from "./StudentAttendanceTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  batchPrefetch([
    trpc.attendance.student.queryOptions({
      studentId: params.id,
    }),
  ]);
  return (
    <HydrateClient>
      <Suspense
        fallback={
          <div className="grid grid-cols-4 gap-2 px-4">
            {Array.from({ length: 32 }).map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        }
      >
        <StudentAttendanceTable />
      </Suspense>
    </HydrateClient>
  );
}
