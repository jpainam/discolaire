"use client";

import { MoreHorizontal, Pencil, Trash2, UserRoundPlus } from "lucide-react";
import { FaUserPlus } from "react-icons/fa";
import { toast } from "sonner";

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

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";
import { CreateEditFinanceGroup } from "./CreateEditFinanceGroup";

export function GroupTableAction({
  canDelete,
  canAdd,
  canEdit,
  id,
  name,
  type,
  value,
}: {
  canDelete: boolean;
  canEdit: boolean;
  id: string;
  canAdd: boolean;
  name: string;
  type: "AMOUNT" | "PERCENT";
  value: number;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const { openModal } = useModal();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteFinanceGroup = useMutation(
    trpc.accounting.deleteGroup.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.accounting.groups.pathFilter()
        );
        toast.success(t("deleted_successfully"), { id: 0 });
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canAdd && (
          <>
            <DropdownMenuItem>
              <UserRoundPlus className="h-4 w-4" />
              {t("students")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaUserPlus className="h-4 w-4" />
              {t("staffs")}
            </DropdownMenuItem>
          </>
        )}
        {canEdit && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                openModal({
                  className: "w-[400px] p-2",
                  title: t("edit"),
                  view: (
                    <CreateEditFinanceGroup
                      id={id}
                      name={name}
                      type={type}
                      value={value}
                    />
                  ),
                });
              }}
            >
              <Pencil />
              {t("edit")}
            </DropdownMenuItem>
          </>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="dark:data-[variant=destructive]:focus:bg-destructive/10"
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
                  deleteFinanceGroup.mutate(id);
                }
              }}
            >
              <Trash2 />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
