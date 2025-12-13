import type { SearchParams } from "nuqs/server";
import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { createLoader, parseAsInteger } from "nuqs/server";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

const programSchema = {
  subjectId: parseAsInteger,
};
interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}
const programSearchParamsLoader = createLoader(programSchema);

export default async function Layout(props: PageProps) {
  const params = await props.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const searchParams = await programSearchParamsLoader(props.searchParams);
  batchPrefetch([trpc.classroom.subjects.queryOptions(params.id)]);

  const { id } = params;

  return (
    <HydrateClient>
      <div className="flex flex-col md:flex-row">
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="flex w-[350px] flex-col gap-2 p-2">
                {Array.from({ length: 16 }).map((_, index) => (
                  <Skeleton key={index} className="h-8 w-full" />
                ))}
              </div>
            }
          >
            <ProgramList classroomId={id} />
          </Suspense>
        </ErrorBoundary>
        <div className="flex-1">{props.children}</div>
      </div>
    </HydrateClient>
  );
}
