"use client";

import { useParams } from "next/navigation";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CalendarDays, MailIcon, PlusIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";
import { CreateClassroomTimetable } from "./CreateClassroomTimetable";

type RecipientType = "teachers" | "parents" | "students";

export function ClassroomTimetablesHeader({
  initialSubjectId,
}: {
  initialSubjectId?: number;
}) {
  const t = useTranslations();
  const params = useParams<{ id: string }>();
  const classroomId = params.id;
  const { openModal } = useModal();
  const [staffId, setStaffId] = useQueryState("staffId");
  const confirm = useConfirm();
  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(classroomId),
  );

  const notifyTeachersMutation = useMutation({
    mutationFn: async ({
      recipientType,
      targetStaffId,
    }: {
      recipientType: RecipientType;
      targetStaffId?: string | null;
    }) => {
      const response = await fetch("/api/emails/classroom-timetable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classroomId,
          recipientType,
          staffId: targetStaffId ?? null,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to send timetable");
      }

      return (await response.json()) as {
        sent: number;
        skippedNoEmail: string[];
        recipientType: RecipientType;
        mode: "single" | "all";
      };
    },
  });

  const handleNotification = async (recipientType: RecipientType) => {
    const isTeachers = recipientType === "teachers";
    const hasSelectedTeacher = Boolean(staffId);

    if (isTeachers && !hasSelectedTeacher) {
      const shouldContinue = await confirm({
        title: t("notify"),
        description: t(
          "This will send to all teacher of the classroom, do you want to continue",
        ),
      });

      if (!shouldContinue) {
        return;
      }
    }

    if (recipientType === "parents") {
      const shouldContinue = await confirm({
        title: "Notify all parents",
        description:
          "This will send to all parents of the classroom, do you want to continue.",
      });
      if (!shouldContinue) {
        return;
      }
    }

    if (recipientType === "students") {
      const shouldContinue = await confirm({
        title: "Notify all students",
        description:
          "This will send to all students of the classroom, do you want to continue.",
      });
      if (!shouldContinue) {
        return;
      }
    }

    toast.loading(t("Processing"), { id: 0 });
    try {
      const result = await notifyTeachersMutation.mutateAsync({
        recipientType,
        targetStaffId: isTeachers ? staffId : null,
      });

      const audience =
        recipientType === "teachers"
          ? result.mode === "single"
            ? "teacher"
            : "teachers"
          : recipientType;
      const sentText = `Timetable sent to ${result.sent} ${audience}.`;
      const skippedText =
        result.skippedNoEmail.length > 0
          ? ` ${result.skippedNoEmail.length} skipped (missing email).`
          : "";

      toast.success(`${sentText}${skippedText}`, { id: 0 });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send timetable",
        { id: 0 },
      );
    }
  };

  const canCreateTimetable = useCheckPermission("timetable.create");
  const canCreateNotification = useCheckPermission("notification.create");

  return (
    <div className="bg-muted/50 grid items-center gap-2 border-y px-4 py-1 md:flex">
      <div className="hidden items-center gap-1 md:flex">
        <CalendarDays className="hidden md:flex" />
        <Label>{t("timetable")}</Label>
      </div>
      <StaffSelector
        className="w-full lg:w-1/3"
        defaultValue={staffId ?? undefined}
        onSelect={(value) => {
          void setStaffId(value || null);
        }}
      />
      <div className="ml-auto flex items-center gap-2">
        {canCreateNotification && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                <MailIcon />
                {t("notify")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={notifyTeachersMutation.isPending}
                onSelect={() => {
                  void handleNotification("teachers");
                }}
              >
                {t("teachers")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={notifyTeachersMutation.isPending}
                onSelect={() => {
                  void handleNotification("parents");
                }}
              >
                {t("parents")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={notifyTeachersMutation.isPending}
                onSelect={() => {
                  void handleNotification("students");
                }}
              >
                {t("students")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {canCreateTimetable && (
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
        )}
      </div>
    </div>
  );
}
