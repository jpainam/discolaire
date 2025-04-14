import { Skeleton } from "@repo/ui/components/skeleton";
import { Suspense } from "react";
import { EmptyState } from "~/components/EmptyState";
import { AccessLogsHeader } from "~/components/students/access-logs/AccessLogsHeader";
import { AccessLogsTable } from "~/components/students/access-logs/AccessLogsTable";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await caller.student.get(params.id);
  if (!student.userId) {
    return <EmptyState className="my-8" title="No user found" />;
  }

  return (
    <div className="flex flex-col gap-2">
      <AccessLogsHeader userId={student.userId} />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 lg:grid-cols-4 px-4 gap-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <Skeleton key={i} className="h-8 " />
            ))}
          </div>
        }
      >
        <AccessLogsTable userId={student.userId} studentId={student.id} />
      </Suspense>
    </div>
  );
}
