"use client";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useSetAtom } from "jotai";
import { CalendarDays, MoreVertical, Plus } from "lucide-react";
import { useEffect } from "react";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { StaffSelector } from "~/components/shared/selects/StaffSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";
export function TimetableHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const router = useRouter();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("timetables"), url: "/timetables" },
    ];
    setBreadcrumbs(breads);
  }, [setBreadcrumbs, t]);
  return (
    <div className="grid md:flex flex-row gap-6 py-1 px-4 border-b items-center">
      <div className="flex flex-row items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        <Label>{t("timetables")}</Label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector
          onChange={(val) => {
            router.push(`/timetables?${createQueryString({ classroom: val })}`);
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label>{t("teachers")}</Label>
        <StaffSelector
          onChange={(val) => {
            router.push(`/timetables?${createQueryString({ teacher: val })}`);
          }}
        />
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button size={"sm"}>
          <Plus />
          {t("add")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} className="size-8" variant={"outline"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownHelp />

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
