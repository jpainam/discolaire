/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import GradeList from "~/reports/students/GradeList";
import { caller, getQueryClient, trpc } from "~/trpc/server";
import { xlsxType } from "~/utils";
import { getAppreciations } from "~/utils/appreciations";

const searchSchema = z.object({
  id: z.string().min(1),
  termId: z.string().optional(),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
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
      const error = z.treeifyError(result.error);
      return NextResponse.json(error, { status: 400 });
    }
    const { id, format, termId } = result.data;
    const queryClient = getQueryClient();
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const student = await queryClient.fetchQuery(
      trpc.student.get.queryOptions(id),
    );

    let grades = await caller.student.grades({ id });
    const schoolYear = await queryClient.fetchQuery(
      trpc.schoolYear.getCurrent.queryOptions(),
    );
    if (termId) {
      grades = grades.filter((g) => g.gradeSheet.termId == termId);
    }

    if (format === "csv") {
      const { blob, headers } = await toExcel({ grades, student });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        GradeList({
          student,
          schoolYear,
          grades,
          school,
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
  const t = await getTranslations();
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
