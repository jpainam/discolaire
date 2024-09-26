"use client";

import { DownloadCloud, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/hooks/use-locale";
import { useRouter } from "@repo/hooks/use-router";
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

export function DocumentTableAction({ documentId }: { documentId: string }) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();
  const deleteDocumentMutation = api.document.delete.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: () => {
      router.refresh();
      toast.success(t("deleted_successfully"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
  });
  const confirm = useConfirm();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          {t("edit")}
        </DropdownMenuItem>

        <DropdownMenuItem>
          <DownloadCloud className="mr-2 h-4 w-4" />
          {t("download")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            const isConfirm = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-6 w-6 text-destructive" />,
              alertDialogTitle: {
                className: "flex items-center gap-2",
              },
            });
            if (isConfirm) {
              toast.loading(t("deleting"), { id: 0 });
              deleteDocumentMutation.mutate(documentId);
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
