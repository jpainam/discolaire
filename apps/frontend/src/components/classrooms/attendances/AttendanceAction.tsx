"use client";

import {
  Columns4,
  MailCheckIcon,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "~/hooks/use-router";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import type { RouterOutputs } from "@repo/api";
import { JustifyAbsence } from "~/components/attendances/JustifyAbsence";
import { JustifyLateness } from "~/components/attendances/JustifyLateness";
import { useModal } from "~/hooks/use-modal";
import { api } from "~/trpc/react";

type LatenessType = RouterOutputs["lateness"]["byClassroom"][number];
type AbsenceType = RouterOutputs["absence"]["byClassroom"][number];

export function AttendanceAction({
  type,
  attendanceId,
  attendance,
}: {
  type: "absence" | "lateness" | "chatter" | "consigne" | "exclusion";
  attendanceId: number;
  attendance?: AbsenceType | LatenessType;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();
  const { openModal } = useModal();
  const deleteAttendance = api.attendance.delete.useMutation({
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreVerticalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {attendance && attendance.justification && (
          <DropdownMenuItem
            variant="destructive"
            className="dark:data-[variant=destructive]:focus:bg-destructive/10"
            onSelect={() => {
              console.log("Viewing details of attendance", attendanceId);
            }}
          >
            <Columns4 />
            {t("delete_justification")}
          </DropdownMenuItem>
        )}
        {(type == "lateness" || type == "absence") &&
          !attendance?.justification && (
            <DropdownMenuItem
              onSelect={() => {
                if (type == "lateness" && attendance) {
                  const lateness = attendance as LatenessType;
                  openModal({
                    title: t("justify_lateness"),
                    description: (
                      <>
                        {t("lateness")}: {lateness.duration.toString()}
                      </>
                    ),
                    view: <JustifyLateness lateness={lateness} />,
                  });
                } else if (type == "absence" && attendance) {
                  const absence = attendance as AbsenceType;
                  openModal({
                    title: t("justify_absence"),
                    description: (
                      <>
                        {t("absence")}: {absence.value.toString()}
                      </>
                    ),
                    view: <JustifyAbsence absence={absence} />,
                  });
                }
              }}
            >
              <Columns4 />
              {t("justify")}
            </DropdownMenuItem>
          )}
        <DropdownMenuItem>
          <MailCheckIcon />
          {t("notify")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              // icon: <Trash2 className="text-destructive" />,
              // alertDialogTitle: {
              //   className: "flex items-center gap-1",
              // },
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              deleteAttendance.mutate([{ id: attendanceId, type: type }]);
            }
          }}
          variant="destructive"
          className="dark:data-[variant=destructive]:focus:bg-destructive/10"
        >
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
