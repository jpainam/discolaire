"use client";

import type { Table } from "@tanstack/react-table";
import { useQueryState } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { TermSelector } from "~/components/shared/selects/TermSelector";

type ProcedureOutput = RouterOutputs["attendance"]["list"]["data"][number];

export function AttendanceDataTableAction({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  table,
}: {
  table: Table<ProcedureOutput>;
}) {
  const [_, setTermId] = useQueryState("termId");

  return (
    <TermSelector
      className="w-64"
      onChange={(val) => {
        void setTermId(val);
      }}
    />
  );
}
