"use client";

import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@repo/ui/components/skeleton";

import { useTRPC } from "~/trpc/react";
import { SubjectSessionColumn } from "./SubjectSessionColumn";

export function SubjectSessionBoard({ subjectId }: { subjectId: number }) {
  const trpc = useTRPC();
  const termQuery = useQuery(trpc.term.all.queryOptions());
  const terms = termQuery.data ?? [];
  return (
    <div className="h-full w-full overflow-x-auto">
      {termQuery.isPending ? (
        <div className="grid grid-cols-4 gap-4 px-2">
          {Array.from({ length: 16 }).map((_, index) => (
            <Skeleton key={index} className="h-8" />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-w-max gap-3 overflow-hidden px-2 pb-2">
          {terms.map((t, index) => (
            <SubjectSessionColumn key={index} term={t} subjectId={subjectId} />
          ))}
        </div>
      )}
    </div>
  );
}
