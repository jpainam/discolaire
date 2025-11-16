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

    const rows = students.map((student) => {
      return {
        id: student.id,
        Matricule: student.registrationNumber,
        "Nom et Prénom": getFullName(student),
        Note: "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(rows);

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
