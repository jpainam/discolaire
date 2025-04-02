/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { ClassroomList, renderToStream } from "@repo/reports";
import { getServerTranslations } from "~/i18n/server";

import { auth } from "@repo/auth";
import { getSheetName } from "~/lib/utils";
import { api } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
  size: z
    .union([z.literal("letter"), z.literal("a4")])
    .optional()
    .default("letter"),
  format: z
    .union([z.literal("pdf"), z.literal("csv")])
    .optional()
    .default("pdf"),
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

    const { size, preview, format } = result.data;

    const classrooms = await api.classroom.all();

    const school = await api.school.getSchool();
    if (format === "csv") {
      const { blob, headers } = await toExcel({ classrooms });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        ClassroomList({
          classrooms: classrooms,
          school: school,
          size: size,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };
      const filename = crypto.randomUUID();
      if (!preview) {
        headers["Content-Disposition"] =
          `attachment; filename="Liste-${filename}.pdf"`;
      }

      // @ts-expect-error TODO: fix this
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  classrooms,
}: {
  classrooms: RouterOutputs["classroom"]["all"];
}) {
  const { t } = await getServerTranslations();
  const rows = classrooms.map((cl) => {
    return {
      name: cl.name,
      reportName: cl.reportName,
      section: cl.section?.name,
      level: cl.level.name,
      size: cl.size,
      maxSize: cl.maxSize,
      headTeacher: cl.headTeacher?.lastName,
      seniorAdvisor: cl.seniorAdvisor?.lastName,
      femaleCount: cl.femaleCount,
      maleCount: cl.maleCount,
      classroomLeader: cl.classroomLeader?.lastName,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("classroom"));
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: `${xlsxType};charset=utf-8;`,
  });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `List-${crypto.randomUUID()}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
