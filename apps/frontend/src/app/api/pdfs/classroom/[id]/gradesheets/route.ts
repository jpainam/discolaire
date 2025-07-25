import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { getSheetName } from "~/lib/utils";
import { GradesheetList } from "~/reports/classroom/GradesheetList";
import { caller } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  termId: z.string().optional(),
  subjectId: z.coerce.number().optional(),
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

    const { format, subjectId, termId } = parsedQuery.data;

    let gradesheets = await caller.classroom.gradesheets(id);
    if (subjectId) {
      gradesheets = gradesheets.filter((g) => g.subjectId == subjectId);
    }
    if (termId) {
      gradesheets = gradesheets.filter((g) => g.termId == termId);
    }

    if (format === "csv") {
      const { blob, headers } = await toExcel({
        classroom,
        gradesheets,
      });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        GradesheetList({
          classroom: classroom,
          gradesheets: gradesheets,
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
  gradesheets,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  gradesheets: RouterOutputs["classroom"]["gradesheets"];
}) {
  const { t } = await getServerTranslations();
  const rows = gradesheets.map((gr) => {
    return {
      Date: gr.createdAt.toLocaleDateString(),
      Matière: gr.subject.course.name,
      Enseignant: getFullName(gr.subject.teacher),
      Coefficient: gr.subject.coefficient,
      Noté: gr.num_grades,
      Absent: gr.num_is_absent,
      Moyenne: gr.avg.toFixed(2),
      Min: gr.min.toFixed(2),
      Max: gr.max.toFixed(2),
      Poids: gr.weight,
      Période: gr.term.name,
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
  const filename = `Liste-des-notes-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
