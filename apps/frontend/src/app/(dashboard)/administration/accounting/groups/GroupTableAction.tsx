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

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
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
  const router = useRouter();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteFinanceGroup = api.accounting.deleteGroup.useMutation({
    onSettled: () => utils.accounting.groups.invalidate(),
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
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canAdd && (
          <>
            <DropdownMenuItem>
              <UserRoundPlus className="mr-2 h-4 w-4" />
              {t("students")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaUserPlus className="mr-2 h-4 w-4" />
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
              <Pencil className="mr-2 h-4 w-4" />
              {t("edit")}
            </DropdownMenuItem>
          </>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
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
                  deleteFinanceGroup.mutate(id);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("delete")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
