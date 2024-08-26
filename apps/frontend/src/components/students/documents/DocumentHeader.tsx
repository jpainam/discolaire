"use client";

import {
  Download,
  DownloadCloud,
  MoreVertical,
  Trash,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { useAlert } from "@repo/hooks/use-alert";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Separator } from "@repo/ui/separator";

import { FileTypeSelector } from "./FileTypeSelector";
import { LastModifiedSelector } from "./LastModifiedSelector";
import { ViewSwitcher } from "./ViewSwitcher";

export function DocumentHeader() {
  const { t } = useLocale();
  const { openAlert } = useAlert();
  return (
    <div className="flex w-full flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      <span>{t("all_files")}</span>
      <FileTypeSelector />
      <LastModifiedSelector />
      <div className="ml-auto flex flex-row items-center gap-2">
        <ViewSwitcher />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download all files
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DownloadCloud className="mr-2 h-4 w-4" />
              Download Selected files
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem
              onSelect={() => {
                openAlert({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  onConfirm: () => {
                    toast.warning("not_yet_implemented");
                  },
                });
              }}
              className="my-2 bg-destructive text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete all files
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => {
                openAlert({
                  title: t("delete"),
                  description: t("delete_confirmation"),
                  onConfirm: () => {
                    toast.warning("not_yet_implemented");
                  },
                });
              }}
              className="bg-destructive text-destructive-foreground"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete selected files
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
