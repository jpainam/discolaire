/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { getServerTranslations } from "~/i18n/server";

import { renderToStream } from "@react-pdf/renderer";
import { getSession } from "~/auth/server";
import { StatisticByCourse } from "~/reports/gradereports/StatisticByCourse";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  termId: z.coerce.number(),
  courseId: z.string().min(1),
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
      const error = result.error.issues.map((e) => e.message).join(", ");
      return new Response(error, { status: 400 });
    }
    const { termId, courseId, format } = result.data;
    const stats = await caller.course.statistics({
      id: courseId,
      termId: Number(termId),
    });
    const school = await caller.school.getSchool();
    const term = await caller.term.get(Number(termId));
    const course = await caller.course.get(courseId);
    if (format === "csv") {
      //const { blob, headers } = await toExcel({ reports });
      //return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        StatisticByCourse({
          stats: stats,
          course: course,
          school: school,
          term: term,
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
    return new Response("Not implemented yet", {
      status: 501,
    });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function _toExcel({
  reports,
}: {
  reports: {
    registrationNumber: string | null;
    studentName: string;
    dateOfBirth: Date | null;
    isRepeating: boolean;
    grade: number;
    observation: string;
  }[];
}) {
  const { t } = await getServerTranslations();
  const rows = reports.map((grade) => {
    return {
      "Registration Number": grade.registrationNumber ?? "",
      "Student Name": grade.studentName,
      "Date of Birth": grade.dateOfBirth
        ? new Date(grade.dateOfBirth).toLocaleDateString()
        : "",
      "Is Repeating": grade.isRepeating ? t("yes") : t("no"),
      Grade: grade.grade,
      Observation: grade.observation,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = "Tableau de Honneur";
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
