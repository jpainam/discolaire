"use client";
import { routes } from "@/configs/routes";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

import { Grade } from "@/types/grade";
import { useDateFormat } from "@/utils/date-format";
import { useParams, useRouter } from "next/navigation";
interface ByChronologicalOrderProps {
  grades: Grade[];
  minMaxMoy: {
    min: number | null;
    max: number | null;
    avg: number | null;
    gradeSheetId: number;
    weight: number;
    subjectId: number;
    termId: number;
    name: string;
    coefficient: number | null;
  }[];
}
export function ByChronologicalOrder({
  grades,
  minMaxMoy,
}: ByChronologicalOrderProps) {
  const router = useRouter();
  const params = useParams() as { id: string; gradeId: string };
  const { createQueryString } = useCreateQueryString();
  const { monthFormatter, dayFormatter } = useDateFormat();

  const { t } = useLocale();
  return (
    <div>
      {grades.map((grade) => {
        const m = grade?.createdAt
          ? monthFormatter.format(grade?.createdAt)
          : "";
        const d = grade?.createdAt ? dayFormatter.format(grade?.createdAt) : "";
        return (
          <div
            onClick={() => {
              // setSelectedGrade(grade);
              // setCurrentMinMaxMoy(
              //   minMaxMoy.find((g) => g.id === grade.gradeSheetId) || null
              // );
              // router.push(`#${grade.id}`);
              const query = {
                color: grade.gradeSheet?.subject?.course?.color ?? "lightgray",
                name: grade.gradeSheet?.name,
                gradesheetId: grade.gradeSheetId.toString(),
                reportName: grade.gradeSheet?.subject?.course?.name,
                date: grade.gradeSheet?.createdAt?.toISOString(),
                grade: grade.grade,
                termName: grade.gradeSheet?.term?.name,
                moy: minMaxMoy
                  ?.find((g) => g.gradeSheetId === grade.gradeSheetId)
                  ?.avg?.toFixed(2),
                max: minMaxMoy
                  ?.find((g) => g.gradeSheetId === grade.gradeSheetId)
                  ?.max?.toFixed(2),
                min: minMaxMoy
                  ?.find((g) => g.gradeSheetId === grade.gradeSheetId)
                  ?.min?.toFixed(2),
                coef: grade.gradeSheet?.subject?.coefficient?.toString() ?? "-",
              };
              router.push(
                `${routes.students.grades(params.id)}/${grade?.id}/?${createQueryString({ ...query })}`
              );
            }}
            key={grade.id}
            className={cn(
              "flex cursor-pointer flex-row gap-4 items-center border-b border-accent py-2 px-4",
              grade.id === Number(params?.gradeId) ? "bg-accent" : "bg-none"
            )}
          >
            <div className="flex w-auto  justify-center flex-col">
              <div className="bg-secondary px-1 text-xs mb-1 flex flex-col items-center rounded-md">
                <div>{d}</div>
                <div>{m}</div>
              </div>
              <div
                className="w-full h-1 rounded-sm"
                style={{
                  backgroundColor:
                    grade.gradeSheet?.subject?.course?.color ?? "lightgray",
                }}
              ></div>
            </div>
            <div className="flex flex-col gap-0">
              <div className="uppercase text-sm py-0 font-bold">
                {grade.gradeSheet?.subject?.course?.name}
              </div>
              <div className="text-sm py-0  text-muted-foreground">
                {grade.gradeSheet?.name}
              </div>
              <div className="py-0 text-xs text-muted-foreground">
                {t("average_of_classroom")}{" "}
                {minMaxMoy
                  ?.find((g) => g.gradeSheetId === grade.gradeSheetId)
                  ?.avg?.toFixed(2)}
              </div>
            </div>
            <div className="ml-auto text-sm flex flex-col">
              <span className=" font-bold">{grade.grade}</span>
              <span className="text-muted-foreground text-xs">
                {grade.gradeSheet?.term?.name}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
