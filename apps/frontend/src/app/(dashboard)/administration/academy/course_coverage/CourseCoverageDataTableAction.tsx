"use client";

import type { Table } from "@tanstack/react-table";

import type { RouterOutputs } from "@repo/api";

export function CourseCoverageDataTableAction({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  table,
}: {
  table: Table<RouterOutputs["subjectProgram"]["all"][number]>;
}) {
  return <div>Action</div>;
}
