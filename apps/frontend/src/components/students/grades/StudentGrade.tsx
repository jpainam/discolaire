"use client";

import _ from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";

import { api } from "~/trpc/react";
import { ByChronologicalOrder } from "./ByChronologicalOrder";
import { BySubject } from "./BySubject";

interface StudentGradeProps {
  classroomId: string;
  studentId: string;
}
export function StudentGrade({ classroomId, studentId }: StudentGradeProps) {
  const [term] = useQueryState("term", parseAsInteger);

  const studentGradesQuery = api.student.grades.useQuery({
    id: studentId,
    termId: term ?? undefined,
  });
  const [items, setItems] = useState<RouterOutputs["student"]["grades"]>([]);
  const [view] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });

  const [orderBy, setOrderBy] = useState<"subject" | "grade">("grade");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { t } = useLocale();

  const classroomMoyMinMaxGrades =
    api.classroom.getMinMaxMoyGrades.useQuery(classroomId);

  useEffect(() => {
    if (!studentGradesQuery.data) return;
    let sortedGrades = [...studentGradesQuery.data];
    if (term) {
      sortedGrades = studentGradesQuery.data.filter(
        (g) => g.gradeSheet.termId === Number(term)
      );
    }
    if (orderBy == "grade") {
      sortedGrades = _.sortBy(sortedGrades, (grade) => grade.grade);
    } else {
      sortedGrades = _.sortBy(
        sortedGrades,
        (grade) => grade.gradeSheet.subject.course.name
      );
    }
    if (sortOrder === "desc") {
      sortedGrades.reverse();
    }
    setItems(sortedGrades);
  }, [orderBy, sortOrder, studentGradesQuery.data, term]);

  if (classroomMoyMinMaxGrades.isError) {
    toast.error(classroomMoyMinMaxGrades.error.message);
    return null;
  }
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-between gap-4 border-b border-r bg-muted/50 py-1 px-4">
        <Button
          variant={"ghost"}
          onClick={() => {
            if (orderBy === "subject") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setOrderBy("subject");
              setSortOrder("asc");
            }
          }}
        >
          {t("subject")}{" "}
          {orderBy === "subject" && sortOrder === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
        <Button
          variant={"ghost"}
          onClick={() => {
            if (orderBy === "grade") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setOrderBy("grade");
              setSortOrder("asc");
            }
          }}
        >
          {t("grade")}
          {orderBy === "grade" && sortOrder === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
      {classroomMoyMinMaxGrades.isPending && (
        <div className="grid w-full grid-cols-2 gap-2 py-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      )}
      {items.length === 0 && !studentGradesQuery.isPending && (
        <EmptyState title={t("no_grades")} className="my-8" />
      )}
      <ScrollArea className="flex h-[calc(100vh-15rem)] rounded-b-sm border-b border-r">
        {view === "by_chronological_order" && (
          <ByChronologicalOrder
            grades={items}
            minMaxMoy={classroomMoyMinMaxGrades.data ?? []}
          />
        )}
        {view === "by_subject" && (
          <BySubject
            minMaxMoy={classroomMoyMinMaxGrades.data ?? []}
            grades={items}
          />
        )}
      </ScrollArea>
    </div>
  );
}
