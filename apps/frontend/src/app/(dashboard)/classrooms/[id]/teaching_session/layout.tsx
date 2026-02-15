import type React from "react";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { HydrateClient } from "~/trpc/server";

interface PageProps {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}

export default async function Layout(props: PageProps) {
  const params = await props.params;
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
        <Suspense fallback={null}>
          <div className="flex-1">{props.children}</div>
        </Suspense>
      </div>
    </HydrateClient>
  );
}
