"use client";

import { useParams } from "next/navigation";
import { MoreVertical, PlusIcon, SettingsIcon } from "lucide-react";
import { useQueryState } from "nuqs";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useRouter } from "~/hooks/use-router";

export function GradeSheetHeader() {
  const params = useParams<{ id: string }>();

  const [term, setTerm] = useQueryState("term", { shallow: false });
  const [subject, setSubject] = useQueryState("subject", { shallow: false });
  const { t } = useLocale();
  const router = useRouter();

  return (
    <div className="grid flex-row items-center gap-2 bg-muted/40 px-2 py-1 md:flex md:border-b">
      <Label className="hidden w-[70px] md:flex">{t("term")}</Label>
      <TermSelector
        showAllOption={true}
        defaultValue={term ?? undefined}
        onChange={(val) => {
          void setTerm(val);
        }}
        className="w-[300px]"
      />
      <Label className="hidden w-[75px] md:flex">{t("subject")}</Label>
      <SubjectSelector
        className="md:w-[350px]"
        defaultValue={subject ?? undefined}
        onChange={(val) => {
          void setSubject(val ?? null);
        }}
        classroomId={params.id}
      />
      <Button size={"sm"} variant={"ghost"}>
        <SettingsIcon className="mr-1 h-4 w-4" />
        {t("manage_appreciation")}
      </Button>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          onClick={() => {
            router.push(routes.classrooms.gradesheets.create(params.id));
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("new")}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
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
