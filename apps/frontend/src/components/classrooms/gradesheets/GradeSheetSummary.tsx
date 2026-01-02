"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import { ClassroomGradeChart } from "./ClassroomGradeChart";
import { ClassroomGradeList } from "./ClassroomGradeList";

export function GradeSheetSummary({
  gradeSheetId,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  classroomId,
}: {
  gradeSheetId: number;
  classroomId: string;
}) {
  const trpc = useTRPC();

  const gradesQuery = useQuery(
    trpc.gradeSheet.grades.queryOptions(gradeSheetId),
  );
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
    <div className="h-full flex-1 space-y-2 overflow-auto pb-4">
      {grades && (
        <ClassroomGradeChart
          className="grid grid-cols-2 gap-2"
          grades={grades}
        />
      )}

      {gradeSheet && grades && (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-2 p-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton className="h-8" key={index} />
              ))}
            </div>
          }
        >
          <ClassroomGradeList
            classroomId={gradeSheet.subject.classroomId}
            gradesheet={gradeSheet}
            grades={grades}
          />
        </Suspense>
      )}
    </div>
  );
}
