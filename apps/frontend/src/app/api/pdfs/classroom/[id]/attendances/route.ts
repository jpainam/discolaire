import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { AttendanceSheet } from "~/reports/classroom/AttendanceSheet";
import { caller } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  type: z.enum(["weekly", "periodic"]).optional().default("weekly"),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "No ID provided", status: 400 });
  }
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 },
    );
  }
  try {
    const classroom = await caller.classroom.get(id);

    const school = await caller.school.getSchool();
    const students = await caller.classroom.students(id);
    const { format, type: attendanceType } = parsedQuery.data;

    if (format === "csv") {
      const { blob, headers } = await toExcel({ classroom, students });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        AttendanceSheet({
          classroom: classroom,
          type: attendanceType,
          school: school,
          students: students,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };

      // @ts-expect-error missing types
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  classroom,
  students,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  students: RouterOutputs["classroom"]["students"];
}) {
  const t = await getTranslations();
  const rows = students.map((stud) => {
    return {
      "Noms et Prenom": getFullName(stud),
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("classroom"));
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `Fiche-de-Presence-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
