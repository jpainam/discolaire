"use client";

import { MoreVertical, PlusIcon, SettingsIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryState } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";

export function GradeSheetHeader() {
  const params = useParams<{ id: string }>();

  const [term, setTerm] = useQueryState("term");
  const [subject, setSubject] = useQueryState("subject");
  const { t } = useLocale();
  const router = useRouter();
  const canCreateGradeSheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  return (
    <div className="grid flex-row items-center gap-4 bg-muted/40 px-4 py-1 md:flex md:border-b">
      <Label className="hidden md:flex">{t("term")}</Label>
      <TermSelector
        showAllOption={true}
        defaultValue={term ?? undefined}
        onChange={(val) => {
          void setTerm(val ?? null);
        }}
        className="w-[300px]"
      />
      <Label className="hidden  md:flex">{t("subject")}</Label>
      <SubjectSelector
        className="md:w-[300px]"
        defaultValue={subject ?? undefined}
        onChange={(val) => {
          void setSubject(val ?? null);
        }}
        classroomId={params.id}
      />
      {canCreateGradeSheet && (
        <Button size={"sm"} variant={"ghost"}>
          <SettingsIcon />
          {t("manage_appreciation")}
        </Button>
      )}
      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateGradeSheet && (
          <Button
            onClick={() => {
              router.push(routes.classrooms.gradesheets.create(params.id));
            }}
            variant={"default"}
            size={"sm"}
          >
            <PlusIcon />
            {t("new")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/gradesheets?termId=${term ?? 0}&subjectId=${subject ?? 0}&format=pdf`,
                  "_blank",
                );
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/classroom/${params.id}/gradesheets?termId=${term ?? 0}&subjectId=${subject ?? 0}&format=csv`,
                  "_blank",
                );
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
