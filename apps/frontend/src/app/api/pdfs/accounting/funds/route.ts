import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { ClassroomFundList } from "~/reports/accounting/ClassroomFundList";
import { FundList } from "~/reports/accounting/FundList";
import { getQueryClient, trpc } from "~/trpc/server";
import { xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  classroomId: z.string().optional(),
  journalId: z.string(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = querySchema.safeParse(searchParams);
  if (!parsed.success) {
    const error = z.treeifyError(parsed.error);
    return NextResponse.json({ error }, { status: 400 });
  }
  try {
    const { format, classroomId, journalId } = parsed.data;
    const queryClient = getQueryClient();
    const schoolYear = await queryClient.fetchQuery(
      trpc.schoolYear.getCurrent.queryOptions(),
    );
    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );
    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };
    if (!classroomId) {
      const quotas = await queryClient.fetchQuery(
        trpc.transaction.quotas.queryOptions({ journalId }),
      );
      if (format === "csv") {
        const { blob, headers } = toExcel({ quotas });
        return new Response(blob, { headers });
      } else {
        const stream = await renderToStream(
          FundList({
            quotas: quotas,
            schoolYear: schoolYear,
            school: school,
          }),
        );
        // @ts-expect-error missing types
        return new Response(stream, { headers });
      }
    } else {
      const transactions = await queryClient.fetchQuery(
        trpc.transaction.all.queryOptions({ classroomId, journalId }),
      );
      const classroom = await queryClient.fetchQuery(
        trpc.classroom.get.queryOptions(classroomId),
      );
      const students = await queryClient.fetchQuery(
        trpc.classroom.students.queryOptions(classroomId),
      );
      const fees = await queryClient.fetchQuery(
        trpc.classroom.fees.queryOptions(classroomId),
      );
      const stream = await renderToStream(
        ClassroomFundList({
          transactions,
          fees,
          students,
          classroom,
          schoolYear,
          school,
        }),
      );
      // @ts-expect-error missing types
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

function toExcel({
  quotas,
}: {
  quotas: RouterOutputs["transaction"]["quotas"];
}) {
  const rows = quotas.map((q) => {
    return {
      Classe: q.classroom,
      Effectif: q.effectif,
      "Total attendu": q.revenue,
      "Montant recu": q.paid,
      Difference: q.remaining,
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName("Compte caisse global");
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
  const filename = `compte_caisse_global.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
