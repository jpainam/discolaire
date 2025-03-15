"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { CreateEditSchool } from "./CreateEditSchool";
export function FormerSchoolHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center border-b px-4 py-2 justify-center">
      <Label>{`${t("settings")} - ${t("former_schools")}`}</Label>
      <div className="ml-auto items-center flex flex-row gap-2">
        <Button
          onClick={() => {
            openModal({
              title: t("create"),
              view: <CreateEditSchool />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="size-8" variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
