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

import { deleteFileFromAws, downloadFileFromAws } from "~/actions/upload";
import { useRouter } from "~/hooks/use-router";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function DocumentTableAction({
  documentId,
  url,
}: {
  documentId: string;
  url: string;
}) {
  const { t } = useLocale();
  const utils = api.useUtils();
  const router = useRouter();

  const deleteDocumentMutation = api.document.delete.useMutation({
    onSettled: async () => {
      await utils.document.invalidate();
    },
    onSuccess: async () => {
      router.refresh();
      toast.success(t("deleted_successfully"), { id: 0 });
      try {
        await deleteFileFromAws(url);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        toast.error(error?.message, { id: 0 });
      }
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
