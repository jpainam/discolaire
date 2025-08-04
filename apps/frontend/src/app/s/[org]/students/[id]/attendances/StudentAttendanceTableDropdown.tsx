"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  BadgeCheck,
  MailIcon,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import type { AttendanceRecord } from "~/components/students/attendances/student-attendance-record";
import { CreateEditJustification } from "~/components/students/attendances/CreateEditJustification";
import { useModal } from "~/hooks/use-modal";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceTableDropdown({
  record,
}: {
  record: AttendanceRecord;
}) {
  const confirm = useConfirm();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const t = useTranslations();
  const deleteAttendanceMutation = useMutation(
    trpc.attendance.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.attendance.pathFilter());
        await queryClient.invalidateQueries(trpc.absence.pathFilter());
        await queryClient.invalidateQueries(trpc.chatter.pathFilter());
        await queryClient.invalidateQueries(trpc.consigne.pathFilter());
        await queryClient.invalidateQueries(trpc.exclusion.pathFilter());
        await queryClient.invalidateQueries(trpc.lateness.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    }),
  );
  const { openModal } = useModal();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="size-7">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            openModal({
              title:
                record.justified > 0
                  ? "Update Justification"
                  : "Add Justification",
              description: (
                <>{`Provide justification for the ${record.type} record from{" "}
                        ${format(new Date(record.date), "MMMM dd, yyyy")}`}</>
              ),
              view: <CreateEditJustification record={record} />,
            });
          }}
        >
          <BadgeCheck />
          {t("justify")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem>
          <MailIcon />
          {t("notify_parents")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              deleteAttendanceMutation.mutate({
                id: record.id,
                type: record.type,
              });
            }
          }}
          variant="destructive"
        >
          <Trash />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
