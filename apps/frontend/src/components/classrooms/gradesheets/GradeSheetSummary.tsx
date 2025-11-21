"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";
import { ClassroomGradeChart } from "./ClassroomGradeChart";
import { ClassroomGradeList } from "./ClassroomGradeList";

export function GradeSheetSummary({ gradeSheetId }: { gradeSheetId: number }) {
  const trpc = useTRPC();
  const params = useParams<{ id: string }>();
  const gradesQuery = useQuery(
    trpc.gradeSheet.grades.queryOptions(gradeSheetId),
  );
  const router = useRouter();
  const gradeSheetQuery = useQuery(
    trpc.gradeSheet.get.queryOptions(gradeSheetId),
  );
  if (gradeSheetQuery.isPending || gradesQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-16" />
        ))}
      </div>
    );
  }
  const grades = gradesQuery.data;
  const gradeSheet = gradeSheetQuery.data;
  return (
    <div className="h-full flex-1 space-y-2 overflow-auto px-4 pb-4">
      <Button
        onClick={() => {
          router.push(`/classrooms/${params.id}/gradesheets/${gradeSheetId}`);
        }}
        className="w-fit"
        size={"sm"}
      >
        Voir plus de details
      </Button>
      {grades && (
        <ClassroomGradeChart
          className="grid grid-cols-2 gap-2"
          grades={grades}
        />
      )}

      {gradeSheet && grades && (
        <ClassroomGradeList gradesheet={gradeSheet} grades={grades} />
      )}
    </div>
  );
}
