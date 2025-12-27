"use client";

import { useQuery } from "@tanstack/react-query";
import { DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { useSheet } from "~/hooks/use-sheet";
import { DeleteIcon, EditIcon } from "~/icons";
import { useTRPC } from "~/trpc/react";

export function PhotoDetails({ fileName }: { fileName: string }) {
  const { closeSheet } = useSheet();
  const t = useTranslations();
  const trpc = useTRPC();
  const photoQuery = useQuery(
    trpc.photo.get.queryOptions({ key: fileName, type: "avatar" }),
  );
  if (photoQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, t) => (
          <Skeleton key={t} className="h-8" />
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="grid flex-1 auto-rows-min gap-4 px-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="size-48">
            <AvatarImage src={`/api/download/avatars/${fileName}`} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Button className="w-fit" variant={"outline"}>
            <EditIcon />
            {t("edit")}
          </Button>
          <Button className="w-fit" variant={"outline"}>
            <DownloadIcon />
            {t("download")}
          </Button>
          <Button className="w-fit" variant={"destructive"}>
            <DeleteIcon />
            {t("delete")}
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Information</Label>
          <Separator />
          <ul>
            <li className="flex items-center justify-between">
              <span>Nom</span>
              <span className="text-muted-foreground">Le nom du fichier</span>
            </li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-bold">Meta Data</Label>
          <Separator />
          <ul>
            <li className="flex items-center justify-between">
              <span>Nom</span>
              <span className="text-muted-foreground">Le nom du fichier</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4">
        <Button
          className="w-full"
          variant={"outline"}
          onClick={() => {
            closeSheet();
          }}
        >
          {t("close")}
        </Button>
      </div>
    </>
  );
}
