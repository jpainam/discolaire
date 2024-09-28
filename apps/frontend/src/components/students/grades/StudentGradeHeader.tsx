"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";
import { Skeleton } from "@repo/ui/skeleton";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { api } from "~/trpc/react";

export function StudentGradeHeader({
  studentId,
  classroomId,
}: {
  studentId: string;
  classroomId: string;
}) {
  const { t } = useLocale();
  // const searchParams = useSearchParams();
  const [term, setTerm] = useQueryState("term", parseAsInteger);
  const studentGradesQuery = api.student.grades.useQuery({
    id: studentId,
    termId: term ? Number(term) : undefined,
  });

  // const router = useRouter();

  const [studentAvg, setStudentAvg] = useState<number | null>(null);
  const [classroomAvg, setClassroomAvg] = useState<number | null>(null);

  const classroomMinMaxMoyGrades =
    api.classroom.getMinMaxMoyGrades.useQuery(classroomId);

  useEffect(() => {
    let gradeSum = 0;
    let coeffSum = 0;

    if (term) {
      classroomMinMaxMoyGrades.data?.forEach((grade) => {
        if (grade.termId == Number(term)) {
          gradeSum += (grade.avg ?? 0) * (grade.coefficient ?? 0);
          coeffSum += grade.coefficient ?? 0;
        }
      });
      setClassroomAvg(gradeSum / (coeffSum || 1e9));
    } else {
      setClassroomAvg(null);
    }
  }, [classroomMinMaxMoyGrades.data, term]);

  useEffect(() => {
    let gradeSum = 0;
    let coeffSum = 0;
    if (!studentGradesQuery.data) return;
    if (term) {
      studentGradesQuery.data.forEach((grade) => {
        if (grade.gradeSheet.termId == Number(term)) {
          gradeSum += grade.grade * grade.gradeSheet.subject.coefficient;
          coeffSum += grade.gradeSheet.subject.coefficient;
        }
      });
      setStudentAvg(gradeSum / (coeffSum || 1e9));
    } else {
      setStudentAvg(null);
    }
  }, [studentGradesQuery.data, term]);

  // const { createQueryString } = useCreateQueryString();
  // const toggleItems = [
  //   { value: "by_chronological_order", label: t("by_chronological_order") },
  //   { value: "by_subject", label: t("bySubject") },
  // ];
  if (classroomMinMaxMoyGrades.isPending) {
    return <Skeleton className="h-8 w-full" />;
  }
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      <Label>{t("term")}</Label>
      <TermSelector
        className="w-[300px]"
        showAllOption={true}
        onChange={(val) => {
          void setTerm(Number(val));
        }}
        defaultValue={term ? `${term}` : undefined}
      />
      {/* <ToggleSelector
        items={toggleItems}
        defaultValue={searchParams.get("view") ?? "by_chronological_order"}
        onChange={(v) => {
          router.push(
            "?" +
              createQueryString({
                view: v,
              }),
          );
        }}
      /> */}
      {studentAvg && (
        <FlatBadge variant={"yellow"}>
          {t("student_general_avg")} : {studentAvg.toFixed(2)}
        </FlatBadge>
      )}

      {classroomAvg ? (
        <FlatBadge variant={"pink"}>
          {t("classroom_general_avg")} : {classroomAvg.toFixed(2)}
        </FlatBadge>
      ) : (
        <></>
      )}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("student_grade_list")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("student_grade_list")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />{" "}
              {t("details_of_the_selected_grade")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />{" "}
              {t("details_of_the_selected_grade")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
