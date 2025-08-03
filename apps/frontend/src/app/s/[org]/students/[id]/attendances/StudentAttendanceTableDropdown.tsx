"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
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

import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

export function StudentAttendanceTableDropdown({
  id,
  type,
}: {
  id: number;
  type: string;
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className="size-7">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
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
                id: id,
                type: type as
                  | "absence"
                  | "lateness"
                  | "consigne"
                  | "exclusion"
                  | "chatter",
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
