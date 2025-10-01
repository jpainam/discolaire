/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import * as XLSX from "@e965/xlsx";
import { ArrowLeftRight, DownloadIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";

type Row = [string, string, string];

export function ImportStudentRegistrationNumber() {
  const inputRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[]>([]);

  const [mappings, setMapping] = useState<Record<string, string>>({});

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) {
      toast.error("No file selected");
      return;
    }
    setFilename(f.name);

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

    const parsed: Row[] = sheetData.map((row) => [
      String(row[0] ?? ""),
      String(row[1] ?? ""),
      String(row[2] ?? ""),
    ]);

    setRows(parsed);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-4">
        <Button
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (inputRef.current) {
              (inputRef.current as HTMLInputElement).click();
            }
          }}
          variant={"secondary"}
          size={"sm"}
        >
          <DownloadIcon />
          Importer
        </Button>
        <input
          onChange={handleFileChange}
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls"
          className="hidden"
        />
        <Button variant={"secondary"} size={"sm"}>
          <ArrowLeftRight />
          Matcher
        </Button>
        <Button variant={"secondary"} size={"sm"}>
          Telecharger matched/unmatched
        </Button>
        <Button
          disabled={rows.length == 0 || !filename}
          variant={"default"}
          size={"sm"}
        >
          Valider
        </Button>
      </div>

      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, fullname: val }));
                  }}
                />
              </TableHead>
              <TableHead>
                {" "}
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, fullname: val }));
                  }}
                />
              </TableHead>
              <TableHead>
                {" "}
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, fullname: val }));
                  }}
                />
              </TableHead>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, fullname: val }));
                  }}
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{row[0]}</TableCell>
                  <TableCell>{row[1]}</TableCell>
                  <TableCell>{row[2]}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function HeaderSelector({ onSelected }: { onSelected: (val: string) => void }) {
  const t = useTranslations();
  return (
    <Select onValueChange={onSelected}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Correspondance" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fullname">{t("fullName")}</SelectItem>
        <SelectItem value="date_of_birth">{t("dateOfBirth")}</SelectItem>
        <SelectItem value="old_registration">Ancienne valeur</SelectItem>
        <SelectItem value="new_regitration">Nouvelle valeur</SelectItem>
      </SelectContent>
    </Select>
  );
}
