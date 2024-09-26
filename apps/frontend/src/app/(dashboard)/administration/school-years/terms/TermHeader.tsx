"use client";

import { MoreVertical, PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";

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
        <PlusIcon className="mr-2 h-4 w-4" />
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
            <XMLIcon className="mr-2 h-4 w-4" />
            {t("xml_export")}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PDFIcon className="mr-2 h-4 w-4" />
            {t("pdf_export")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
