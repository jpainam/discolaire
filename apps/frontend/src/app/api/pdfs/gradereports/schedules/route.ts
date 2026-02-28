import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { getTranslations } from "next-intl/server";
import { z } from "zod/v4";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getSheetName } from "~/lib/utils";
import { GradeReportScheduleList } from "~/reports/gradereports/GradeReportScheduleList";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
});

function formatDate(date: Date | null | undefined, locale = "fr-FR"): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const parsedQuery = querySchema.safeParse(searchParams);
  if (!parsedQuery.success) {
    return NextResponse.json(
      { error: parsedQuery.error.issues },
      { status: 400 },
    );
  }

  try {
    const cookieStore = await cookies();
    const schoolYearId = cookieStore.get("x-school-year");
    if (!schoolYearId) {
      throw new Error("School year id is required");
    }

    const [terms, schedules, school, schoolYear] = await Promise.all([
      caller.term.all(),
      caller.termReportConfig.all(),
      caller.school.getSchool(),
      caller.schoolYear.get(schoolYearId.value),
    ]);

    const { format } = parsedQuery.data;

    if (format === "csv") {
      const { blob, headers } = await toExcel({ terms, schedules });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        GradeReportScheduleList({ school, schoolYear, terms, schedules }),
      );

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
  terms,
  schedules,
}: {
  terms: RouterOutputs["term"]["all"];
  schedules: RouterOutputs["termReportConfig"]["all"];
}) {
  const t = await getTranslations();

  const scheduleByTermId = new Map(schedules.map((s) => [s.termId, s]));

  const rows = terms.map((term) => {
    const schedule = scheduleByTermId.get(term.id);
    return {
      Période: term.name,
      Statut: term.isActive ? "Actif" : "Inactif",
      "Début examens": formatDate(schedule?.examStartDate),
      "Fin examens": formatDate(schedule?.examEndDate),
      "Publication bulletins": formatDate(schedule?.resultPublishedAt),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("schedules"));
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const u8 = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const blob = new Blob([u8], { type: `${xlsxType};charset=utf-8;` });
  const headers: Record<string, string> = {
    "Content-Type": xlsxType,
    "Cache-Control": "no-store, max-age=0",
    "Content-Disposition": `attachment; filename="Calendrier-examens-bulletins.xlsx"`,
  };

  return { blob, headers };
}
