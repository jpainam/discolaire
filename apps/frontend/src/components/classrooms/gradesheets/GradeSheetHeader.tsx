"use client";

import type { ChangeEvent } from "react";
import { useRef } from "react";
import { useParams } from "next/navigation";
import * as XLSX from "@e965/xlsx";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  Download,
  FileJson,
  MoreVertical,
  PlusIcon,
  Upload,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { routes } from "~/configs/routes";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { ImportGradesheetModal } from "./ImportGradesheetModal";

export function GradeSheetHeader() {
  const params = useParams<{ id: string }>();
  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id),
  );

  const [term, setTerm] = useQueryState("term");
  const { schoolYear } = useSchool();
  const [subject, setSubject] = useQueryState("subject");
  const { t } = useLocale();
  const router = useRouter();
  const canCreateGradeSheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      toast.error("Aucun fichier selectionné");
      return;
    }

    const data = await f.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return;
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      toast.error("Feuille excel invalide");
      return;
    }

    // Convert sheet to JSON (2D array)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      raw: true,
    });

    const parsed = sheetData.map((row, _index) => {
      return {
        col1: String(row[0] ?? ""),
        col2: String(row[1] ?? ""),
        col3: String(row[2] ?? ""),
        col4: String(row[3] ?? ""),
        isValid: false,
      };
    });

    parsed.splice(0, 1); // the first line is the column, do not copy
    openModal({
      view: (
        <ImportGradesheetModal
          students={students}
          rows={parsed.map((p) => {
            return {
              studentId: p.col1,
              grade: p.col4,
            };
          })}
        />
      ),
      title: "Importer des notes",
      className: "overflow-hidden p-8 sm:max-w-6xl",
      description: `Classe ${classroom.name}`,
    });
  };

  const { openModal } = useModal();
  const inputRef = useRef(null);

  return (
    <div className="bg-muted/40 grid flex-row items-center gap-4 px-4 py-1 md:flex md:border-b">
      <Label className="hidden md:flex">{t("term")}</Label>
      <TermSelector
        showAllOption={true}
        defaultValue={term}
        onChange={(val) => {
          void setTerm(val ?? null);
        }}
        className="w-[300px]"
      />
      <Label className="hidden md:flex">{t("subject")}</Label>
      <SubjectSelector
        className="md:w-[300px]"
        defaultValue={subject ?? undefined}
        onChange={(val) => {
          void setSubject(val ?? null);
        }}
        classroomId={params.id}
      />
      <input
        onChange={handleFileChange}
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
      />

      <div className="ml-auto flex flex-row items-center gap-2">
        {canCreateGradeSheet && (
          <Button
            disabled={!schoolYear.isActive}
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
            <Button
              variant="outline"
              size="sm"
              className="hidden gap-2 lg:flex"
            >
              Import / Export
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Download className="size-4" />
              Export
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                window.open(
                  `/api/pdfs/exports/gradesheets?classroomId=${params.id}`,
                  "_blank",
                );
              }}
            >
              <FileJson className="size-4" />
              Fiche de saisie
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <FileSpreadsheet className="size-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="size-4" />
              Export as Markdown
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="flex items-center gap-2">
              <Upload className="size-4" />
              Import
            </DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (inputRef.current) {
                  (inputRef.current as HTMLInputElement).click();
                }
              }}
            >
              <FileJson className="size-4" />
              Fiche de saisie
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
              <FileSpreadsheet className="size-4" />
              Import from CSV
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
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
