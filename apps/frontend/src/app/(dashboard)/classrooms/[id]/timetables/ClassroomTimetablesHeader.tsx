"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { CalendarDays, MailIcon, PlusIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";
import { CreateClassroomTimetable } from "./CreateClassroomTimetable";

export function ClassroomTimetablesHeader({
  initialSubjectId,
}: {
  initialSubjectId?: number;
}) {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const classroomId = params.id;
  const { openModal } = useModal();
  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );
  return (
    <div className="bg-muted/50 grid items-center gap-2 border-y px-4 py-1 md:flex">
      <div className="hidden items-center gap-1 md:flex">
        <CalendarDays />
        <Label>{t("timetable")}</Label>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <MailIcon />
              {t("notify")}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>{t("teachers")}</DropdownMenuItem>
            <DropdownMenuItem>{t("parents")}</DropdownMenuItem>
            <DropdownMenuItem>{t("students")}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={() => {
            openModal({
              title: t("create"),
              description: `${classroom.name} - ${t("timetable")}`,
              className: "sm:max-w-xl",
              view: (
                <CreateClassroomTimetable
                  classroomId={classroomId}
                  initialSubjectId={initialSubjectId}
                />
              ),
            });
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
