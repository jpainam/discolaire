"use client";

import { MoreVertical, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { JournalSelector } from "~/components/shared/selects/JounalSelector";
import { useRouter } from "~/hooks/use-router";

export function FeeHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createQueryString } = useCreateQueryString();

  return (
    <div className="flex flex-row items-center gap-2 px-4 py-1">
      <Label>{t("classrooms")}</Label>

      <ClassroomSelector
        className="w-[300px]"
        defaultValue={searchParams.get("classroom") ?? ""}
        onChange={(val) => {
          router.push("?" + createQueryString({ classroom: val }));
        }}
      />
      <Label>{t("journals")}</Label>
      <JournalSelector
        defaultValue={searchParams.get("journal") ?? ""}
        className="w-[300px]"
        onChange={(val) => {
          router.push("?" + createQueryString({ journal: val }));
        }}
      />

      <div className="ml-auto flex items-center gap-2">
        {searchParams.get("classroom") && (
          <Button variant={"default"}>
            <Plus />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon />
              {t("export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
