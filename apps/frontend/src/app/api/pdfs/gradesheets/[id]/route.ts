import * as XLSX from "@e965/xlsx";
import type { RouterOutputs } from "@repo/api";
import { auth } from "@repo/auth";
import { renderToStream } from "@repo/reports";
import { GradeList } from "@repo/reports/gradesheet/GradeList";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getSheetName } from "~/lib/utils";
import { api } from "~/trpc/server";
import { xlsxType } from "~/utils/file-type";
import { getFullName } from "~/utils/full-name";
import { getAppreciations } from "~/utils/get-appreciation";

const querySchema = z.object({
  format: z.enum(["pdf", "csv"]).optional(),
  classroomId: z.string().min(1),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: number } },
) {
  const session = await auth();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { id } = params;
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
    const { format, classroomId } = parsedQuery.data;
    const classroom = await api.classroom.get(classroomId);
    const school = await api.school.getSchool();

    let grades = await api.gradeSheet.grades(Number(id));
    const gradesheet = await api.gradeSheet.get(Number(id));
    const allGrades = [...grades];

    const session = await auth();
    if (session?.user.profile === "student") {
      const student = await api.student.getFromUserId(session.user.id);
      grades = grades.filter((g) => g.studentId === student.id);
    } else if (session?.user.profile === "contact") {
      const contact = await api.contact.getFromUserId(session.user.id);
      const students = await api.contact.students(contact.id);
      const studentIds = students.map((s) => s.studentId);
      grades = grades.filter((g) => studentIds.includes(g.studentId));
    }

    if (format === "csv") {
      const { blob, headers } = toExcel({
        classroom,
        grades,
        gradesheet,
      });
      return new Response(blob, { headers });
    } else {
      const stream = await renderToStream(
        GradeList({
          classroom: classroom,
          grades: grades,
          allGrades: allGrades,
          gradesheet: gradesheet,
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

function toExcel({
  classroom,
  gradesheet,
  grades,
}: {
  classroom: RouterOutputs["classroom"]["get"];
  gradesheet: NonNullable<RouterOutputs["gradeSheet"]["get"]>;
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const rows = grades.map((gr) => {
    return {
      "Nom et Prénom": getFullName(gr.student),
      Sexe: gr.student.gender == "female" ? "F" : "M",
      Redoublant: gr.student.isRepeating ? "Oui" : "Non",
      Note: gr.grade,
      Absent: gr.isAbsent ? "Oui" : "Non",
      Appréciation: getAppreciations(gr.grade),
    };
  });
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  const sheetName = getSheetName(gradesheet.subject.course.name);
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
  const filename = `Liste-des-notes-${classroom.name}.xlsx`;
  headers["Content-Disposition"] = `attachment; filename="${filename}"`;

  return { blob, headers };
}
