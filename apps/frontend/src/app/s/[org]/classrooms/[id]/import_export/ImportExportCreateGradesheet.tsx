"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import * as XLSX from "@e965/xlsx";
import { DownloadIcon, FileText, UploadIcon } from "lucide-react";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import { Alert, AlertDescription, AlertTitle } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { ImportGradesheetModal } from "./ImportGradesheetModal";

interface DataRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  isValid: boolean;
}

export function ImportExportCreateGradesheet({
  students,
  classroom,
}: {
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
}) {
  const params = useParams<{ id: string }>();
  const [_, setRows] = useState<DataRow[]>([]);
  const { openModal } = useModal();
  const inputRef = useRef(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      toast.error("No file selected");
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

    const parsed: DataRow[] = sheetData.map((row, _index) => {
      return {
        col1: String(row[0] ?? ""),
        col2: String(row[1] ?? ""),
        col3: String(row[2] ?? ""),
        col4: String(row[3] ?? ""),
        isValid: false,
      };
    });
    setRows(parsed);
    parsed.splice(0, 2);
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
  return (
    <Alert>
      <FileText className="h-4 w-4" />
      <AlertTitle>Saisie de Note</AlertTitle>
      <AlertDescription>
        <p className="mb-3">
          Exporter la liste des elèves ensuite importer les notes. Votre fichier
          doit comporter les colonnes ID et notes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => {
              window.open(
                `/api/pdfs/exports/gradesheets?classroomId=${params.id}`,
                "__blank",
              );
            }}
            size="sm"
            variant={"secondary"}
          >
            <DownloadIcon />
            Télécharger
          </Button>
          <Button
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
              if (inputRef.current) {
                (inputRef.current as HTMLInputElement).click();
              }
            }}
            size="sm"
          >
            <UploadIcon />
            Importer
          </Button>
          <input
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
          />
        </div>
      </AlertDescription>
    </Alert>
  );
}
