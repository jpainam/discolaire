"use server";

import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { getServerTranslations } from "@repo/i18n/server";
import { numberToWords } from "@repo/lib";

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

export async function printStudentGrade({
  studentId,
  termId,
  title,
  type,
}: {
  studentId: string;
  termId: number | null;
  title: string;
  type: "pdf" | "excel";
}) {
  try {
    const student = await api.student.get(studentId);
    const grades = await api.student.grades({
      id: studentId,
      termId: termId ?? undefined,
    });
    const data = grades.map((g) => {
      return {
        id: g.id,
        name: g.gradeSheet.name,
        subject: g.gradeSheet.subject.course.name,
        term: g.gradeSheet.term.name,
        grade: g.grade,
        coefficient: g.gradeSheet.subject.coefficient,
        scale: g.gradeSheet.scale,
        weight: g.gradeSheet.weight,
      };
    });
    return api.reporting.submitReport({
      endpoint: "student/grades",
      type: type,
      title: title,
      data: {
        student: student,
        grades: data,
      },
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}
