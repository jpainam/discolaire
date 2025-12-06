"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Skeleton } from "@repo/ui/components/skeleton";

import { GradeSheetSummary } from "~/components/classrooms/gradesheets/GradeSheetSummary";
import { EmptyComponent } from "~/components/EmptyComponent";
import { useRouter } from "~/hooks/use-router";
import { useTRPC } from "~/trpc/react";

export function GradeReportTrackerDetails({
  subjectId,
  classroomId,
}: {
  subjectId: number;
  classroomId: string;
}) {
  const trpc = useTRPC();
  const { data: gradesheets, isPending } = useQuery(
    trpc.subject.gradesheets.queryOptions(subjectId),
  );

  const gradesheetIds = useMemo(
    () => (gradesheets ? gradesheets.map((gs) => gs.id) : []),
    [gradesheets],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (gradesheetIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void setCurrentIndex(0);
    } else if (currentIndex >= gradesheetIds.length) {
      setCurrentIndex(0);
    }
  }, [gradesheetIds.length, currentIndex]);

  const locale = useLocale();

  const hasGradeSheets = gradesheetIds.length > 0;
  const gradeSheetId = hasGradeSheets ? gradesheetIds[currentIndex] : undefined;

  const nextPage = useCallback(() => {
    if (!hasGradeSheets) return;
    setCurrentIndex((prev) => (prev + 1) % gradesheetIds.length);
  }, [hasGradeSheets, gradesheetIds.length]);

  const prevPage = useCallback(() => {
    if (!hasGradeSheets) return;
    setCurrentIndex((prev) =>
      prev === 0 ? gradesheetIds.length - 1 : prev - 1,
    );
  }, [hasGradeSheets, gradesheetIds.length]);

  const router = useRouter();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton className="h-20" key={index} />
        ))}
      </div>
    );
  }

  if (!hasGradeSheets) {
    return (
      <EmptyComponent
        title="Fiche de notes"
        description="Aucune fiche disponible pour cette matière"
      />
    );
  }

  const gs = gradesheets?.find((g) => g.id == gradeSheetId);

  return (
    <div className="flex h-full flex-1 flex-col space-y-2 overflow-auto pb-4">
      <div className="mx-auto flex flex-row items-center gap-6">
        <Button
          disabled={!hasGradeSheets}
          onClick={prevPage}
          size="icon-sm"
          variant="secondary"
        >
          <ChevronLeft className="size-3" />
        </Button>

        <Button
          variant={"link"}
          onClick={() => {
            router.push(
              `/classrooms/${classroomId}/gradesheets/${gradeSheetId}`,
            );
          }}
          size={"sm"}
        >
          {gs?.term.name} - {gs?.name} -{" "}
          {gs?.createdAt.toLocaleDateString(locale, {
            month: "short",
            year: "numeric",
            day: "numeric",
          })}
        </Button>

        <Button
          disabled={!hasGradeSheets}
          onClick={nextPage}
          size="icon-sm"
          variant="secondary"
        >
          <ChevronRight className="size-3" />
        </Button>
      </div>

      {gradeSheetId && (
        <GradeSheetSummary
          classroomId={classroomId}
          gradeSheetId={gradeSheetId}
        />
      )}
    </div>
  );
}
