"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ByChronologicalOrder({ classroomId }: { classroomId: string }) {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: minMaxMoy, isPending: summaryIsPending } = useQuery(
    trpc.classroom.getMinMaxMoyGrades.queryOptions(classroomId),
  );
  const { data: grades, isPending: gradesIsPending } = useQuery(
    trpc.student.grades.queryOptions({
      id: params.id,
    }),
  );

  const [termId] = useQueryState("termId", parseAsString);
  const [orderBy] = useQueryState("orderBy", parseAsString);
  const [sortOrder] = useQueryState(
    "sortOrder",
    parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  );

  const sortedGrades = useMemo(() => {
    let filteredGrades = grades ?? [];

    if (termId) {
      filteredGrades = filteredGrades.filter(
        (g) => g.gradeSheet.termId === termId,
      );
    }

    const sorted = [...filteredGrades].sort((a, b) => {
      if (orderBy === "grade") {
        return a.grade - b.grade;
      } else {
        const nameA = a.gradeSheet.subject.course.name.toLowerCase();
        const nameB = b.gradeSheet.subject.course.name.toLowerCase();
        return nameA.localeCompare(nameB);
      }
    });

    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [orderBy, sortOrder, grades, termId]);

  const [gradeId, setGradeId] = useQueryState("gradeId", parseAsInteger);
  const [_, setGradeSheetId] = useQueryState("gradesheetId", parseAsInteger);

  const t = useTranslations();
  const locale = useLocale();
  if (gradesIsPending || summaryIsPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton className="h-8" key={index} />
        ))}
      </div>
    );
  }
  return (
    <div>
      {sortedGrades
        .filter((g) => !g.isAbsent)
        .map((grade) => {
          const m = grade.gradeSheet.createdAt.toLocaleDateString(locale, {
            month: "short",
          });
          const d = grade.gradeSheet.createdAt.toLocaleDateString(locale, {
            day: "numeric",
          });
          return (
            <div
              onClick={() => {
                void setGradeId(grade.id);
                void setGradeSheetId(grade.gradeSheetId);
              }}
              key={grade.id}
              className={cn(
                "border-accent flex cursor-pointer flex-row items-center gap-4 border-b px-4 py-2",
                grade.id === gradeId ? "bg-accent" : "bg-none",
              )}
            >
              <div className="flex w-[50px] flex-col justify-center">
                <div className="bg-muted text-muted-foreground mb-1 flex flex-col items-center rounded-md px-1 text-xs">
                  <div>{d}</div>
                  <div>{m}</div>
                </div>
                <div
                  className="h-1 w-full rounded-sm"
                  style={{
                    backgroundColor: grade.gradeSheet.subject.course.color,
                  }}
                ></div>
              </div>
              <div className="flex flex-col gap-0">
                <div className="py-0 text-xs font-bold uppercase">
                  {grade.gradeSheet.subject.course.name}
                </div>
                <div className="text-muted-foreground py-0 text-xs">
                  {grade.gradeSheet.name}
                </div>
                <div className="text-muted-foreground py-0 text-xs">
                  {t("average_of_classroom")}{" "}
                  {minMaxMoy
                    ?.find((g) => g.gradeSheetId === grade.gradeSheetId)
                    ?.avg?.toFixed(2)}
                </div>
              </div>
              <div className="ml-auto flex w-[100px] flex-col text-sm">
                <span className="font-bold">{grade.grade.toFixed(2)}</span>
                <span className="text-muted-foreground text-xs">
                  {grade.gradeSheet.term.name}
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
}
