import type { NextRequest } from "next/server";
import { z } from "zod";

import { IPBWReceipt, renderToStream } from "@repo/reports";

import { auth } from "@repo/auth";
import i18next from "i18next";
import { numberToWords } from "~/lib/toword";
import { api } from "~/trpc/server";

const searchSchema = z.object({
  id: z.coerce.number(),
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
    const { id } = result.data;

    const transaction = await api.transaction.get(id);

    const school = await api.school.getSchool();
    //const student = await api.student.get(transaction.account.studentId);
    //const contacts = await api.student.contacts(transaction.account.studentId);
    const amountInWords = numberToWords(transaction.amount, i18next.language);

    const info = await api.transaction.getReceiptInfo(id);

    const stream = await renderToStream(
      IPBWReceipt({
        transaction: transaction,
        amountInWords: amountInWords,
        school: school,
        info: info,
      }),
    );

    // @ts-expect-error TODO: fix this
    const blob = await new Response(stream).blob();

    const headers: Record<string, string> = {
      "Content-Type": "application/pdf",
      "Cache-Control": "no-store, max-age=0",
    };

    return new Response(blob, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}
