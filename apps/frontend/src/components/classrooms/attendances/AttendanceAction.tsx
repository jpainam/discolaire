"use client";

import {
  Columns4,
  Eye,
  MailCheckIcon,
  MoreVerticalIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
          <Eye />
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
              icon: <Trash2 className="text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-1",
              },
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
