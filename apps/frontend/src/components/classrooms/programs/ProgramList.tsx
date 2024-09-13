"use client";

import { useParams } from "next/navigation";

import { useRouter } from "@repo/hooks/use-router";
import { Skeleton } from "@repo/ui/skeleton";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ProgramList({ classroomId }: { classroomId: string }) {
  const params = useParams<{ id: string; subjectId: string }>();
  const router = useRouter();
  const subjectsQuery = api.classroom.subjects.useQuery({ id: params.id });
  const subjects = subjectsQuery.data;
  if (subjectsQuery.isPending) {
    return (
      <div className="flex w-[350px] flex-col gap-2 p-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-full" />
        ))}
      </div>
    );
  }
  return (
    <nav className="flex w-[350px] flex-col overflow-hidden border-r">
      {subjects?.map((subj, index) => {
        return (
          <div
            key={`${subj.id}-${index}`}
            className={cn(
              "flex cursor-pointer flex-col justify-center border-b",
              subj.id === Number(params.subjectId)
                ? "bg-secondary text-secondary-foreground"
                : "text-secondary-foreground/80 hover:bg-secondary/10",
            )}
            onClick={() => {
              router.push(
                routes.classrooms.programs(params.id) + "/" + subj.id,
              );
            }}
          >
            <div className="flex h-10 flex-row items-center gap-2 px-2">
              <div
                className="h-6 w-1 rounded-lg"
                style={{
                  backgroundColor: subj.course?.color ?? "lightgray",
                }}
              ></div>
              <div className="truncate text-sm">{subj.course?.name}</div>
            </div>
          </div>
        );
      })}
      <div></div>
    </nav>
  );
}
