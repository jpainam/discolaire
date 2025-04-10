"use client";

import { DownloadCloud, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useLocale } from "~/i18n";
import { useConfirm } from "~/providers/confirm-dialog";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFileFromAws, downloadFileFromAws } from "~/actions/upload";
import { getErrorMessage } from "~/lib/handle-error";
import { useTRPC } from "~/trpc/react";

export function DocumentTableAction({
  documentId,
  url,
}: {
  documentId: string;
  url: string;
}) {
  const { t } = useLocale();

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteDocumentMutation = useMutation(
    trpc.document.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.document.all.pathFilter());
        toast.success(t("deleted_successfully"), { id: 0 });
        await deleteFileFromAws(url);
      },
      onError: (error) => {
        toast.error(error.message, { id: 0 });
      },
    })
  );
  const confirm = useConfirm();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Pencil />
          {t("edit")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            toast.promise(downloadFileFromAws(url), {
              success: (signedUrl) => {
                window.open(signedUrl, "_blank");
                return t("downloaded");
              },
              loading: t("downloading"),
              error: (error) => {
                return getErrorMessage(error);
              },
            });
          }}
        >
          <DownloadCloud className="mr-2 h-4 w-4" />
          {t("download")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="dark:data-[variant=destructive]:focus:bg-destructive/10"
          onSelect={async () => {
            const isConfirm = await confirm({
              title: t("delete"),
              description: t("delete_confirmation"),
              icon: <Trash2 className="h-4 w-4 text-destructive" />,
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
          <Trash2 />
          {t("delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
