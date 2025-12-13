"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { CreateEditSchool } from "./CreateEditSchool";

export function FormerSchoolHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center justify-center border-b px-4 py-2">
      <Label>{`${t("settings")} - ${t("former_schools")}`}</Label>
      <div className="ml-auto flex flex-row items-center gap-2">
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
