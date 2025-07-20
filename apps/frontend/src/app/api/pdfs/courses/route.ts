import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as XLSX from "@e965/xlsx";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";

import { getSession } from "~/auth/server";
import { getServerTranslations } from "~/i18n/server";
import { getSheetName } from "~/lib/utils";
import { CourseList } from "~/reports/course/CourseList";
import { caller } from "~/trpc/server";
import { xlsxType } from "~/utils";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
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
    const courses = await caller.course.all();

    const school = await caller.school.getSchool();

    const { format } = parsedQuery.data;
    const cookieStore = await cookies();

    const schoolYearId = cookieStore.get("x-school-year");
    if (!schoolYearId) {
      throw new Error("School year id is required");
    }
    const schoolYear = await caller.schoolYear.get(schoolYearId.value);

    if (format === "csv") {
      const { blob, headers } = await toExcel({ courses });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        CourseList({
          courses: courses,
          schoolYear: schoolYear,
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
  courses,
}: {
  courses: RouterOutputs["course"]["all"];
}) {
  const { t } = await getServerTranslations();
  const rows = courses.map((course) => {
    return {
      Code: course.shortName,
      Libelle: course.name,
      "Libelle Bulletin": course.reportName,
      active: course.isActive ? "OUI" : "NON",
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(t("courses"));
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
  const filename = `List-des-matieres.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
