"use client";

import { MoreHorizontal, PlusIcon } from "lucide-react";
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
import { CreateEditCourse } from "./CreateEditCourse";

export function CourseAction() {
  const t = useTranslations();
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
      >
        <PlusIcon />
        {t("add")}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"icon"}>
            <MoreHorizontal />
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
