"use client";

import { MoreVertical, PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useModal } from "~/hooks/use-modal";
import { CreateEditTerm } from "./CreateEditTerm";

export function TermHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex items-center justify-end gap-2">
      <Button
        onClick={() => {
          openModal({
            title: t("add"),
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
          <DropdownMenuSeparator />
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
