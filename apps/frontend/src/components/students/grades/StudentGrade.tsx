"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import _ from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { ScrollArea } from "@repo/ui/scroll-area";
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";
import { ByChronologicalOrder } from "./by-chronological-order";
import { BySubject } from "./by-subject";

interface StudentGradeProps {
  classroomId: string;
  studentId: string;
}
export function StudentGrade({ classroomId, studentId }: StudentGradeProps) {
  const searchParams = useSearchParams();
  const term = searchParams.get("term");

  const studentGradesQuery = api.student.grades.useQuery({
    id: studentId,
    termId: term ? Number(term) : undefined,
  });
  const [items, setItems] = useState<RouterOutputs["student"]["grades"]>([]);
  const [view] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });

  const [orderBy, setOrderBy] = useQueryState("orderBy");
  const { t } = useLocale();

  const classroomMoyMinMaxGrades =
    api.classroom.getMinMaxMoyGrades.useQuery(classroomId);

  useEffect(() => {
    if (!studentGradesQuery.data) return;
    let sortedGrades = [...studentGradesQuery.data];
    if (term) {
      sortedGrades = studentGradesQuery.data.filter(
        (g) => g.gradeSheet.termId === Number(term),
      );
    }
    if (orderBy == "grade") {
      sortedGrades = _.sortBy(sortedGrades, (grade) => grade.grade);
      sortedGrades.reverse();
    } else {
      sortedGrades = _.sortBy(
        sortedGrades,
        (grade) => grade.gradeSheet.subject.course.name,
      );
      sortedGrades.reverse();
    }
    setItems(sortedGrades);
  }, [orderBy, studentGradesQuery.data, term]);

  if (classroomMoyMinMaxGrades.isError) {
    toast.error(classroomMoyMinMaxGrades.error.message);
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4 border-b border-r bg-muted/50">
        <Button
          variant={"ghost"}
          onClick={() => {
            void setOrderBy("subject");
          }}
        >
          {t("subject")}{" "}
          {orderBy == "subject" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            void setOrderBy("grade");
          }}
        >
          {t("grade")}
          {orderBy == "grade" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      {classroomMoyMinMaxGrades.isPending ? (
        <div className="m-2 grid w-full grid-cols-2 gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : (
        <ScrollArea className="flex h-[calc(100vh-15rem)] rounded-b-sm border-b border-r">
          {view === "by_chronological_order" && (
            <ByChronologicalOrder
              grades={items}
              // @ts-expect-error TODO fix this
              minMaxMoy={classroomMoyMinMaxGrades.data}
            />
          )}
          {view === "by_subject" && (
            <BySubject
              // @ts-expect-error TODO fix this
              minMaxMoy={classroomMoyMinMaxGrades.data}
              grades={items}
            />
          )}
        </ScrollArea>
      )}
    </div>
  );
}
