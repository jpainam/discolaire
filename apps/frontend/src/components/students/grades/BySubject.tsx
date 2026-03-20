"use client";

import { useMemo } from "react";
import { useLocale } from "next-intl";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { Badge } from "~/components/base-badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Separator } from "~/components/ui/separator";

type Grade = RouterOutputs["student"]["grades"][number];
type Subject = Grade["gradeSheet"]["subject"];

interface SubjectEntry {
  subject: Subject;
  grades: Grade[];
  weightedSum: number;
  totalWeight: number;
}

export function BySubject({
  grades,
}: {
  grades: RouterOutputs["student"]["grades"];
}) {
  const [__, setGradeId] = useQueryState("gradeId", parseAsInteger);
  const [_, setGradeSheetId] = useQueryState("gradesheetId", parseAsInteger);
  const [termId] = useQueryState("termId", parseAsString);

  const locale = useLocale();

  const subjectEntries = useMemo(() => {
    const filtered = termId
      ? grades.filter((g) => g.gradeSheet.termId === termId)
      : grades;

    const map = new Map<number, SubjectEntry>();

    for (const grade of filtered) {
      const { subject } = grade.gradeSheet;
      if (!map.has(subject.id)) {
        map.set(subject.id, {
          subject,
          grades: [],
          weightedSum: 0,
          totalWeight: 0,
        });
      }
      if (!grade.isAbsent) {
        const entry = map.get(subject.id);
        if (!entry) continue;
        const weight = Number(grade.gradeSheet.weight);
        entry.grades.push(grade);
        entry.weightedSum += grade.grade * weight;
        entry.totalWeight += weight;
      }
    }

    return Array.from(map.values()).filter((e) => e.grades.length > 0);
  }, [grades, termId]);

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-none border-none"
    >
      {subjectEntries.map(
        ({ subject, grades: subGrades, weightedSum, totalWeight }) => {
          const subjectAvg = totalWeight > 0 ? weightedSum / totalWeight : 0;
          return (
            <AccordionItem
              style={{ borderLeftColor: subject.course.color }}
              className="border-l-8 px-2"
              key={subject.id}
              value={`item-${subject.id}`}
            >
              <AccordionTrigger className="hover:bg-muted/30 items-center gap-3 hover:no-underline">
                <span className="w-1/2">{subject.course.name}</span>
                <Badge
                  appearance={"light"}
                  variant={
                    subjectAvg < 10
                      ? "destructive"
                      : subjectAvg <= 12.5
                        ? "info"
                        : "success"
                  }
                >
                  {subjectAvg.toFixed(2)}
                </Badge>
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
                    <div className="mb-1 flex flex-col" key={grade.id}>
                      <div
                        className="flex cursor-pointer flex-row gap-2"
                        onClick={() => {
                          void setGradeId(grade.id);
                          void setGradeSheetId(grade.gradeSheetId);
                        }}
                      >
                        <div className="bg-primary text-primary-foreground mb-1 flex w-[45px] flex-col items-center rounded-md px-1 text-xs">
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
        },
      )}
    </Accordion>
  );
}
