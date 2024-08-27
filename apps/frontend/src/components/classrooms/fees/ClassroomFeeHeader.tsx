"use client";

import { ChevronDownIcon, Plus, PrinterIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
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
import { sidebarIcons } from "../sidebar-icons";
import { CreateEditFee } from "./CreateEditFee";

export function ClassroomFeeHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const Icon = sidebarIcons.fees;
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
      {Icon && <Icon className="h-6 w-6" />}
      <Label>{t("fees")}</Label>
      <div className="ml-auto flex flex-row gap-2">
        <Button
          onClick={() => {
            openModal({
              title: <div>{t("add")}</div>,
              className: "w-[500px]",
              view: <CreateEditFee />,
            });
          }}
          variant={"outline"}
          size={"icon"}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="flex h-8 flex-row">
              <PrinterIcon className="mr-2 h-4 w-4" />
              <span className="text-xs 2xl:text-sm">{t("print")}</span>
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => {}}>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("fees")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("fees")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
