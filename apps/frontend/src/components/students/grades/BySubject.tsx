"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Separator } from "@repo/ui/components/separator";
import { Skeleton } from "@repo/ui/components/skeleton";

import FlatBadge from "~/components/FlatBadge";
import { useTRPC } from "~/trpc/react";

export function BySubject() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();

  const { data: grades, isPending: gradesIsPending } = useQuery(
    trpc.student.grades.queryOptions({
      id: params.id,
    }),
  );

  const [__, setGradeId] = useQueryState("gradeId", parseAsInteger);
  const [_, setGradeSheetId] = useQueryState("gradesheetId", parseAsInteger);
  const [termId] = useQueryState("termId", parseAsString);

  const locale = useLocale();

  const { subjects, subjectSums, filteredGrades } = useMemo(() => {
    let filteredGrades = grades ?? [];
    if (termId) {
      filteredGrades = filteredGrades.filter(
        (g) => g.gradeSheet.termId === termId,
      );
    }
    const subjects = Array.from(
      new Set(
        filteredGrades
          .filter((g) => !g.isAbsent)
          .map((grade) => grade.gradeSheet.subject),
      ),
    );

    const subjectSums: Record<string, number> = {};
    filteredGrades.forEach((grade) => {
      const subjectId = grade.gradeSheet.subject.id;
      if (subjectId) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        subjectSums[subjectId] ??= 0;
        subjectSums[subjectId] += grade.grade * Number(grade.gradeSheet.weight);
      }
    });
    return { subjectSums, subjects, filteredGrades };
  }, [grades, termId]);

  const uniqueSubjectTitles: number[] = [];
  if (gradesIsPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton className="h-8" key={index} />
        ))}
      </div>
    );
  }
  return (
    <Accordion type="single" collapsible className="w-full">
      {subjects.map((subject, index) => {
        if (uniqueSubjectTitles.includes(subject.id)) return null;
        uniqueSubjectTitles.push(subject.id);
        const subGrades = filteredGrades.filter(
          (grade) => grade.gradeSheet.subject.id === subject.id,
        );

        const subjectAvg =
          (subjectSums[subject.id] ?? 0) / (filteredGrades.length || 1e9);
        return (
          <AccordionItem
            // className="[&>h3]:before:w-2 [&>h3]:before:h-full [&>h3]:before:bg-red-500"
            style={{
              borderLeftColor: subject.course.color,
            }}
            className="border-l-8 px-2"
            key={`${subject.id}-${index}`}
            value={`item-${subject.id}`}
          >
            <AccordionTrigger className="text-md flex flex-row font-bold">
              <span>{subject.course.name}</span>
              <FlatBadge
                className="mr-4 ml-auto w-[50px]"
                variant={
                  subjectAvg < 10
                    ? "red"
                    : subjectAvg <= 12.5 && subjectAvg <= 18
                      ? "blue"
                      : "green"
                }
              >
                {Number(subjectAvg).toFixed(2)}
              </FlatBadge>
            </AccordionTrigger>
            <AccordionContent className="px-4">
              {subGrades.map((grade, index) => {
                const m = grade.gradeSheet.createdAt.toLocaleDateString(
                  locale,
                  {
                    month: "short",
                  },
                );
                const d = grade.gradeSheet.createdAt.toLocaleDateString(
                  locale,
                  {
                    day: "numeric",
                  },
                );
                return (
                  <div
                    className="mb-1 flex flex-col"
                    key={`${grade.id}-${index}-bysubject`}
                  >
                    <div
                      className="flex cursor-pointer flex-row gap-2"
                      onClick={() => {
                        void setGradeId(grade.id);
                        void setGradeSheetId(grade.gradeSheetId);
                      }}
                    >
                      <div className="bg-secondary mb-1 flex flex-col items-center rounded-md px-1 text-xs">
                        <div>{d}</div>
                        <div>{m}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold">
                          {grade.gradeSheet.name}
                        </div>
                        <div className="text-muted-foreground tracking-tighter">
                          {grade.gradeSheet.term.name}
                        </div>
                      </div>
                      <div className="ml-auto font-bold">
                        {grade.grade.toFixed(2)}
                      </div>
                    </div>
                    {index < subGrades.length - 1 && <Separator />}
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
