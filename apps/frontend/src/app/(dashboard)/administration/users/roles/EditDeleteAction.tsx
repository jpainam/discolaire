"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

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

import { CreateEditRole } from "~/components/administration/users/CreateEditRole";
import { api } from "~/trpc/react";

interface EditDeleteActionProps {
  id: string;
  name: string;
  description?: string;
}
export function EditDeleteAction({
  id,
  name,
  description,
}: EditDeleteActionProps) {
  const { t } = useLocale();
  const { openModal } = useModal();
  const confirm = useConfirm();
  const utils = api.useUtils();
  const deleteRoleMutation = api.role.delete.useMutation({
    onSettled: () => utils.role.invalidate(),
    onSuccess: () => {
      toast.success(t("deleted_successfully"), { id: 0 });
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
        <DropdownMenuItem
          onSelect={() => {
            openModal({
              className: "w-96",
              title: t("edit") + " - " + t("role"),
              view: (
                <CreateEditRole id={id} name={name} description={description} />
              ),
            });
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="size-4 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              deleteRoleMutation.mutate(id);
            }
          }}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
