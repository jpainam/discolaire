"use client";

import { useSearchParams } from "next/navigation";
import { MailIcon, MoreVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import PDFIcon from "../icons/pdf-solid";
import XMLIcon from "../icons/xml-solid";
import { DropdownHelp } from "../shared/DropdownHelp";
import { ClassroomSelector } from "../shared/selects/ClassroomSelector";
import { ClassroomStudentSelector } from "../shared/selects/ClassroomStudentSelector";
import { TermSelector } from "../shared/selects/TermSelector";

export function ReportCardHeader() {
  const t = useTranslations();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const [classroomId, setClassroomId] = useQueryState("classroom", {
    defaultValue: "",
  });
  const termId = searchParams.get("termId");
  return (
    <div className="bg-muted/40 grid grid-cols-1 flex-row items-center gap-4 px-4 py-1 md:flex">
      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        defaultValue={classroomId}
        onSelect={(val) => {
          void setClassroomId(val == "" ? null : val);
        }}
        className="w-[300px]"
      />
      <Label className="hidden md:flex">{t("terms")}</Label>
      <TermSelector
        defaultValue={termId}
        className="w-[300px]"
        onChange={(val) => {
          router.push(
            routes.reportcards.index + "/?" + createQueryString({ term: val }),
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
                  createQueryString({ student: val }),
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
            <DropdownHelp />
            <DropdownMenuSeparator />
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
