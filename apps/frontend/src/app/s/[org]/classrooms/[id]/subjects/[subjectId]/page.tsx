import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { Skeleton } from "@repo/ui/components/skeleton";

import { ErrorFallback } from "~/components/error-fallback";
import { caller, HydrateClient } from "~/trpc/server";
import { ProgramKanban } from "./ProgramKanban";
import { SubjectProgramHeader } from "./SubjectProgramHeader";

export default async function Page(props: {
  params: Promise<{ subjectId: string }>;
}) {
  const params = await props.params;
  const programs = await caller.program.bySubject({
    subjectId: Number(params.subjectId),
  });
  const categories = await caller.program.categories();
  const subject = await caller.subject.get(Number(params.subjectId));
  return (
    <HydrateClient>
      <div className="flex flex-col gap-2">
        <SubjectProgramHeader subject={subject} />
        <ErrorBoundary errorComponent={ErrorFallback}>
          <Suspense
            fallback={
              <div className="grid grid-cols-4 gap-4 px-4 py-2">
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
                <Skeleton className="h-20 w-1/4" />
              </div>
            }
          >
            <ProgramKanban
            // categories={categories}
            // programs={programs.map((program) => {
            //   return {
            //     title: program.title,
            //     id: program.id.toString(),
            //     column: program.category.id,
            //   };
            // })}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    </HydrateClient>
  );
}
