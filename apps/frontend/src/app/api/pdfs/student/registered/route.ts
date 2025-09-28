/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextRequest } from "next/server";
import * as XLSX from "@e965/xlsx";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { db } from "~/lib/db";
import { getSheetName } from "~/lib/utils";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

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

    const enrolled = await caller.student.all({ limit: 10000 });
    //const students = enrolled.filter((std) => std.isNew);
    const { blob, headers } = await toExcel({ students: enrolled });
    return new Response(blob, { headers });
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  students,
}: {
  students: RouterOutputs["student"]["all"];
}) {
  const { t } = await getServerTranslations();
  const studentIds = students.map((student) => student.id);
  const contacts = await db.studentContact.findMany({
    where: {
      studentId: {
        in: studentIds,
      },
    },
    include: {
      contact: true,
    },
  });

  const rows = students.map((student) => {
    const studentContacts = contacts.filter((c) => c.studentId === student.id);
    const contactNames = studentContacts
      .map((c) => c.contact.lastName)
      .join(", ");
    const contactPhones = studentContacts
      .map((c) => c.contact.phoneNumber1)
      .filter((phone) => phone)
      .join(", ");
    return {
      registrationNumber: student.registrationNumber,
      Prénom: student.firstName,
      Nom: student.lastName,
      Gender: t(`${student.gender}`),
      isRepeating: student.isRepeating ? t("yes") : t("no"),
      classroom: student.classroom?.name,
      religion: student.religion?.name,
      formerSchool: student.formerSchool?.name,
      Residence: student.residence,
      Email: student.user?.email,
      Phone: student.phoneNumber,
      Address: student.residence,
      "Date de naissance": student.dateOfBirth,
      "Lieu de naissance": student.placeOfBirth,
      dateOfEntry: student.dateOfEntry,
      Parents: contactNames,
      "Parent Phones": contactPhones,
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
  const filename = `List-${crypto.randomUUID()}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
