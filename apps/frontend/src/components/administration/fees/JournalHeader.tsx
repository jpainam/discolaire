"use client";

import { ChevronDown, Plus, Printer } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useModal } from "@repo/lib/hooks/use-modal";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

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
          <Plus className="mr-2 h-4 w-4" />
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
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
