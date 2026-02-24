"use client";

import type { ComponentPropsWithoutRef } from "react";
import { useRef } from "react";
import { toast } from "sonner";

import type { GradeImportRow } from "~/lib/gradesheet-import";
import { Button } from "~/components/ui/button";
import { parseGradeSheetExcel } from "~/lib/gradesheet-import";

interface ImportGradeButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "onClick" | "type"
> {
  onRows: (rows: GradeImportRow[]) => void;
}

/**
 * Button + hidden file input that parses an Excel gradesheet and calls
 * onRows with the parsed { studentId, grade } rows.
 */
export function ImportGradeButton({
  onRows,
  children,
  ...props
}: ImportGradeButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = await parseGradeSheetExcel(file);
      onRows(rows);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Feuille excel invalide",
      );
    }
    e.target.value = "";
  };

  return (
    <>
      <Button
        type="button"
        {...props}
        onClick={() => inputRef.current?.click()}
      >
        {children}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleChange}
      />
    </>
  );
}
