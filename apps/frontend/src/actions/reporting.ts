"use server";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { db } from "~/lib/db";
import { numberToWords } from "~/lib/toword";
import { caller } from "~/trpc/server";

export async function printReceipt(transactionId: number) {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const transaction = await db.transaction.update({
      data: {
        printedAt: new Date(),
        printedById: session.user.id,
      },
      where: {
        id: transactionId,
      },
    });
    const data = await caller.transaction.getReceiptInfo(transactionId);
    const title = `${data.student.lastName} ${data.transaction.transactionRef}`;

    const { i18n } = await getServerTranslations();
    const lang = i18n.language;
    if (!lang) {
      throw new Error("Language not set");
    }
    const inLetter = `${transaction.amount.toLocaleString(lang)} ${data.school.currency} (${numberToWords(data.transaction.amount, lang)})`;

    const v = await caller.reporting.submitReport({
      endpoint: "receipt",
      title: title,
      data: {
        ...data,
        inLetter: inLetter,
        lang: lang,
      },
    });
    return v;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
