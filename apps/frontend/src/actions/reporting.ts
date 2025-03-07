"use server";

import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { getServerTranslations } from "~/i18n/server";
import { numberToWords } from "~/lib/toword";

import { api } from "~/trpc/server";

export async function printReceipt(transactionId: number) {
  try {
    const session = await auth();
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
    const data = await api.transaction.getReceiptInfo(transactionId);
    const title = `${data.student.lastName} ${data.transaction.transactionRef}`;

    const { i18n } = await getServerTranslations();
    const lang = i18n.language;
    if (!lang) {
      throw new Error("Language not set");
    }
    const inLetter = `${transaction.amount.toLocaleString(lang)} ${data.school.currency} (${numberToWords(data.transaction.amount, lang)})`;

    const v = await api.reporting.submitReport({
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
