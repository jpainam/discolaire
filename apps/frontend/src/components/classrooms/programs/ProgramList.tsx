"use client";

import { useParams } from "next/navigation";

import { Skeleton } from "@repo/ui/skeleton";

import { useRouter } from "~/hooks/use-router";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function ProgramList({ classroomId }: { classroomId: string }) {
  const subjectsQuery = api.classroom.subjects.useQuery({ id: classroomId });
  const router = useRouter();
  const params = useParams<{ subjectId: string }>();
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
              router.push(
                `/datum/classrooms/${classroomId}/programs/${subject.id}`,
              );
            }}
            className={cn(
              `flex cursor-pointer flex-row items-center gap-2 border-b p-2 hover:bg-secondary`,
              subject.id === Number(params.subjectId)
                ? "bg-secondary font-bold text-secondary-foreground"
                : "text-secondary-foreground/80 hover:bg-secondary/10",
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
