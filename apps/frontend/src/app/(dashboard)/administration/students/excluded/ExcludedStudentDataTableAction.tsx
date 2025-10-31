/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Table } from "@tanstack/react-table";
import { PrinterIcon } from "lucide-react";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

import { useLocale } from "~/i18n";

export function ExcludedStudentDataTableAction({
  table,
}: {
  table: Table<NonNullable<RouterOutputs["student"]["excluded"]>[number]>;
}) {
  const { t } = useLocale();

  return (
    <Button
      size={"sm"}
      onClick={() => {
        window.open(`/api/pdfs/student/excluded`, "_blank");
      }}
    >
      <PrinterIcon />
      {t("print")}
    </Button>
  );
}
