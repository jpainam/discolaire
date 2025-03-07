"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { CreateEditTerm } from "./CreateEditTerm";

export function TermHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="px-4 flex justify-end items-center gap-2">
      <Button
        onClick={() => {
          openModal({
            title: t("add"),
            className: "w-96",
            view: <CreateEditTerm />,
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
          <Button variant={"outline"} className="size-8" size={"icon"}>
            <MoreVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownHelp />
          <DropdownMenuItem>
            <XMLIcon />
            {t("xml_export")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PDFIcon />
            {t("pdf_export")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
