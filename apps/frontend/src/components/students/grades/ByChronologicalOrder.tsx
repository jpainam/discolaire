"use client";

import { useParams } from "next/navigation";
import i18next from "i18next";

import type { RouterOutputs } from "@repo/api";

import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

interface ByChronologicalOrderProps {
  grades: RouterOutputs["student"]["grades"][number][];
  minMaxMoy: RouterOutputs["classroom"]["getMinMaxMoyGrades"][number][];
}
export function ByChronologicalOrder({
  grades,
  minMaxMoy,
}: ByChronologicalOrderProps) {
  const router = useRouter();
  const params = useParams<{ id: string; gradeId: string }>();
  const { createQueryString } = useCreateQueryString();

  const { t } = useLocale();
  return (
    <div>
      {grades.map((grade) => {
        const m = grade.gradeSheet.createdAt.toLocaleDateString(
          i18next.language,
          {
            month: "short",
          },
        );
        const d = grade.gradeSheet.createdAt.toLocaleDateString(
          i18next.language,
          {
            day: "numeric",
          },
        );
        return (
          <div
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
                `${routes.students.grades(params.id)}/${grade.id}/?${createQueryString({ ...query })}`,
              );
            }}
            key={grade.id}
            className={cn(
              "border-accent flex cursor-pointer flex-row items-center gap-4 border-b px-4 py-2",
              grade.id === Number(params.gradeId) ? "bg-accent" : "bg-none",
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
                  .find((g) => g.gradeSheetId === grade.gradeSheetId)
                  ?.avg?.toFixed(2)}
              </div>
            </div>
            <div className="ml-auto flex w-[100px] flex-col text-sm">
              <span className="font-bold">{grade.grade}</span>
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
