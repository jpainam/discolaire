import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { parseSearchParams } from "~/app/api/utils";
import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { FinanceList } from "~/reports/classroom/FinanceList";
import { getQueryClient, trpc } from "~/trpc/server";
import { getFullName, xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  situation: z.enum(["debit", "credit"]).optional(),
  studentId: z.string().optional(),
  journalId: z.string().optional(),
  classroomId: z.string().min(1),
});

const sum = (a: number[]) => {
  return a.reduce((acc, val) => acc + val, 0);
};

export async function GET(
  request: NextRequest,
  //{ params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const searchParams = parseSearchParams(request);
  const parsed = querySchema.safeParse(searchParams);
  if (!parsed.success) {
    const errors = parsed.error;
    return NextResponse.json(
      { error: z.treeifyError(errors) },
      { status: 400 },
    );
  }
  try {
    const { format, studentId, classroomId, journalId, situation } =
      parsed.data;
    const queryClient = getQueryClient();

    const classroom = await queryClient.fetchQuery(
      trpc.classroom.get.queryOptions(classroomId),
    );

    const school = await queryClient.fetchQuery(
      trpc.school.getSchool.queryOptions(),
    );

    const fees = await queryClient.fetchQuery(
      trpc.classroom.fees.queryOptions(classroom.id),
    );
    const amountDues = new Map<string, number>();
    const journals = await queryClient.fetchQuery(
      trpc.accountingJournal.all.queryOptions(),
    );
    if (journalId) {
      const journal = journals.find((j) => j.id === journalId);
      if (journal) {
        journals.splice(0, journals.length, journal);
      }
    }

    for (const journal of journals) {
      const amountDue = sum(
        fees
          .filter(
            (fee) => fee.dueDate <= new Date() && fee.journalId === journal.id,
          )
          .map((fee) => fee.amount),
      );
      amountDues.set(journal.id, amountDue);
    }
    let balances = await queryClient.fetchQuery(
      trpc.classroom.studentsBalance.queryOptions(classroomId),
    );
    if (studentId) {
      balances = balances.filter((b) => b.id === studentId);
    }
    if (situation) {
      if (situation === "debit") {
        balances = balances.filter((balance) => {
          const totalBalance = sum(balance.journals.map((j) => j.balance));
          return totalBalance < 0;
        });
      } else {
        balances = balances.filter((balance) => {
          const totalBalance = sum(balance.journals.map((j) => j.balance));
          return totalBalance > 0;
        });
      }
    }

    if (format === "csv") {
      const { blob, headers } = await toExcel({
        classroom,
        amountDues,
        journals,
        students: balances,
      });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        FinanceList({
          classroom: classroom,
          journals: journals,
          students: balances,
          amountDues: amountDues,
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
  amountDues,
  journals,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  amountDues: Map<string, number>;
  journals: RouterOutputs["accountingJournal"]["all"];
  students: RouterOutputs["classroom"]["studentsBalance"];
}) {
  const t = await getTranslations();
  const rows = students.map((stud) => {
    const byJournal = Object.fromEntries(
      journals.flatMap((journal) => {
        const accountJournal = stud.journals.find(
          (j) => j.journalId === journal.id,
        );
        const amountDue = amountDues.get(journal.id) ?? 0;
        const paid = accountJournal?.balance ?? 0;
        //const status = paid - amountDue < 0 ? "Débiteur" : "Créditeur";
        const remaining = amountDue - paid;
        return [[`Total due/versé - ${journal.name}`, `${remaining}/${paid}`]];
      }),
    );

    return {
      "Nom et Prénom": getFullName(stud),
      Redoublant: stud.isRepeating ? "Oui" : "Non",
      ...byJournal,
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
