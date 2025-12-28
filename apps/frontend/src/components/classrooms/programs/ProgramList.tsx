"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { decode } from "entities";
import { parseAsInteger, useQueryState } from "nuqs";

import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function ProgramList({ classroomId }: { classroomId: string }) {
  const trpc = useTRPC();
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(classroomId),
  );

  const [subjectId, setSubjectId] = useQueryState("subjectId", parseAsInteger);

  return (
    <div className="h-screen overflow-y-auto border-r">
      <ul>
        {subjects.map((subject, index) => (
          <li
            key={index}
            onClick={() => {
              void setSubjectId(subject.id);
            }}
            className={cn(
              `hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer flex-row items-center gap-2 border-b p-1`,
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
            <Label>{decode(subject.course.name)}</Label>
          </li>
        ))}
      </ul>
    </div>
  );
}
