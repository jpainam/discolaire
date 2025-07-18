import type { NextRequest } from "next/server";
import { z } from "zod";

import { renderToStream } from "@react-pdf/renderer";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { numberToWords } from "~/lib/toword";
import { getReceipt } from "~/reports/statements/receipt";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  id: z.coerce.number(),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
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

    const transaction = await caller.transaction.get(id);

    const school = await caller.school.getSchool();
    //const student = await caller.student.get(transaction.account.studentId);
    //const contacts = await caller.student.contacts(transaction.account.studentId);
    const { i18n } = await getServerTranslations();
    const amountInWords = numberToWords(transaction.amount, i18n.language);

    const info = await caller.transaction.getReceiptInfo(id);

    const stream = await renderToStream(
      getReceipt({
        school,
        amountInWords,
        transaction,
        info,
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
