/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ColumnDef, Table } from "@tanstack/react-table";
import type { TFunction } from "i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { z } from "zod";

import { DataTableColumnHeader } from "@repo/ui/datatable/data-table-column-header";

import { ExportButton } from "~/components/shared/buttons/export-button";
import { exportToCSV } from "~/utils/export-to-csv";

const gradeSheetTableSchema = z.object({
  subject: z.string(),
  grade1: z.number().nullable(),
  grade2: z.number().nullable(),
  grade3: z.number().nullable(),
  grade4: z.number().nullable(),
  grade5: z.number().nullable(),
  grade6: z.number().nullable(),
  observation: z.string().nullable(),
});
export type GradeSheetTableType = z.infer<typeof gradeSheetTableSchema>;

const columnHelper = createColumnHelper<GradeSheetTableType>();

export function fetchGradeSheetColumns({
  t,
}: {
  t: TFunction<string, unknown>;
}): ColumnDef<GradeSheetTableType, unknown>[] {
  const columns = [
    columnHelper.accessor("subject", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("subject")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.subject}</div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor("grade1", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade1")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade1}
        </div>
      ),
    }),
    columnHelper.accessor("grade2", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade2")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade2}
        </div>
      ),
    }),
    columnHelper.accessor("grade3", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade3")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade3}
        </div>
      ),
    }),
    columnHelper.accessor("grade4", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade4")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade4}
        </div>
      ),
    }),
    columnHelper.accessor("grade5", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade5")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade5}
        </div>
      ),
    }),
    columnHelper.accessor("grade6", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("grade6")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          {row.original.grade6}
        </div>
      ),
    }),
    columnHelper.accessor("observation", {
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("observation")} />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">{row.original.observation}</div>
      ),
    }),
  ] as ColumnDef<GradeSheetTableType, unknown>[];
  return columns;
}

export function GradeSheetTopBarContent(table: Table<GradeSheetTableType>) {
  return (
    <ExportButton
      onExcelClick={() => {
        const columns = table
          .getAllColumns()
          .map((column) => column.id)
          .join(",");
        const data = table.getRowModel().rows.map((row) => row.original);
        exportToCSV(data, columns, "gradesheet");
      }}
    />
  );
}
