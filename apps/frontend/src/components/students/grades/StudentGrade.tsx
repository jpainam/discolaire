"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Grade } from "@prisma/client";
import _ from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { DataTableSkeleton } from "@repo/ui/data-table/data-table-skeleton";
import { ScrollArea } from "@repo/ui/scroll-area";

import { api } from "~/trpc/react";
import { ByChronologicalOrder } from "./by-chronological-order";
import { BySubject } from "./by-subject";

type StudentGradeProps = {
  classroomId: string;
  studentId: string;
};
export function StudentGrade({ classroomId, studentId }: StudentGradeProps) {
  const searchParams = useSearchParams();
  const term = searchParams.get("term");

  const studentGradesQuery = api.student.grades.useQuery({
    id: studentId,
    termId: term ? Number(term) : undefined,
  });
  const [items, setItems] = useState<Grade[]>([]);
  const view = searchParams.get("view") ?? "by_chronological_order";
  //const orderBy = searchParams.get("orderBy") ?? "grade";
  const [orderBy, setOrderBy] = useQueryState("orderBy");
  const { t } = useLocale();

  const classroomMoyMinMaxGrades =
    api.classroom.getMinMaxMoyGrades.useQuery(classroomId);

  useEffect(() => {
    if (!studentGradesQuery.data) return;
    let sortedGrades = [...studentGradesQuery.data];
    if (term) {
      sortedGrades = studentGradesQuery.data.filter(
        (g) => g.gradeSheet?.termId === Number(term),
      );
    }
    if (orderBy == "grade") {
      sortedGrades = _.sortBy(sortedGrades, (grade) => grade.grade);
      sortedGrades.reverse();
    } else {
      sortedGrades = _.sortBy(
        sortedGrades,
        (grade) => grade.gradeSheet?.subject?.course?.name,
      );
      sortedGrades.reverse();
    }
    setItems(sortedGrades);
  }, [orderBy, studentGradesQuery.data, term]);

  if (classroomMoyMinMaxGrades.isError) {
    throw classroomMoyMinMaxGrades.error;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4 border-b border-r bg-muted/50">
        <Button
          variant={"ghost"}
          onClick={() => {
            setOrderBy("subject");
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
            setOrderBy("grade");
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
        <DataTableSkeleton
          withPagination={false}
          showViewOptions={false}
          rowCount={15}
          columnCount={3}
        />
      ) : (
        <ScrollArea className="flex h-[calc(100vh-15rem)] rounded-b-sm border-b border-r">
          {view === "by_chronological_order" && (
            <ByChronologicalOrder
              grades={items}
              minMaxMoy={classroomMoyMinMaxGrades.data}
            />
          )}
          {view === "by_subject" && (
            <BySubject
              minMaxMoy={classroomMoyMinMaxGrades.data}
              grades={items}
            />
          )}
        </ScrollArea>
      )}
    </div>
  );
}
