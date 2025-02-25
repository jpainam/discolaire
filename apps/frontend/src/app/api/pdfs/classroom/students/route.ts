import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { ClassroomStudentList, renderToStream } from "@repo/reports";
import { getServerTranslations } from "~/i18n/server";

import { api } from "~/trpc/server";

const searchSchema = z.object({
  preview: z.coerce.boolean().default(true),
  size: z.union([z.literal("letter"), z.literal("a4")]).default("letter"),
  id: z.string().min(1),
  format: z.union([z.literal("pdf"), z.literal("csv")]).default("pdf"),
});
export async function GET(req: NextRequest) {
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
    const { id, preview, format } = result.data;

    const students = await api.classroom.students(id);
    const classroom = await api.classroom.get(id);
    const school = await api.school.getSchool();
    if (format === "csv") {
      const { blob, headers } = await toExcel({ students, classroom });
      return new Response(blob, { headers });
    } else {
      const { blob, headers } = await toPdf({
        students,
        preview,
        school,
        classroom,
      });
      // @ts-expect-error TODO: fix this
      return new Response(blob, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  students,
  classroom,
}: {
  students: RouterOutputs["classroom"]["students"];
  classroom: RouterOutputs["classroom"]["get"];
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
      Religion: student.religion?.name,
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
  const sheetName = classroom.name.replace(/[/\\?*[\]:]/g, "_");
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;",
  });
  const headers: Record<string, string> = {
    "Content-Type":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = `${classroom.name}-students-${crypto.randomUUID()}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function toCSV({
  students,
  preview,
}: {
  students: RouterOutputs["classroom"]["students"];
  preview: boolean;
}) {
  const { i18n } = await getServerTranslations();
  const data = students.map((student) => {
    return {
      "First Name": student.firstName,
      "Last Name": student.lastName,
      Email: student.email,
      Phone: student.phoneNumber,
      Address: student.residence,
      "Date of Birth": student.dateOfBirth?.toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "UTC",
      }),
    };
  });
  // @ts-expect-error TODO: fix this
  const heads = data.length > 0 ? Object.keys(data[0]) : [];
  // Build CSV content
  const csvContent = [
    heads.join(","),
    ...data.map((row) =>
      heads
        .map((header) => {
          const cellValue = row[header as keyof typeof row];
          return typeof cellValue === "string"
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(",")
    ),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const headers: Record<string, string> = {
    "Content-Type": "text/csv",
    "Cache-Control": "no-store, max-age=0",
  };
  const filename = crypto.randomUUID();
  if (!preview) {
    headers["Content-Disposition"] = `attachment; filename="${filename}.pdf"`;
  }
  return { blob, headers };
}

async function toPdf({
  students,
  preview,
  school,
  classroom,
  size = "a4",
}: {
  students: RouterOutputs["classroom"]["students"];
  preview: boolean;
  classroom: RouterOutputs["classroom"]["get"];
  school: RouterOutputs["school"]["getSchool"];
  size?: "a4" | "letter";
}) {
  const stream = await renderToStream(
    ClassroomStudentList({
      students: students,
      school: school,
      size: size,
      classroom: classroom,
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
  return { blob: stream, headers };
}
