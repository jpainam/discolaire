/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Table } from "@tanstack/react-table";
import { PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RouterOutputs } from "@repo/api";
import { Button } from "@repo/ui/components/button";

export function EnrolledStudentDataTableAction({
  table,
  newStudent,
}: {
  table: Table<NonNullable<RouterOutputs["enrollment"]["all"]>[number]>;
  newStudent: boolean;
}) {
  const t = useTranslations();

  return (
    <Button
      size={"sm"}
      onClick={() => {
        if (newStudent) {
          window.open(`/api/pdfs/student/new`, "_blank");
        } else {
          window.open(`/api/pdfs/student/registered`, "_blank");
        }
      }}
    >
      <PrinterIcon />
      {t("print")}
    </Button>
  );
}

// function exportToCSV(
//   table: Table<NonNullable<RouterOutputs["student"]["all"]>[number]>,
// ) {
//   const rows = table.getRowModel().rows.map((row) => row.original);
//   const data: string[] = [];
//   rows.forEach((row) => {
//     const val = [];
//     val.push(row.firstName ?? "");
//     val.push(row.lastName ?? "");
//     val.push(row.registrationNumber ?? "");
//     val.push(row.isRepeating ? "Yes" : "No");
//     val.push(row.classroom?.name ?? "");
//     val.push(row.dateOfBirth?.toLocaleDateString() ?? "");
//     val.push(row.user?.email ?? "");
//     data.push(val.join(","));
//   });

//   const blob = new Blob([data.join("\n")], { type: "text/csv;charset=utf-8;" });

//   // Create a link and trigger the download
//   const url = URL.createObjectURL(blob);
//   const link = document.createElement("a");
//   link.setAttribute("href", url);
//   link.setAttribute("download", `Enrolled_student.csv`);
//   link.style.visibility = "hidden";
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// }
