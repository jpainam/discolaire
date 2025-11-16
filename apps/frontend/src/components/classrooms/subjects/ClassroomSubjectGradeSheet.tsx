"use client";

import { useQuery } from "@tanstack/react-query";

import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import { CurrentGradeSheetSummary } from "~/components/classrooms/gradesheets/CurrentGradeSheetSummary";
import { useTRPC } from "~/trpc/react";

export function ClassroomSubjectGradeSheet({
  subjectId,
}: {
  subjectId: number;
}) {
  const trpc = useTRPC();
  const { data: terms, isPending } = useQuery(trpc.term.all.queryOptions());
  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-20" />
        ))}
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col gap-4 overflow-auto">
      {terms?.map((t, index) => {
        return (
          <div key={index} className="flex flex-col">
            <Label className="text-muted-foreground px-4">{t.name}</Label>
            <CurrentGradeSheetSummary subjectId={subjectId} termId={t.id} />
            <Separator className="my-2" />
          </div>
        );
      })}
    </div>
  );
}
