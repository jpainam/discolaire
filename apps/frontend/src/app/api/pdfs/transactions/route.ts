/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as XLSX from "@e965/xlsx";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { TransactionList } from "@repo/reports/transactions/TransactionList";
import { getServerTranslations } from "~/i18n/server";

import { getSheetName } from "~/lib/utils";
import { api } from "~/trpc/server";
import { xlsxType } from "~/utils";

const searchSchema = z.object({
  format: z
    .union([z.literal("pdf"), z.literal("csv")])
    .optional()
    .default("pdf"),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
  classroom: z.string().optional(),
  status: z.enum(["VALIDATED", "PENDING", "CANCELED"]).optional(),
});
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 403 });
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

  const { format, status, from, to, classroom } = result.data;

  const transactions = await api.transaction.all({
    status: status,
    from: from,
    to: to,
    classroomId: classroom,
  });

  const school = await api.school.getSchool();
  if (format === "csv") {
    const { blob, headers } = await toExcel({ transactions });
    return new Response(blob, { headers });
  } else {
    const stream = await renderToStream(
      TransactionList({
        transactions: transactions,
        school: school,
      })
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
  transactions: RouterOutputs["transaction"]["all"];
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
