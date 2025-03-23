"use client";

import { MailIcon, MoreVertical } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { ClassroomStudentSelector } from "../shared/selects/ClassroomStudentSelector";
import { TermSelector } from "../shared/selects/TermSelector";

export function ReportCardHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const [classroomId, setClassroomId] = useQueryState("classroom", {
    defaultValue: "",
  });

  return (
    <div className="grid grid-cols-1 flex-row items-center gap-4 bg-muted/40 px-4 py-1 md:flex">
      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        defaultValue={classroomId}
        onChange={(val) => {
          void setClassroomId(val ?? null);
        }}
        className="w-[300px]"
      />
      <Label className="hidden md:flex">{t("terms")}</Label>
      <TermSelector
        defaultValue={searchParams.get("termId") ?? undefined}
        className="w-[300px]"
        onChange={(val) => {
          router.push(
            routes.reportcards.index + "/?" + createQueryString({ term: val })
          );
        }}
      />
      {classroomId && (
        <>
          <Label className="hidden md:flex">{t("students")}</Label>
          <ClassroomStudentSelector
            onChange={(val) => {
              router.push(
                routes.reportcards.index +
                  "/?" +
                  createQueryString({ student: val })
              );
            }}
            defaultValue={searchParams.get("student") ?? undefined}
            className="w-[300px]"
            classroomId={classroomId}
          />
        </>
      )}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="flex flex-row gap-1">
              <MoreVertical className="h-4 w-4" />
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
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <MailIcon className="mr-2 h-4 w-4" />
              {t("notify_parents")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
