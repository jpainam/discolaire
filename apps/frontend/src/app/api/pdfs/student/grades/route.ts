/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { auth } from "@repo/auth";
import { GradeList, renderToStream } from "@repo/reports";
import { getServerTranslations } from "~/i18n/server";

import { getSheetName } from "~/lib/utils";
import { api } from "~/trpc/server";
import { xlsxType } from "~/utils/file-type";
import { getAppreciations } from "~/utils/get-appreciation";

const searchSchema = z.object({
  id: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
  const session = await auth();
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
    const { id, format } = result.data;
    const school = await api.school.getSchool();

    const student = await api.student.get(id);

    const grades = await api.student.grades({ id });

    if (format === "csv") {
      const { blob, headers } = await toExcel({ grades, student });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        GradeList({
          student: student,
          grades: grades,
          school: school,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };
      // @ts-expect-error TODO: fix this
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  grades,
  student,
}: {
  student: RouterOutputs["student"]["get"];
  grades: RouterOutputs["student"]["grades"];
}) {
  const { t } = await getServerTranslations();
  const rows = grades.map((grade) => {
    return {
      Sequence: grade.gradeSheet.term.name,
      Matiere: grade.gradeSheet.subject.course.shortName,
      Description: grade.gradeSheet.name,
      Note: grade.grade,
      Appreciation: getAppreciations(grade.grade),
      Date: grade.gradeSheet.updatedAt.toLocaleDateString(),
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("grades") + " " + student.lastName);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `List-${sheetName}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
