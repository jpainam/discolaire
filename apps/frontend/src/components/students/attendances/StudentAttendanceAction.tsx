/* eslint-disable @typescript-eslint/no-unsafe-argument */
"use client";

import { Columns4Icon, MailIcon, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "~/hooks/use-router";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { JustifyAbsence } from "~/components/attendances/JustifyAbsence";
import { JustifyLateness } from "~/components/attendances/JustifyLateness";
import { api } from "~/trpc/react";

type AbsenceType = RouterOutputs["absence"]["get"];
type ChatterType = RouterOutputs["chatter"]["get"];
type ConsigneType = RouterOutputs["consigne"]["get"];
type LatenessType = RouterOutputs["lateness"]["get"];
type ExclusionType = RouterOutputs["exclusion"]["get"];

export function StudentAttendanceAction({
  type,
  id,
  attendance,
}: {
  type: "absence" | "chatter" | "consigne" | "lateness" | "exclusion";
  id: number;
  attendance:
    | AbsenceType
    | ChatterType
    | ConsigneType
    | LatenessType
    | ExclusionType;
}) {
  const { t } = useLocale();
  const router = useRouter();
  const deleteAttendance = api.attendance.delete.useMutation({
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();
  const { openModal } = useModal();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(type == "lateness" || type == "absence") && (
          <DropdownMenuItem
            onSelect={() => {
              if (type == "lateness") {
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
              } else {
                const absence = attendance as AbsenceType;
                openModal({
                  title: t("justify_absence"),
                  description: (
                    <>
                      {t("absence")}: {absence.date.toString()}
                    </>
                  ),
                  view: <JustifyAbsence absence={absence} />,
                });
              }
            }}
          >
            <Columns4Icon />
            {t("justify")}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={() => {
            toast.loading(t("sending"), { id: 0 });
            fetch("/api/emails/attendance", {
              method: "POST",
              body: JSON.stringify({ id, type }),
            })
              .then((res) => {
                if (res.ok) {
                  toast.success(t("sent_successfully"), { id: 0 });
                } else {
                  toast.error(t("error_sending"), { id: 0 });
                }
              })
              .catch((error) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                toast.error(error.message, { id: 0 });
              });
          }}
        >
          <MailIcon />
          {t("notify")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
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
              deleteAttendance.mutate([{ id: id, type: type }]);
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
