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

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { CreateEditReligion } from "./CreateEditReligion";

export function ReligionTableAction({
  id,
  name,
}: {
  id: string;

  name: string;
}) {
  const { t } = useLocale();
  const confirm = useConfirm();
  const router = useRouter();
  const utils = api.useUtils();
  const { openModal } = useModal();
  const deleteReligion = api.religion.delete.useMutation({
    onSettled: () => utils.religion.invalidate(),
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
              view: <CreateEditReligion id={id} name={name} />,
            });
          }}
        >
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>

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
              deleteReligion.mutate(id);
            }
          }}
        >
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
