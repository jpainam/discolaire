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

import { useRouter } from "~/hooks/use-router";
import { api } from "~/trpc/react";
import { CreateEditStaffLevel } from "./CreateEditStaffLevel";

export function StaffLevelTableAction({
  id,
  name,
}: {
  id: number;

  name: string;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteDegreeMutation = api.degree.delete.useMutation({
    onSettled: () => utils.degree.invalidate(),
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
        <DropdownMenuItem
          onClick={() => {
            openModal({
              className: "w-[400px]",
              title: t("edit"),
              view: <CreateEditStaffLevel id={id} name={name} />,
            });
          }}
        >
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-[#FF666618] focus:text-destructive"
          onSelect={async () => {
            const isConfirmed = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-5 w-5 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-1",
              },
            });
            if (isConfirmed) {
              toast.loading(t("deleting"), { id: 0 });
              deleteDegreeMutation.mutate(id);
            }
          }}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
