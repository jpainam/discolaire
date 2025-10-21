"use client";

import { useQuery } from "@tanstack/react-query";
import { parseAsInteger, useQueryState } from "nuqs";

import { Skeleton } from "@repo/ui/components/skeleton";

import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ProgramList({ classroomId }: { classroomId: string }) {
  const trpc = useTRPC();
  const subjectsQuery = useQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const [subjectId, setSubjectId] = useQueryState("subjectId", parseAsInteger);
  if (subjectsQuery.isPending) {
    return (
      <div className="flex w-[350px] flex-col gap-2 p-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  const subjects = subjectsQuery.data ?? [];
  return (
    <div className="overflow-y-auto border-r text-sm">
      {/* <h2 className="mb-4 text-xl font-bold">{t("courses")}</h2> */}
      <ul>
        {subjects.map((subject, index) => (
          <li
            key={index}
            onClick={() => {
              void setSubjectId(subject.id);
            }}
            className={cn(
              `hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer flex-row items-center gap-2 border-b p-2`,
              subject.id === subjectId
                ? "bg-secondary text-secondary-foreground"
                : "",
            )}
          >
            <div
              className="h-6 w-1 rounded-lg"
              style={{
                backgroundColor: subject.course.color,
              }}
            ></div>
            <span>{subject.course.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
