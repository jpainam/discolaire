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
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { SubjectSelector } from "~/components/shared/selects/SubjectSelector";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { useRouter } from "~/hooks/use-router";
import { PermissionAction } from "~/permissions";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";
import { CreateClassroomGradeSheetModal } from "./CreateClassroomGradesheetModal";
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

  const [termId, setTermId] = useQueryState("termId");
  const { schoolYear } = useSchool();
  const [subjectId, setSubjectId] = useQueryState("subjectId");

  const t = useTranslations();
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
    <div className="bg-muted/50 grid flex-row items-center gap-4 px-4 py-1 md:flex md:border-y">
      <Label className="hidden md:flex">{t("term")}</Label>
      <TermSelector
        showAllOption={true}
        defaultValue={termId}
        onChange={(val) => {
          void setTermId(val ?? null);
        }}
        className="w-[300px]"
      />
      <Label className="hidden md:flex">{t("subject")}</Label>
      <SubjectSelector
        className="md:w-[300px]"
        defaultValue={subjectId ?? undefined}
        onChange={(val) => {
          void setSubjectId(val ?? null);
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
              openModal({
                title: "Créer une fiche de saisie",
                description: `Classe ${classroom.name}`,
                view: (
                  <CreateClassroomGradeSheetModal
                    onSelectAction={(t: string, s: string) => {
                      router.push(
                        `/classrooms/${params.id}/gradesheets/create?termId=${t}&subjectId=${s}`,
                      );
                    }}
                    termId={termId}
                    subjectId={subjectId}
                    classroomId={params.id}
                  />
                ),
              });
            }}
          >
            <PlusIcon />
            {t("new")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Import / Export
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() => {
                if (!termId || !subjectId) {
                  toast.warning(
                    "Veuillez sélectionner un terme et une matière",
                  );
                  return;
                }
                window.open(
                  `/api/pdfs/classroom/${params.id}/gradesheets?termId=${termId}&subjectId=${subjectId}&format=pdf`,
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
                  `/api/pdfs/classroom/${params.id}/gradesheets?termId=${termId}&subjectId=${subjectId}&format=csv`,
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
