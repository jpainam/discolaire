"use client";

import _ from "lodash";
import { ChevronDown, ChevronUp } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@repo/ui/components/button";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { EmptyState } from "~/components/EmptyState";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import { ByChronologicalOrder } from "./ByChronologicalOrder";
import { BySubject } from "./BySubject";

interface StudentGradeProps {
  moyMinMaxGrades: RouterOutputs["classroom"]["getMinMaxMoyGrades"];
  grades: RouterOutputs["student"]["grades"];
}
export function StudentGrade({ grades, moyMinMaxGrades }: StudentGradeProps) {
  const [term] = useQueryState("term", parseAsInteger);

  const [view] = useQueryState("view", {
    defaultValue: "by_chronological_order",
  });

  const [orderBy, setOrderBy] = useState<"subject" | "grade">("grade");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { t } = useLocale();

  const sortedGrades = useMemo(() => {
    let filteredGrades = grades;
    if (term) {
      filteredGrades = grades.filter(
        (g) => g.gradeSheet.termId === Number(term),
      );
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
      <div className="flex flex-row justify-between gap-4 border-b border-r bg-muted/50 py-1 px-4">
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

      {sortedGrades.length === 0 && (
        <EmptyState title={t("no_data")} className="my-8" />
      )}
      <ScrollArea className="flex h-[calc(100vh-21rem)] rounded-b-sm border-b border-r">
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
