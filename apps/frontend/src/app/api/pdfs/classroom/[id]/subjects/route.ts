import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { getSheetName } from "~/lib/utils";
import { SubjectList } from "~/reports/classroom/SubjectList";
import { caller } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = params;
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
    const subjects = await caller.classroom.subjects(id);
    const { format } = parsedQuery.data;

    if (format === "csv") {
      const { blob, headers } = await toExcel({ classroom, subjects });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        SubjectList({
          classroom: classroom,
          subjects: subjects,
          school: school,
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
  subjects,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  subjects: RouterOutputs["classroom"]["subjects"];
}) {
  const { t } = await getServerTranslations();
  const rows = subjects.map((subject) => {
    return {
      Libelle: subject.course.name,
      "Nom court": subject.course.shortName,
      coefficient: subject.coefficient,
      groupe: subject.subjectGroup?.name,
      ordre: subject.order,
      Prof: getFullName(subject.teacher),
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
  const filename = `List-des-enseignement-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
