/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { StatisticByCourse } from "~/reports/gradereports/StatisticByCourse";
import { getAppreciations } from "~/reports/utils";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  termId: z.string().min(1),
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
      termId,
    });
    //const school = await caller.school.getSchool();
    const term = await caller.term.get(termId);
    const course = await caller.course.get(courseId);
    if (format === "csv") {
      const { blob, headers } = toExcel({ stats });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        await StatisticByCourse({
          stats: stats,
          course: course,
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
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

function toExcel({ stats }: { stats: RouterOutputs["course"]["statistics"] }) {
  const rows = stats.map((s) => {
    return {
      Classe: s.classroom.reportName,
      Enseignant: s.teacher?.lastName,
      "Evalué/Effectif": `${s.evaluated}/${s.total}`,
      Moyenne: s.avg,
      "Moy >= 10": s.above10,
      "Taux de réussite Garcons ": (s.boysRate * 100).toFixed(2) + "%",
      "Taux de réussite Filles": (s.girlsRate * 100).toFixed(2) + "%",
      "Taux de réussite": (s.totalRate * 100).toFixed(2) + "%",
      Appréciation: getAppreciations(s.avg),
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = "Statistiques des matières";
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
