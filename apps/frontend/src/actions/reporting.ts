"use server";

import { auth } from "@repo/auth";
import { db } from "@repo/db";
import { getServerTranslations } from "@repo/i18n/server";
import { numberToWords } from "@repo/lib";

import { api } from "~/trpc/server";

export async function printStudentList() {
  const students = await api.student.all({});
  const v = await api.reporting.submitReport({
    endpoint: "student-list",
    data: students,
    title: "Student List",
  });
  return v;
}

export async function printClassroomStudent(
  classroomId: string,
  title: string,
) {
  const students = await api.classroom.students(classroomId);
  const v = await api.reporting.submitReport({
    endpoint: "classroom/students",
    data: students,
    title: title,
  });
  return v;
}
export async function printClassroom(title: string, type: "pdf" | "excel") {
  try {
    const classrooms = await api.classroom.all();
    const v = await api.reporting.submitReport({
      endpoint: "classroom/list",
      type: type,
      data: { data: classrooms },
      title: title,
    });
    return v;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

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
