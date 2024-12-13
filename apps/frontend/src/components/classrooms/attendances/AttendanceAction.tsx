"use client";

import { useRouter } from "next/navigation";
import {
  Columns4,
  Eye,
  MailCheckIcon,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

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

import { api } from "~/trpc/react";

export function AttendanceAction({
  type,
  attendanceId,
}: {
  type: "absence" | "lateness" | "chatter" | "consigne" | "exclusion";
  attendanceId: number;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const router = useRouter();
  const deleteAttendance = api.attendance.delete.useMutation({
    onSettled: () => {
      utils.absence.invalidate();
      utils.lateness.invalidate();
      utils.chatter.invalidate();
      utils.consigne.invalidate();
      utils.exclusion.invalidate();
    },
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
        <DropdownMenuItem
          onSelect={() => {
            console.log("Viewing details of attendance", attendanceId);
          }}
        >
          <Eye className="mr-2 h-4 w-4" />
          {t("details")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            console.log("Justifying attendance", type);
          }}
        >
          <Columns4 className="mr-2 h-4 w-4" />
          {t("justify")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailCheckIcon className="mr-2 h-4 w-4" />
          {t("notify")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
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
              deleteAttendance.mutate([{ id: attendanceId, type: type }]);
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
