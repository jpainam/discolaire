import type { NextRequest } from "next/server";
import { sum } from "lodash";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { IPBW, renderToStream } from "@repo/reports";

import { api } from "~/trpc/server";

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];

const searchSchema = z.object({
  studentId: z.string().min(1),

  termId: z.coerce.number(),
});
export async function GET(req: NextRequest) {
  const studId = req.nextUrl.searchParams.get("studentId");

  const term = req.nextUrl.searchParams.get("termId");
  const result = searchSchema.safeParse({
    studentId: studId,
    termId: term,
  });
  if (!result.success) {
    return new Response("Not yet implemetend", { status: 500 });
  }
  const { studentId, termId } = result.data;
  const student = await api.student.get(studentId);

  const school = await api.school.getSchool();

  const gradeData = await api.reportCard.getStudent({
    studentId: studentId,
    termId: termId,
  });

  const groups: Record<number, ReportCardType[]> = {};

  const { result: reportCard } = gradeData;
  const totalCoeff = reportCard.reduce((acc, card) => {
    return acc + (card.isAbsent ? 0 : card.coefficient);
  }, 0);
  reportCard.forEach((card) => {
    const groupId = card.subjectGroupId;
    if (!groupId) return;
    if (!groups[groupId]) {
      groups[groupId] = [];
    }
    groups[groupId].push(card);
  });
  const points = sum(
    reportCard.map((c) => (c.isAbsent ? 0 : c.avg * c.coefficient)),
  );

  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }
  const classroom = await api.classroom.get(student.classroom.id);

  //const schoolYear = await api.schoolYear.get(classroom.schoolYearId);
  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));
  const contact = await api.student.getPrimaryContact(student.id);

  const average = points / (totalCoeff || 1e9);
  console.log(average);

  const stream = await renderToStream(
    IPBW({
      school,
      student,
      groups,
      contact,
      schoolYear: classroom.schoolYear,
    }),
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  //headers["Content-Disposition"] =
  // `attachment; filename="CSABReportCard.pdf"`;
  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
