"use client";

import { useParams } from "next/navigation";

import type { RouterOutputs } from "@repo/api";

import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { cn } from "~/lib/utils";

export function SubjectList({
  classroomId,
  subjects,
}: {
  classroomId: string;
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const router = useRouter();
  const { t } = useLocale();
  const params = useParams<{ subjectId: string }>();

  return (
    <div className="overflow-y-auto border-r text-sm">
      {/* <h2 className="mb-4 text-xl font-bold">{t("courses")}</h2> */}
      <ul>
        <li
          onClick={() => {
            router.push(`/classrooms/${classroomId}/teaching_session`);
          }}
          className={cn(
            `hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer flex-row items-center gap-2 border-b p-2`,
            !params.subjectId ? "bg-muted text-muted-foreground font-bold" : "",
          )}
        >
          <div
            className="h-6 w-1 rounded-lg"
            style={{
              backgroundColor: "red",
            }}
          ></div>
          <span>{t("all")}</span>
        </li>
        {subjects.map((subject, index) => (
          <li
            key={index}
            onClick={() => {
              router.push(
                `/classrooms/${classroomId}/teaching_session/${subject.id}`,
              );
            }}
            className={cn(
              `hover:bg-secondary hover:text-secondary-foreground flex cursor-pointer flex-row items-center gap-2 border-b p-2`,
              subject.id === Number(params.subjectId)
                ? "bg-muted text-muted-foreground font-bold"
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
