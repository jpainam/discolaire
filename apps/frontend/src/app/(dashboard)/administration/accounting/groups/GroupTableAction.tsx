"use client";

import { MoreHorizontal, Trash2, Users } from "lucide-react";
import { FaUsers } from "react-icons/fa";
import { toast } from "sonner";

import { useRouter } from "@repo/hooks/use-router";
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

export function GroupTableAction({
  canDelete,
  canAdd,
  id,
}: {
  canDelete: boolean;
  id: string;
  canAdd: boolean;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();
  const utils = api.useUtils();
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
              <Users className="mr-2 h-4 w-4" />
              <span>+ {t("students")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FaUsers className="mr-2 h-4 w-4" />
              <span>+ {t("staffs")}</span>
            </DropdownMenuItem>
          </>
        )}

        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-destructive text-destructive-foreground"
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
