/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import * as XLSX from "@e965/xlsx";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const searchSchema = z.object({
  classroomId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const requestUrl = new URL(req.url);

    const obj: Record<string, string> = {};

    for (const [key, value] of requestUrl.searchParams.entries()) {
      obj[key] = value;
    }

    const result = searchSchema.safeParse(obj);
    if (!result.success) {
      const error = result.error.issues.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { classroomId } = result.data;
    const queryClient = getQueryClient();

    const students = await queryClient.fetchQuery(
      trpc.classroom.students.queryOptions(classroomId),
    );
    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );
    const rows = students.map((student) => {
      return {
        id: student.id,
        Matricule: student.registrationNumber,
        "Nom et Prénom": getFullName(student),
        Note: "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows, {
      origin: "A2", // <-- start writing the json at row 2, so row 1 is free for the title
    });
    ws.A1 = {
      v: school.name,
      t: "s",
      s: {
        font: { bold: true, sz: 16, color: { rgb: "FFFFFFFF" } },
        alignment: { horizontal: "center", vertical: "center" },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "1E293B" }, // slate-800 vibe
        },
      },
    };
    ws["!merges"] = [
      {
        s: { r: 0, c: 0 }, // start row 0 col 0 -> A1
        e: { r: 0, c: 3 }, // end   row 0 col 3 -> D1  (so A1:D1 merged)
      },
    ];
    // 5. Style header row (row 2 now contains headers from json_to_sheet)
    // Header cells live in row 2 (index 1 because 0-based in SheetJS utils).
    // We can loop through keys in the first row object to style them.
    const headerRowNumberExcel = 2; // human (1-based)
    const headerRowNumber0 = headerRowNumberExcel - 1; // 1 for zero-based math
    const dataheaders = Object.keys(rows[0] ?? {});
    dataheaders.forEach((key, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: headerRowNumber0,
        c: colIndex,
      }); // e.g. A2, B2...
      if (!ws[cellAddress]) return;
      ws[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFFFF" } },
        alignment: { horizontal: "center" },
        fill: { patternType: "solid", fgColor: { rgb: "334155" } }, // slate-700
        border: {
          top: { style: "thin", color: { rgb: "FFFFFFFF" } },
          bottom: { style: "thin", color: { rgb: "FFFFFFFF" } },
        },
      };
    });

    // 6. Style first column (column A) for ALL rows (ids here)
    // We'll walk every row that exists in the sheet range.
    const range = XLSX.utils.decode_range(ws["!ref"]!);
    for (let row = range.s.r; row <= range.e.r; row++) {
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: 0 }); // column A = c:0
      if (!ws[cellAddress]) continue;
      // don't overwrite A1 styling (title), just skip row 0 there
      if (row === 0) continue;

      const existing = ws[cellAddress].s ?? {};
      ws[cellAddress].s = {
        ...existing,
        fill: { patternType: "solid", fgColor: { rgb: "FDE68A" } }, // amber-200
        font: { ...existing.font, bold: true },
      };
    }

    // 7. Column widths
    // SheetJS uses !cols = array of { wch: number } (width in "characters")
    // We specifically want to fit column D, but let's also give sane widths
    // We'll say:
    // A: narrow
    // B: medium
    // C: wide for names
    // D: autofit-ish (you can tweak)
    ws["!cols"] = [
      { wch: 8 }, // A (id)
      { wch: 18 }, // B (registrationNumber)
      { wch: 60 }, // C (Nom et Prénom)
      { wch: 40 }, // D (whatever your 4th column is) <- "fit the width of column D"
    ];

    // 8. Also bump row height for title row so it looks like a banner
    ws["!rows"] = [];
    ws["!rows"][0] = { hpt: 28 }; // ~28pt height for row 1
    const workbook = XLSX.utils.book_new();
    const sheetName = getSheetName("Liste des eleves " + classroom.name);
    XLSX.utils.book_append_sheet(workbook, ws, sheetName);

    const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    const blob = new Blob([u8], {
      type: `${xlsxType};charset=utf-8;`,
    });
    const headers: Record<string, string> = {
      "Content-Type": xlsxType,
      "Cache-Control": "no-store, max-age=0",
    };
    const filename = `${sheetName}.xlsx`;
    headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    return new Response(blob, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
