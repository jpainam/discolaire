"use client";

import { useRouter } from "next/navigation";
import { Columns4Icon, MailIcon, MoreVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { useConfirm } from "@repo/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

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
        <DropdownMenuItem
          onSelect={() => {
            if (type == "lateness") {
              const lateness = attendance as LatenessType;
              openModal({
                className: "w-[400px]",
                title: t("justify_lateness"),
                view: <JustifyLateness lateness={lateness} />,
              });
            }
          }}
        >
          <Columns4Icon className="mr-2 h-4 w-4" />
          {t("justify")}
        </DropdownMenuItem>
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
                toast.error(error.message, { id: 0 });
              });
          }}
        >
          <MailIcon className="mr-2 h-4 w-4" />
          {t("notify")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-6 w-6 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-1",
              },
            });

            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              deleteAttendance.mutate([{ id: id, type: type }]);
            }
          }}
          className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
