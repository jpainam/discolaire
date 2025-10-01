/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import * as XLSX from "@e965/xlsx";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeftRight, CircleAlert, DownloadIcon, Trash } from "lucide-react";
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
import { ToggleGroup, ToggleGroupItem } from "@repo/ui/components/toggle-group";
import { cn } from "@repo/ui/lib/utils";

import { useTRPC } from "~/trpc/react";

interface DataRow {
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  isValid: boolean;
}

export function ImportStudentRegistrationNumber() {
  const inputRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [rows, setRows] = useState<DataRow[]>([]);
  const [filteredRows, setFilteredRows] = useState<DataRow[]>([]);
  const [isMatched, setIsMatched] = useState<boolean>(false);
  const [toggleMatch, setToggleMatch] = useState<string>("all");

  const [mappings, setMapping] = useState<Record<string, keyof DataRow>>({});

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

    const parsed: DataRow[] = sheetData.map((row, index) => {
      return {
        col1: String(row[0] ?? ""),
        col2: String(row[1] ?? ""),
        col3: String(row[2] ?? ""),
        col4: String(row[3] ?? ""),
        isValid: false,
      };
    });

    setRows(parsed);
    if (toggleMatch === "all") {
      setFilteredRows(parsed);
    } else if (toggleMatch === "matched") {
      setFilteredRows(parsed.filter((r) => r.isValid));
    } else if (toggleMatch === "unmatched") {
      setFilteredRows(parsed.filter((r) => !r.isValid));
    }
    setFile(f);
    setIsMatched(false);
  };
  const trpc = useTRPC();
  const updateRegistration = useMutation(
    trpc.importStudent.registrationNumber.mutationOptions({
      onSuccess: () => {
        toast.success("Matricules mis à jour avec succès");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleSubmit = () => {
    if (rows.length == 0) return;

    const newRegCol = mappings.new_regitration;
    const idOldRegCol = mappings.old_registration;
    const fullNameCol = mappings.fullname;
    if (!newRegCol) {
      toast.error("Veuillez mapper les nouveaux matricules");
      return;
    }
    const newReg = rows.map((r) => r[newRegCol] as string);
    const idsColumn = mappings.id;
    if (idsColumn) {
      const ids = rows.map((r) => r[idsColumn] as string);
      updateRegistration.mutate({
        by: "id",
        ids: ids,
        new_registrations: newReg,
      });
    } else if (idOldRegCol) {
      const old_regs = rows.map((r) => r[idOldRegCol] as string);
      updateRegistration.mutate({
        by: "old_registration",
        old_registrations: old_regs,
        new_registrations: newReg,
      });
    } else if (fullNameCol) {
      const full_names = rows.map((r) => r[fullNameCol] as string);
      updateRegistration.mutate({
        by: "full_name",
        full_names: full_names,
        new_registrations: newReg,
      });
    } else {
      toast.error(
        "Veuillez mapper l'ID, l'ancienne matricule ou le nom complet",
      );
      return;
    }
  };
  const checkFullnameMutation = useMutation(
    trpc.importStudent.checkFullNameMapping.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        if (data.unmatched.length > 0) {
          toast.error(
            `${data.unmatched.length} lignes non appariées. Veuillez vérifier.`,
          );
        } else {
          toast.success("Toutes les lignes ont été appariées avec succès.");
          setIsMatched(true);
        }
        // update rows to mark matched/unmatched
        const newRows = rows.map((r, index) => {
          return {
            ...r,
            isValid: data.matched[index]?.isValid ?? false,
          };
        });
        setRows(newRows);
      },
    }),
  );
  const handleMatch = () => {
    const newRegCol = mappings.new_regitration;
    const idOldRegCol = mappings.old_registration;
    const fullNameCol = mappings.fullname;
    if (!newRegCol) {
      toast.error("Veuillez mapper les nouveaux matricules");
      return;
    }
    const newReg = rows.map((r) => r[newRegCol] as string);
    const idsColumn = mappings.id;
    if (idsColumn) {
      const ids = rows.map((r) => r[idsColumn] as string);
    } else if (idOldRegCol) {
      const old_regs = rows.map((r) => r[idOldRegCol] as string);
    } else if (fullNameCol) {
      const full_names = rows.map((r) => r[fullNameCol] as string);
      checkFullnameMutation.mutate({
        full_names: full_names,
      });
    }
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
        <Button
          onClick={handleMatch}
          disabled={rows.length == 0}
          variant={"secondary"}
          size={"sm"}
        >
          <ArrowLeftRight />
          Matcher
        </Button>
        <ToggleGroup
          className="w-[250px]"
          onValueChange={(val) => {
            setToggleMatch(val);
            if (val === "all") {
              setFilteredRows(rows);
            } else if (val === "matched") {
              setFilteredRows(rows.filter((r) => r.isValid));
            } else if (val === "unmatched") {
              setFilteredRows(rows.filter((r) => !r.isValid));
            }
          }}
          variant="outline"
          defaultValue="all"
          type="single"
        >
          <ToggleGroupItem value="all">Tous</ToggleGroupItem>
          <ToggleGroupItem value="matched">Matched</ToggleGroupItem>
          <ToggleGroupItem value="unmatched">Unmatched</ToggleGroupItem>
        </ToggleGroup>
        <Button
          isLoading={updateRegistration.isPending}
          onClick={handleSubmit}
          disabled={rows.length == 0 || !filename || !isMatched}
          variant={"default"}
          size={"sm"}
        >
          Valider
        </Button>
      </div>

      <div className="max-h-[calc(100vh-25rem)] overflow-y-auto border text-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, [val]: "col1" }));
                  }}
                />
              </TableHead>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, [val]: "col2" }));
                  }}
                />
              </TableHead>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, [val]: "col3" }));
                  }}
                />
              </TableHead>
              <TableHead>
                <HeaderSelector
                  onSelected={(val) => {
                    setMapping((prev) => ({ ...prev, [val]: "col4" }));
                  }}
                />
              </TableHead>
              <TableHead className="w-[10px] text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => {
              return (
                <TableRow
                  key={index}
                  className={cn(
                    "group",
                    !row.isValid && "bg-destructive/10 hover:bg-destructive/20",
                    row.isValid && "hover:bg-accent",
                  )}
                >
                  <TableCell className="py-0">{row.col1}</TableCell>
                  <TableCell className="py-0">{row.col2}</TableCell>
                  <TableCell className="py-0">{row.col3}</TableCell>
                  <TableCell className="py-0">{row.col4}</TableCell>
                  <TableCell className="py-0">
                    <Button
                      onClick={() => {
                        const newRows = [...rows];
                        newRows.splice(index, 1);
                        setRows(newRows);
                        if (toggleMatch === "all") {
                          setFilteredRows(newRows);
                        } else if (toggleMatch === "matched") {
                          setFilteredRows(newRows.filter((r) => r.isValid));
                        } else if (toggleMatch === "unmatched") {
                          setFilteredRows(newRows.filter((r) => !r.isValid));
                        }
                      }}
                      className="invisible size-7 opacity-0 transition group-hover:visible group-hover:opacity-100"
                      variant="ghost"
                      size="icon"
                    >
                      <Trash className="text-destructive w-3.5" />
                    </Button>
                  </TableCell>
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
        <SelectItem value="id">ID</SelectItem>
        <SelectItem value="fullname">{t("fullName")}</SelectItem>
        <SelectItem value="date_of_birth">{t("dateOfBirth")}</SelectItem>
        <SelectItem value="old_registration">Ancienne matricule</SelectItem>
        <SelectItem value="new_regitration">Nouveau matricule</SelectItem>
      </SelectContent>
    </Select>
  );
}

function ErrorMatching({
  matched,
  unmatched,
}: {
  matched: number;
  unmatched: number;
}) {
  return (
    <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600">
      <p className="text-sm">
        <CircleAlert
          className="me-3 -mt-0.5 inline-flex opacity-60"
          size={16}
          aria-hidden="true"
        />
        Il y a {unmatched} lignes non appariées et {matched} lignes appariées.
        Veuillez vérifier ou télécharger les erreurs et réessayer.
      </p>
    </div>
  );
}
