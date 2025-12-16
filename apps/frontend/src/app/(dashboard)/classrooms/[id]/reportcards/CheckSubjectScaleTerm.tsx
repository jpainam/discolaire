"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleAlert } from "lucide-react";

import type { RouterOutputs } from "@repo/api";

import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

export function CheckSubjectScale({
  termId,
  classroomId,
  subjects,
}: {
  termId: string;
  classroomId: string;
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const trpc = useTRPC();
  const allweightsQuery = useQuery(
    trpc.gradeSheet.subjectWeight.queryOptions({
      classroomId,
      termId: [termId],
    }),
  );

  const allweights = allweightsQuery.data ?? [];
  if (allweightsQuery.isPending) {
    return <Skeleton className="h-10" />;
  }

  const areNot100percent = allweights.filter((s) => !s.weight || s.weight < 1);
  if (areNot100percent.length == 0) {
    return <></>;
  }

  return (
    <div className="px-4">
      <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
        <p className="text-sm">
          <CircleAlert
            className="me-3 -mt-0.5 inline-flex opacity-60"
            size={16}
            aria-hidden="true"
          />
          Les cours suivants n'ont pas un poids de 100%:
          {areNot100percent.map((a, index) => {
            const subject = subjects.find((s) => s.id == a.subjectId);
            return (
              <span className="px-2" key={index}>
                {subject?.course.shortName}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
