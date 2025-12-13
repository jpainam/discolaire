"use client";

import { useQuery } from "@tanstack/react-query";
import { FileTextIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import { CreatedGradesheetCard } from "./CreatedGradesheetCard";

export function CurrentGradeSheetSummary({
  termId,
  subjectId,
}: {
  termId: string;
  subjectId: number;
}) {
  const trpc = useTRPC();

  const previousGradesheetQuery = useQuery(
    trpc.gradeSheet.all.queryOptions({
      termId,
      subjectId,
    }),
  );

  if (previousGradesheetQuery.isPending) {
    return (
      <div className="pt-2 pr-2">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  const gradesheets = previousGradesheetQuery.data;
  if (!gradesheets || gradesheets.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileTextIcon />
          </EmptyMedia>
          <EmptyTitle>Aucune notes</EmptyTitle>
          <EmptyDescription>
            Vous n'avez aucune notes pour cette période
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent></EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-2 pr-2">
      {gradesheets.map((gs) => {
        return <CreatedGradesheetCard gradeSheetId={gs.id} key={gs.id} />;
      })}
    </div>
  );
}
