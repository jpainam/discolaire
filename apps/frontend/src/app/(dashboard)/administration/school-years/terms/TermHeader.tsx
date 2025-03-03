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
    <>
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
          <Button variant={"outline"} size={"icon"}>
            <MoreVertical className="h-4 w-4" />
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
    </>
  );
}
