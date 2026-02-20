"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { handleDeleteAvatar } from "~/actions/upload";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon } from "~/icons";
import { useConfirm } from "~/providers/confirm-dialog";
import { useTRPC } from "~/trpc/react";

const formatFileSize = (bytes: number | undefined): string => {
  if (!bytes || bytes === 0) return "-";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function PhotoDetails({ fileName }: { fileName: string }) {
  const { closeSheet } = useSheet();
  const t = useTranslations();
  const locale = useLocale();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const confirm = useConfirm();

  const { data: stat, isPending } = useQuery(
    trpc.photo.get.queryOptions({ key: fileName, type: "avatar" }),
  );

  const deletePhoto = async () => {
    toast.loading(t("deleting"), { id: 0 });
    const result = await handleDeleteAvatar(fileName, "student");
    if (result.success) {
      await queryClient.invalidateQueries(trpc.photo.pathFilter());
      toast.success(t("deleted_successfully"), { id: 0 });
      closeSheet();
    } else {
      toast.error("Une erreur s'est produite", { id: 0 });
    }
  };

  const shortName = fileName.split("/").pop() ?? fileName;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid flex-1 auto-rows-min gap-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="size-48">
            <AvatarImage src={`/api/download/avatars/${fileName}`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" variant={"outline"} asChild>
            <a href={`/api/download/avatars/${fileName}`} download>
              <DownloadIcon />
              {t("download")}
            </a>
          </Button>
          <Button
            className="flex-1"
            variant={"destructive"}
            onClick={async () => {
              await confirm({
                title: t("delete"),
                description: t("delete_confirmation"),
                onConfirm: deletePhoto,
              });
            }}
          >
            <DeleteIcon />
            {t("delete")}
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <Label className="font-bold">Information</Label>
          <Separator />
          {isPending ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
          ) : (
            <ul className="flex flex-col gap-2 text-xs">
              <li className="flex items-center justify-between gap-4">
                <Label className="text-muted-foreground">Fichier</Label>
                <span className="truncate font-mono text-xs" title={fileName}>
                  {shortName}
                </span>
              </li>
              <li className="flex items-center justify-between gap-4">
                <Label className="text-muted-foreground">Taille</Label>
                <span className="text-xs">{formatFileSize(stat?.size)}</span>
              </li>
              <li className="flex items-center justify-between gap-4">
                <Label className="text-muted-foreground">Modifié</Label>
                <span className="text-xs">
                  {stat?.lastModified
                    ? new Date(stat.lastModified).toLocaleDateString(locale, {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-4">
                <Label className="text-muted-foreground">Type</Label>
                <span>{stat?.contentType ?? "-"}</span>
              </li>
              {stat?.etag && (
                <li className="flex items-start justify-between gap-4">
                  <Label className="text-muted-foreground shrink-0">ETag</Label>
                  <span
                    className="truncate font-mono text-xs"
                    title={stat.etag}
                  >
                    {stat.etag}
                  </span>
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
      <Button
        className="w-full"
        variant={"outline"}
        onClick={() => closeSheet()}
      >
        {t("close")}
      </Button>
    </div>
  );
}
