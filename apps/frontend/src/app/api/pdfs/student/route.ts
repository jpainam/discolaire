/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { renderToStream, StudentList } from "@repo/reports";
import { getServerTranslations } from "~/i18n/server";

import { auth } from "@repo/auth";
import { getSheetName } from "~/lib/utils";
import { api } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
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

    const { preview, format } = result.data;

    const students = await api.enrollment.ennrolled({});

    const school = await api.school.getSchool();
    if (format === "csv") {
      const { blob, headers } = await toExcel({ students });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        StudentList({
          students: students,
          school: school,
        })
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
  students,
}: {
  students: RouterOutputs["enrollment"]["ennrolled"];
}) {
  const { t, i18n } = await getServerTranslations();
  const dateFormat = Intl.DateTimeFormat(i18n.language, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
  const rows = students.map((student) => {
    return {
      registrationNumber: student.registrationNumber,
      "First Name": student.firstName,
      "Last Name": student.lastName,
      Gender: t(`${student.gender}`),
      isRepeating: student.isRepeating ? t("yes") : t("no"),
      classroom: student.classroom?.name,
      religion: student.religion?.name,
      formerSchool: student.formerSchool?.name,
      Residence: student.residence,
      Email: student.email,
      Phone: student.phoneNumber,
      Address: student.residence,
      "Date of Birth":
        student.dateOfBirth && dateFormat.format(student.dateOfBirth),
      dateOfEntry:
        student.dateOfEntry && dateFormat.format(student.dateOfEntry),
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
  const filename = `List-${crypto.randomUUID()}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
