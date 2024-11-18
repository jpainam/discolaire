"use client";

import { useEffect, useState } from "react";
import { LayoutGridIcon, ListIcon, MoreVertical } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useCreateQueryString } from "@repo/hooks/create-query-string";
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
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/toggle-group";

import { printStudentGrade } from "~/actions/reporting";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";
import { getFullName } from "~/utils/full-name";

export function StudentGradeHeader({
  student,
  classroomId,
}: {
  student: RouterOutputs["student"]["get"];
  classroomId: string;
}) {
  const { t } = useLocale();
  // const searchParams = useSearchParams();
  const [term] = useQueryState("term", parseAsInteger);
  const [_, setView] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });
  const studentGradesQuery = api.student.grades.useQuery({
    id: student.id,
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

  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const utils = api.useUtils();

  if (classroomMinMaxMoyGrades.isPending) {
    return (
      <div className="border-b py-2">
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      <Label>{t("term")}</Label>
      <TermSelector
        className="w-[300px]"
        showAllOption={true}
        onChange={(val) => {
          //void setTerm(Number(val));
          router.push(
            "?" +
              createQueryString({
                term: val,
              }),
          );
        }}
        defaultValue={term ? `${term}` : undefined}
      />

      <>
        <FlatBadge variant={"yellow"}>
          {t("student_general_avg")} : {studentAvg?.toFixed(2)}
        </FlatBadge>
      </>

      {classroomAvg && (
        <FlatBadge variant={"blue"}>
          {t("classroom_general_avg")} : {classroomAvg.toFixed(2)}
        </FlatBadge>
      )}
      <div className="ml-auto flex flex-row items-center gap-2">
        <ToggleGroup
          defaultValue="by_chronological_order"
          onValueChange={(v) => {
            void setView(v);
          }}
          type="single"
        >
          <ToggleGroupItem
            value="by_chronological_order"
            className="rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            aria-label="Toggle by_chronological_order"
          >
            <ListIcon className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem
            className="rounded-sm data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            value="by_subject"
            aria-label="Toggle by_subject"
          >
            <LayoutGridIcon className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(
                  printStudentGrade({
                    studentId: student.id,
                    title: `${getFullName(student)} - ${t("grades")}`,
                    termId: term,
                    type: "pdf",
                  }),
                  {
                    loading: t("printing"),
                    success: () => {
                      void utils.reporting.invalidate();
                      return t("printing_job_submitted");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              }}
            >
              <PDFIcon className="mr-2 h-4 w-4" /> {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                toast.promise(
                  printStudentGrade({
                    studentId: student.id,
                    title: `${getFullName(student)} - ${t("grades")}`,
                    termId: term,
                    type: "excel",
                  }),
                  {
                    loading: t("printing"),
                    success: () => {
                      void utils.reporting.invalidate();
                      return t("printing_job_submitted");
                    },
                    error: (error) => {
                      return getErrorMessage(error);
                    },
                  },
                );
              }}
            >
              <XMLIcon className="mr-2 h-4 w-4" /> {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
