"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import _ from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";

import { EmptyComponent } from "~/components/EmptyComponent";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { ByChronologicalOrder } from "./ByChronologicalOrder";
import { BySubject } from "./BySubject";

export function StudentGrade({ classroomId }: { classroomId: string }) {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: moyMinMaxGrades } = useSuspenseQuery(
    trpc.classroom.getMinMaxMoyGrades.queryOptions(classroomId),
  );
  const { data: grades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({
      id: params.id,
    }),
  );

  const [term] = useQueryState("term", parseAsString);

  const [view] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });

  const [orderBy, setOrderBy] = useState<"subject" | "grade">("grade");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { t } = useLocale();

  const sortedGrades = useMemo(() => {
    let filteredGrades = grades;
    if (term) {
      filteredGrades = grades.filter((g) => g.gradeSheet.termId === term);
    }

    const sorted =
      orderBy === "grade"
        ? _.sortBy(filteredGrades, (grade) => grade.grade)
        : _.sortBy(
            filteredGrades,
            (grade) => grade.gradeSheet.subject.course.name,
          );

    return sortOrder === "desc" ? sorted.reverse() : sorted;
  }, [orderBy, sortOrder, grades, term]);

  const handleSort = useCallback(
    (field: "subject" | "grade") => {
      if (orderBy === field) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setOrderBy(field);
        setSortOrder("asc");
      }
    },
    [orderBy, sortOrder, setOrderBy, setSortOrder],
  );

  return (
    <div className="flex flex-col">
      <div className="bg-muted/50 flex flex-row justify-between gap-4 border-r border-b px-4 py-1">
        <Button variant={"ghost"} onClick={() => handleSort("subject")}>
          {t("subject")}{" "}
          {orderBy === "subject" && sortOrder === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
        <Button variant={"ghost"} onClick={() => handleSort("subject")}>
          {t("grade")}
          {orderBy === "grade" && sortOrder === "asc" ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>

      {sortedGrades.length === 0 && <EmptyComponent title={t("no_data")} />}
      <ScrollArea className="flex h-[calc(100vh-21rem)] rounded-b-sm border-r border-b">
        {view === "by_chronological_order" && (
          <ByChronologicalOrder
            grades={sortedGrades}
            minMaxMoy={moyMinMaxGrades}
          />
        )}
        {view === "by_subject" && (
          <BySubject minMaxMoy={moyMinMaxGrades} grades={sortedGrades} />
        )}
      </ScrollArea>
    </div>
  );
}
