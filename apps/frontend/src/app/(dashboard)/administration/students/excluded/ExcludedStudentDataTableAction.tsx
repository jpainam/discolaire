/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Table } from "@tanstack/react-table";
import { PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";

import { Button } from "~/components/ui/button";

export function ExcludedStudentDataTableAction({
  table,
}: {
  table: Table<NonNullable<RouterOutputs["student"]["excluded"]>[number]>;
}) {
  const t = useTranslations();

  return (
    <Button
      onClick={() => {
        window.open(`/api/pdfs/student/excluded`, "_blank");
      }}
    >
      <PrinterIcon />
      {t("print")}
    </Button>
  );
}
