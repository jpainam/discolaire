"use client";

import { ChevronDown, Plus, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { CreateEditJournal } from "./CreateEditJournal";

export function JournalHeader() {
  const { openModal } = useModal();
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center">
      <Label className="text-xl">{t("journal")}</Label>
      <div className="ml-auto flex flex-row gap-2 p-2">
        <Button
          size={"sm"}
          variant={"default"}
          onClick={() => {
            openModal({
              title: <div className="px-4">{t("add")}</div>,
              description: <div className="px-4">{t("journal")}</div>,
              view: <CreateEditJournal />,
            });
          }}
        >
          <Plus />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex flex-row items-center gap-1"
            >
              <Printer className="h-3 w-3" />
              {t("print")}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
