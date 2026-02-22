"use client";

import type { ChangeEvent } from "react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeftRight,
  CheckCircle2,
  CircleAlert,
  DownloadIcon,
  XCircle,
} from "lucide-react";
import Papa from "papaparse";
import { toast } from "sonner";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

type MatchStatus = "pending" | "matched" | "unmatched" | "already_exists";

interface RowState {
  data: Record<string, string>;
  status: MatchStatus;
  studentId?: string;
}

type MatchType = "id" | "full_name" | "old_registration";

export function ImportStudentRegistrationNumber() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<RowState[]>([]);
  const [filterMode, setFilterMode] = useState<"all" | "matched" | "unmatched">(
    "all",
  );

  const [matchColumn, setMatchColumn] = useState<string>("");
  const [matchType, setMatchType] = useState<MatchType | "">("");
  const [newRegColumn, setNewRegColumn] = useState<string>("");

  const [hasHeader, setHasHeader] = useState(true);

  const [matchStats, setMatchStats] = useState<{
    matched: number;
    unmatched: number;
    alreadyExists: number;
  } | null>(null);
  const [isMatched, setIsMatched] = useState(false);

  const parseFile = (f: File, withHeader: boolean) => {
    if (withHeader) {
      Papa.parse<Record<string, string>>(f, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const cols = results.meta.fields ?? [];
          setHeaders(cols);
          setRows(
            results.data.map((row) => ({ data: row, status: "pending" })),
          );
          setMatchStats(null);
          setIsMatched(false);
          setMatchColumn("");
          setMatchType("");
          setNewRegColumn("");
          toast.success(`${results.data.length} lignes chargées`);
        },
        error: (err) => toast.error(`Erreur de lecture: ${err.message}`),
      });
    } else {
      Papa.parse<string[]>(f, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const firstRow = results.data[0] ?? [];
          const cols = firstRow.map((_, i) => `Colonne ${i + 1}`);
          setHeaders(cols);
          setRows(
            results.data.map((row) => ({
              data: Object.fromEntries(
                cols.map((col, i) => [col, row[i] ?? ""]),
              ),
              status: "pending",
            })),
          );
          setMatchStats(null);
          setIsMatched(false);
          setMatchColumn("");
          setMatchType("");
          setNewRegColumn("");
          toast.success(`${results.data.length} lignes chargées`);
        },
        error: (err) => toast.error(`Erreur de lecture: ${err.message}`),
      });
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    parseFile(f, hasHeader);
    // Reset so the same file can be re-uploaded
    e.target.value = "";
  };

  const trpc = useTRPC();

  const checkMappingMutation = useMutation(
    trpc.importStudent.checkMapping.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: (data) => {
        const newRows = rows.map((r, i) => {
          const result = data.results.find((res) => res.index === i);
          return {
            ...r,
            status: (result?.status ?? "unmatched") as MatchStatus,
            studentId: result?.studentId ?? undefined,
          };
        });
        setRows(newRows);
        setMatchStats({
          matched: data.matchedCount,
          unmatched: data.unmatchedCount,
          alreadyExists: data.alreadyExistsCount,
        });
        setIsMatched(true);

        if (data.unmatchedCount > 0 || data.alreadyExistsCount > 0) {
          toast.warning(
            `${data.matchedCount} correspondances · ${data.unmatchedCount} non trouvées · ${data.alreadyExistsCount} déjà existantes`,
          );
        } else {
          toast.success("Toutes les lignes ont été appariées avec succès");
        }
      },
    }),
  );

  const updateRegistrationMutation = useMutation(
    trpc.importStudent.registrationNumber.mutationOptions({
      onSuccess: () => {
        toast.success("Matricules mis à jour avec succès");
        setRows((prev) => prev.map((r) => ({ ...r, status: "pending" })));
        setIsMatched(false);
        setMatchStats(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const handleMatch = () => {
    if (!matchColumn || !matchType || !newRegColumn) {
      toast.error(
        "Veuillez configurer la colonne de correspondance et la colonne nouveau matricule",
      );
      return;
    }
    if (rows.length === 0) {
      toast.error("Aucune donnée chargée");
      return;
    }

    checkMappingMutation.mutate({
      by: matchType,
      match_values: rows.map((r) => r.data[matchColumn] ?? ""),
      new_registrations: rows.map((r) => r.data[newRegColumn] ?? ""),
    });
  };

  const handleValidate = () => {
    if (!isMatched || !newRegColumn) return;

    const matchedRows = rows.filter(
      (r): r is RowState & { studentId: string } =>
        r.status === "matched" && r.studentId !== undefined,
    );
    if (matchedRows.length === 0) {
      toast.error("Aucune ligne correspondante à mettre à jour");
      return;
    }

    updateRegistrationMutation.mutate({
      by: "id",
      ids: matchedRows.map((r) => r.studentId),
      new_registrations: matchedRows.map((r) => r.data[newRegColumn] ?? ""),
    });
  };

  const exportToCSV = (rowsToExport: RowState[], filename: string) => {
    const csvData = rowsToExport.map((r) => r.data);
    const csv = Papa.unparse(csvData, { columns: headers });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMatched = () => {
    exportToCSV(
      rows.filter((r) => r.status === "matched"),
      "matched.csv",
    );
  };

  const handleExportUnmatched = () => {
    exportToCSV(
      rows.filter((r) => r.status === "unmatched"),
      "unmatched.csv",
    );
  };

  const filteredRows =
    filterMode === "all"
      ? rows
      : filterMode === "matched"
        ? rows.filter((r) => r.status === "matched")
        : rows.filter((r) => r.status !== "matched");

  return (
    <div className="flex flex-col gap-4">
      {/* Top controls */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex flex-col gap-2">
          <Button onClick={() => inputRef.current?.click()} variant="secondary">
            <DownloadIcon />
            Importer CSV
          </Button>
          <input
            onChange={handleFileChange}
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              id="has-header"
              checked={hasHeader}
              onCheckedChange={(checked) => setHasHeader(checked === true)}
            />
            <Label htmlFor="has-header" className="cursor-pointer text-xs">
              La première ligne est un en-tête
            </Label>
          </div>
        </div>

        {headers.length > 0 && (
          <>
            {/* Match column selector */}
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">
                Colonne de correspondance
              </Label>
              <Select value={matchColumn} onValueChange={setMatchColumn}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Colonne CSV" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Label className="text-xs">de type</Label>
              <Select
                value={matchType}
                onValueChange={(v) => setMatchType(v as MatchType)}
              >
                <SelectTrigger className="w-[170px]">
                  <SelectValue placeholder="Type de clé" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID étudiant</SelectItem>
                  <SelectItem value="full_name">Nom complet</SelectItem>
                  <SelectItem value="old_registration">
                    Ancien matricule
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* New registration column selector */}
            <div className="flex items-center gap-2">
              <Label className="text-xs whitespace-nowrap">
                Nouveau matricule
              </Label>
              <Select value={newRegColumn} onValueChange={setNewRegColumn}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Colonne CSV" />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <Button
          onClick={handleMatch}
          disabled={
            rows.length === 0 ||
            !matchColumn ||
            !matchType ||
            !newRegColumn ||
            checkMappingMutation.isPending
          }
          variant="secondary"
        >
          {checkMappingMutation.isPending ? <Spinner /> : <ArrowLeftRight />}
          Matcher
        </Button>

        <ToggleGroup
          className="w-[260px]"
          onValueChange={(val) =>
            val && setFilterMode(val as typeof filterMode)
          }
          variant="outline"
          defaultValue="all"
          type="single"
        >
          <ToggleGroupItem value="all">Tous</ToggleGroupItem>
          <ToggleGroupItem value="matched">Matched</ToggleGroupItem>
          <ToggleGroupItem value="unmatched">Non matchés</ToggleGroupItem>
        </ToggleGroup>

        <Button
          onClick={handleValidate}
          disabled={
            !isMatched ||
            updateRegistrationMutation.isPending ||
            (matchStats?.matched ?? 0) === 0
          }
          variant="default"
        >
          {updateRegistrationMutation.isPending && <Spinner />}
          Valider
        </Button>

        {isMatched && (
          <>
            <Button
              onClick={handleExportMatched}
              disabled={(matchStats?.matched ?? 0) === 0}
              variant="outline"
            >
              <DownloadIcon />
              Exporter matchés
            </Button>
            <Button
              onClick={handleExportUnmatched}
              disabled={(matchStats?.unmatched ?? 0) === 0}
              variant="outline"
            >
              <DownloadIcon />
              Exporter non matchés
            </Button>
          </>
        )}
      </div>

      {/* Match stats banner */}
      {matchStats && (
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-green-600">
            <CheckCircle2 className="size-4" />
            <strong>{matchStats.matched}</strong> correspondance
            {matchStats.matched !== 1 ? "s" : ""}
          </span>
          <span className="text-destructive flex items-center gap-1.5">
            <XCircle className="size-4" />
            <strong>{matchStats.unmatched}</strong> non trouvée
            {matchStats.unmatched !== 1 ? "s" : ""}
          </span>
          {matchStats.alreadyExists > 0 && (
            <span className="flex items-center gap-1.5 text-orange-500">
              <CircleAlert className="size-4" />
              <strong>{matchStats.alreadyExists}</strong> déjà existante
              {matchStats.alreadyExists !== 1 ? "s" : ""} (ignorées)
            </span>
          )}
        </div>
      )}

      {/* Data table */}
      <div className="max-h-[calc(100vh-28rem)] overflow-auto border text-xs">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((h) => (
                <TableHead
                  key={h}
                  className={cn(
                    (h === matchColumn || h === newRegColumn) &&
                      "font-semibold underline underline-offset-2",
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.map((row, index) => (
              <TableRow
                key={index}
                className={cn(
                  row.status === "matched" &&
                    "bg-green-500/10 hover:bg-green-500/20",
                  row.status === "unmatched" &&
                    "bg-destructive/10 hover:bg-destructive/20",
                  row.status === "already_exists" &&
                    "bg-orange-500/10 hover:bg-orange-500/20",
                )}
              >
                {headers.map((h) => (
                  <TableCell key={h} className="py-0">
                    {row.data[h]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
