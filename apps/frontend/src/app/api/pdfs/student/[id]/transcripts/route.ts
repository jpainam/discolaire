/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { getServerTranslations } from "~/i18n/server";

import { GradesheetList } from "@repo/reports/students/GradesheetList";
import { getSheetName } from "~/lib/utils";
import { api, caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  format: z
    .union([z.literal("pdf"), z.literal("csv")])
    .optional()
    .default("pdf"),
});
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 403 });
  }
  const id = (await params).id;

  if (!id) {
    return new Response("Wrong input", { status: 500 });
  }

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

  const { format } = result.data;
  const student = await api.student.get(id);

  const grades = await caller.student.grades({ id });
  const vv: Record<
    number,
    { id: number; subject: string; observation: string; grades: number[] }
  > = {};

  grades.forEach((grade) => {
    if (grade.gradeSheet.subjectId) {
      vv[grade.gradeSheet.subjectId] ??= {
        id: grade.gradeSheet.subjectId,
        subject: grade.gradeSheet.subject.course.name,
        observation: grade.observation ?? "",
        grades: [],
      };
      vv[grade.gradeSheet.subjectId]?.grades.push(grade.grade);
    }
  });

  const data = Object.values(vv).map((entry) => ({
    subject: entry.subject,
    grade1: entry.grades[0] ?? null,
    grade2: entry.grades[1] ?? null,
    grade3: entry.grades[2] ?? null,
    grade4: entry.grades[3] ?? null,
    grade5: entry.grades[4] ?? null,
    grade6: entry.grades[5] ?? null,
    observation: entry.observation,
  }));

  const school = await api.school.getSchool();
  if (format === "csv") {
    const { blob, headers } = await toExcel({ data });
    return new Response(blob, { headers });
  } else {
    const stream = await renderToStream(
      GradesheetList({
        student: student,
        grades: data,
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
}

async function toExcel({
  data,
}: {
  data: {
    subject: string;
    grade1: number | null;
    grade2: number | null;
    grade3: number | null;
    grade4: number | null;
    grade5: number | null;
    grade6: number | null;
    observation: string;
  }[];
}) {
  const { t } = await getServerTranslations();

  const rows = data.map((d) => {
    return {
      subject: d.subject,
      grade1: d.grade1,
      grade2: d.grade2,
      grade3: d.grade3,
      grade4: d.grade4,
      grade5: d.grade5,
      grade6: d.grade6,
      observation: d.observation,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("students"));
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `Eleve-transcript.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
