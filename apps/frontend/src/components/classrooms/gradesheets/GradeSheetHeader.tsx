"use client";

import { useParams, useSearchParams } from "next/navigation";
import { ChevronDown, Printer } from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
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
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";

export function GradeSheetHeader() {
  const params = useParams() as { id: string };
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  return (
    <div className="grid flex-row items-center gap-2 bg-muted/40 px-2 py-1 md:flex md:border-b">
      <Label className="hidden w-[70px] md:flex">{t("term")}</Label>
      <TermSelector
        showAllOption={true}
        defaultValue={searchParams.get("term")}
        onChange={(val) => {
          router.push(`?${createQueryString({ term: val })}`);
        }}
        className="w-[300px]"
      />
      <Label className="hidden w-[75px] md:flex">{t("subject")}</Label>
      <SubjectSelector
        className="md:w-[350px]"
        defaultValue={searchParams.get("subject") ?? ""}
        onChange={(val) => {
          router.push(`?${createQueryString({ subject: val })}`);
        }}
        classroomId={params.id}
      />
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
              Liste des notes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              Liste des notes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
