"use client";

import { useSearchParams } from "next/navigation";
import { ChevronDown, MailIcon, Printer } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { useCreateQueryString } from "@repo/lib/hooks/create-query-string";
import { useRouter } from "@repo/lib/hooks/use-router";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import { routes } from "~/configs/routes";
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

  return (
    <div className="grid grid-cols-1 flex-row items-center gap-4 bg-muted/40 px-4 py-1 md:flex">
      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        defaultValue={searchParams.get("classroom") || undefined}
        onChange={(val) => {
          router.push(
            routes.report_cards.index +
              "/?" +
              createQueryString({ classroom: val, student: undefined }),
          );
        }}
        className="w-[300px]"
      />
      <Label className="hidden md:flex">{t("terms")}</Label>
      <TermSelector
        defaultValue={searchParams.get("term") || undefined}
        className="w-[300px]"
        onChange={(val) => {
          router.push(
            routes.report_cards.index + "/?" + createQueryString({ term: val }),
          );
        }}
      />
      {searchParams.get("classroom") && (
        <>
          <Label className="hidden md:flex">{t("students")}</Label>
          <ClassroomStudentSelector
            onChange={(val) => {
              router.push(
                routes.report_cards.index +
                  "/?" +
                  createQueryString({ student: val }),
              );
            }}
            defaultValue={searchParams.get("student") || undefined}
            className="w-[300px]"
            classroomId={searchParams.get("classroom")!}
          />
        </>
      )}

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="flex flex-row gap-1">
              <Printer className="h-4 w-4" />
              {t("print")}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("report_cards")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("report_cards")}
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
