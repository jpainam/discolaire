"use client";

import { useCallback } from "react";
import { useParams } from "next/navigation";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsInteger, parseAsStringLiteral, useQueryState } from "nuqs";

import { EmptyComponent } from "~/components/EmptyComponent";
import { MasterDetail } from "~/components/MasterDetail";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";
import { ByChronologicalOrder } from "./ByChronologicalOrder";
import { BySubject } from "./BySubject";
import { StudentGradeDetails } from "./StudentGradeDetails";

export function StudentGrade() {
  const params = useParams<{ id: string }>();
  const studentId = params.id;

  const [gradeId] = useQueryState("gradeId", parseAsInteger);
  const [gradesheetId] = useQueryState("gradesheetId", parseAsInteger);
  const trpc = useTRPC();
  const { data: student, isPending } = useQuery(
    trpc.student.get.queryOptions(params.id),
  );
  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({
      id: studentId,
    }),
  );

  const [view] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });

  const [orderBy, setOrderBy] = useQueryState(
    "orderBy",
    parseAsStringLiteral(["subject", "grade"]).withDefault("grade"),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "sortOrder",
    parseAsStringLiteral(["asc", "desc"]).withDefault("asc"),
  );

  const t = useTranslations();

  const handleSort = useCallback(
    (field: "subject" | "grade") => {
      if (orderBy === field) {
        void setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        void setOrderBy(field);
        void setSortOrder("asc");
      }
    },
    [orderBy, sortOrder, setOrderBy, setSortOrder],
  );

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton className="h-8" key={index} />
        ))}
      </div>
    );
  }

  const classroom = student?.classroom;

  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  const evaluated = grades.filter((g) => !g.isAbsent);
  if (grades.length == 0 || evaluated.length == 0) {
    return (
      <EmptyComponent
        title="Aucune notes"
        description="Cette élève ne possède aucune note"
      />
    );
  }

  return (
    <MasterDetail
      listHeader={
        <div className="flex flex-row justify-between gap-4 px-4 py-1.5">
          <Button variant="ghost" onClick={() => handleSort("subject")}>
            {t("subject")}{" "}
            {orderBy === "subject" && sortOrder === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" onClick={() => handleSort("grade")}>
            {t("grade")}
            {orderBy === "grade" && sortOrder === "asc" ? (
              <ChevronUp className="ml-2 h-4 w-4" />
            ) : (
              <ChevronDown className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      }
      list={
        view === "by_subject" ? (
          <BySubject grades={grades} />
        ) : (
          <ByChronologicalOrder grades={grades} classroomId={classroom.id} />
        )
      }
      detail={
        gradeId && gradesheetId ? (
          <StudentGradeDetails gradeId={gradeId} gradesheetId={gradesheetId} />
        ) : (
          <EmptyComponent
            title="Choisir une note"
            description="Veuillez choisir une note pour commencer"
          />
        )
      }
    />
  );
}
