import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { ProgramList } from "~/reports/classroom/ProgramList";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  subjectId: z.coerce.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
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
    const fees = await caller.classroom.fees(id);
    const { format, subjectId } = parsedQuery.data;

    if (format === "csv") {
      const { blob, headers } = await toExcel({ classroom, fees });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        ProgramList({
          classroom: classroom,
          subjects: subjectId
            ? [await caller.subject.get(Number(subjectId))]
            : await caller.classroom.subjects(id),
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
  fees,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  fees: RouterOutputs["classroom"]["fees"];
}) {
  const t = await getTranslations();
  const rows = fees.map((fee) => {
    return {
      Libelle: fee.description,
      Montant: fee.amount,
      Date: fee.dueDate,
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
  const filename = `List-des-frais-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
