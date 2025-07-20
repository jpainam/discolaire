"use client";

import { MoreHorizontal, PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditCourse } from "./CreateEditCourse";

export function CourseAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2">
      <Button
        onClick={() => {
          openModal({
            title: t("create"),
            view: <CreateEditCourse />,
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
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownHelp />

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              window.open("/api/pdfs/courses?format=pdf", "_blank");
            }}
          >
            <PDFIcon />
            {t("pdf_export")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              window.open("/api/pdfs/courses?format=csv", "_blank");
            }}
          >
            <XMLIcon />
            {t("xml_export")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
