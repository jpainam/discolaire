/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { renderToStream } from "@react-pdf/renderer";
import type { RouterOutputs } from "@repo/api";
import { getServerTranslations } from "~/i18n/server";
import { TransactionList } from "~/reports/students/TransactionList";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { caller } from "~/trpc/server";
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
  const session = await getSession();
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

  const student = await caller.student.get(id);
  const transactions = await caller.student.transactions(id);

  const school = await caller.school.getSchool();
  if (format === "csv") {
    const { blob, headers } = await toExcel({ transactions });
    return new Response(blob, { headers });
  } else {
    const stream = await renderToStream(
      TransactionList({
        student: student,
        transactions: transactions,
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
  transactions,
}: {
  transactions: RouterOutputs["student"]["transactions"];
}) {
  const { t } = await getServerTranslations();

  const rows = transactions.map((tra) => {
    return {
      Date: tra.createdAt.toLocaleDateString(),
      "Ref. Caisse": tra.transactionRef,
      Type: tra.transactionType,
      Description: tra.description,
      Montant: tra.amount,
      Status: tra.status,
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
  const filename = `List-transactions.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
