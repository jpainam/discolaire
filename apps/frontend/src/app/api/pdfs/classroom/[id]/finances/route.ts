import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { sumBy } from "lodash";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { getSheetName } from "~/lib/utils";
import { FinanceList } from "~/reports/classroom/FinanceList";
import { caller } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  type: z.enum(["all", "debit", "credit", "selected"]).default("all"),
  ids: z.string().optional(),
  journalId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "No ID provided", status: 400 });
  }
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.format() },
      { status: 400 },
    );
  }
  try {
    const classroom = await caller.classroom.get(id);

    const school = await caller.school.getSchool();

    const { format, ids, journalId } = parsedQuery.data;

    const fees = (await caller.classroom.fees(id)).filter((fee) => {
      return fee.journalId === journalId;
    });
    let balances = await caller.classroom.studentsBalance({ id, journalId });

    if (session.user.profile == "student") {
      const student = await caller.student.getFromUserId(session.user.id);
      balances = balances.filter((balance) => balance.studentId === student.id);
    } else if (session.user.profile == "contact") {
      const contact = await caller.contact.getFromUserId(session.user.id);
      const students = await caller.contact.students(contact.id);
      const studentIds = students.map((student) => student.studentId);
      balances = balances.filter((balance) =>
        studentIds.includes(balance.studentId),
      );
    }
    if (ids) {
      const selectedIds = ids.split(",");
      balances = balances.filter((stud) =>
        selectedIds.includes(stud.studentId),
      );
    }

    const amountDue = sumBy(
      fees.filter((fee) => fee.dueDate <= new Date()),
      "amount",
    );

    const total = balances.reduce(
      (acc, stud) => acc + (stud.balance - amountDue),
      0,
    );

    if (format === "csv") {
      const { blob, headers } = await toExcel({
        classroom,
        amountDue,
        students: balances,
      });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        FinanceList({
          classroom: classroom,
          students: balances,
          total: total,
          type: parsedQuery.data.type,
          amountDue: amountDue,
          school: school,
        }),
      );

      //const blob = await new Response(stream).blob();
      const headers: Record<string, string> = {
        "Content-Type": "application/pdf",
        "Cache-Control": "no-store, max-age=0",
      };

      // @ts-expect-error missing types
      return new Response(stream, { headers });
    }
  } catch (error) {
    console.error(error);
    return new Response(String(error), { status: 500 });
  }
}

async function toExcel({
  classroom,
  students,
  amountDue,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  amountDue: number;
  students: RouterOutputs["classroom"]["studentsBalance"];
}) {
  const { t } = await getServerTranslations();
  const rows = students.map((stud) => {
    return {
      "Nom et Prénom": getFullName(stud),
      Redoublant: stud.isRepeating ? "Oui" : "Non",
      "Total versé": stud.balance,
      Restant: stud.balance - amountDue,
      Status: stud.balance - amountDue < 0 ? "Débiteur" : "Créditeur",
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("classroom"));
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
  const filename = `Situation-Financiere-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
