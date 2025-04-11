"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
import { CreateEditRole } from "~/components/administration/users/CreateEditRole";
import { useTRPC } from "~/trpc/react";

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
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteRoleMutation = useMutation(
    trpc.role.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.role.pathFilter());
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
          <Pencil />
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
