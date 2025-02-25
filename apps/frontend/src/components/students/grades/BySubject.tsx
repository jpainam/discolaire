"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import type { RouterOutputs } from "@repo/api";
import { useCreateQueryString } from "@repo/hooks/create-query-string";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/accordion";
import { Separator } from "@repo/ui/components/separator";
import FlatBadge from "~/components/FlatBadge";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import { useDateFormat } from "~/utils/date-format";

interface BySubjectProps {
  grades: RouterOutputs["student"]["grades"][number][];
  minMaxMoy: RouterOutputs["classroom"]["getMinMaxMoyGrades"][number][];
}
export function BySubject({ grades, minMaxMoy }: BySubjectProps) {
  const [subjects, setSubjects] = useState<
    RouterOutputs["student"]["grades"][number]["gradeSheet"]["subject"][]
  >([]);
  const [subjectSums, setSubjectSums] = useState<Record<string, number>>({});
  useEffect(() => {
    const t = Array.from(
      new Set(grades.map((grade) => grade.gradeSheet.subject))
    );
    setSubjects(t);
    // Compute the average of each subject
    const computeSums: Record<string, number> = {};
    grades.forEach((grade) => {
      const subjectId = grade.gradeSheet.subject.id;
      if (subjectId) {
        if (!computeSums[subjectId]) {
          computeSums[subjectId] = 0;
        }
        computeSums[subjectId] +=
          grade.grade * (Number(grade.gradeSheet.weight) / 100.0);
      }
    });
    setSubjectSums(computeSums);
  }, [grades]);

  const uniqueSubjectTitles: number[] = [];
  return (
    <Accordion type="single" collapsible className="w-full">
      {subjects.map((subject, index) => {
        if (uniqueSubjectTitles.includes(subject.id)) return null;
        uniqueSubjectTitles.push(subject.id);
        const filteredGrades = grades.filter(
          (grade) => grade.gradeSheet.subject.id === subject.id
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
                className="ml-auto mr-4 w-[50px]"
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
              {filteredGrades.map((grade, index) => (
                <div
                  className="mb-1 flex flex-col"
                  key={`${grade.id}-${index}-bysubject`}
                >
                  <BySubjectItem minMaxMoy={minMaxMoy} grade={grade} />
                  {index < filteredGrades.length - 1 && <Separator />}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

function BySubjectItem({
  grade,
  minMaxMoy,
}: {
  grade: RouterOutputs["student"]["grades"][number];
  minMaxMoy: RouterOutputs["classroom"]["getMinMaxMoyGrades"][number][];
}) {
  const { monthFormatter, dayFormatter } = useDateFormat();
  const m = monthFormatter.format(grade.gradeSheet.createdAt);
  const d = dayFormatter.format(grade.gradeSheet.createdAt);
  const params = useParams<{ id: string }>();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  return (
    <div
      className="flex cursor-pointer flex-row gap-2"
      onClick={() => {
        const query = {
          color: grade.gradeSheet.subject.course.color,
          name: grade.gradeSheet.name,
          gradesheetId: grade.gradeSheetId.toString(),
          reportName: grade.gradeSheet.subject.course.name,
          date: grade.gradeSheet.createdAt.toISOString(),
          grade: grade.grade,
          termName: grade.gradeSheet.term.name,
          moy: minMaxMoy
            .find((g) => g.gradeSheetId === grade.gradeSheetId)
            ?.avg?.toFixed(2),
          max: minMaxMoy
            .find((g) => g.gradeSheetId === grade.gradeSheetId)
            ?.max?.toFixed(2),
          min: minMaxMoy
            .find((g) => g.gradeSheetId === grade.gradeSheetId)
            ?.min?.toFixed(2),
          coef: grade.gradeSheet.subject.coefficient.toString(),
        };
        router.push(
          `${routes.students.grades(params.id)}/${grade.id}/?${createQueryString({ ...query })}`
        );
      }}
    >
      <div className="mb-1 flex flex-col items-center rounded-md bg-secondary px-1 text-xs">
        <div>{d}</div>
        <div>{m}</div>
      </div>
      <div className="flex flex-col">
        <div className="text-sm font-semibold">{grade.gradeSheet.name}</div>
        <div className="tracking-tighter text-muted-foreground">
          {grade.gradeSheet.term.name}
        </div>
      </div>
      <div className="ml-auto font-bold">{grade.grade}</div>
    </div>
  );
}
