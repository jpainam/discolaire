"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon } from "lucide-react";

import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DateRangePicker } from "~/components/shared/DateRangePicker2";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { routes } from "~/configs/routes";
import { sidebarIcons } from "../sidebar-icons";

export function AssignmentHeader() {
  const router = useRouter();
  const { t } = useLocale();
  const params = useParams<{ id: string }>();

  const Icon = sidebarIcons.assignments;
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-row items-center gap-2 border-b bg-secondary px-2 py-1 text-secondary-foreground">
        {Icon && <Icon className="h-6 w-6" />}
        <Label>{t("assignments")}</Label>
        <Label className="ml-10">{t("date")}</Label>
        <DateRangePicker />

        <div className="ml-auto flex flex-row items-center gap-2">
          <Button
            onClick={() => {
              router.push(routes.classrooms.assignments.create(params.id));
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
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <PDFIcon className="h-4 w-4" />
                {t("pdf_export")}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <XMLIcon className="h-4 w-4" />
                {t("xml_export")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
