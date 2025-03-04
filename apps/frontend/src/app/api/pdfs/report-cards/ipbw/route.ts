import { sum } from "lodash";
import type { NextRequest } from "next/server";
import { z } from "zod";

import type { RouterOutputs } from "@repo/api";
import { IPBW, renderToStream } from "@repo/reports";

import { api } from "~/trpc/server";

type ReportCardType =
  RouterOutputs["reportCard"]["getStudent"]["result"][number];

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  termId: z.coerce.number(),
});
export async function GET(req: NextRequest) {
  const studId = req.nextUrl.searchParams.get("studentId");
  const term = req.nextUrl.searchParams.get("termId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    termId: term,
    classroomId: classId,
  });
  if (!result.success) {
    const errors = result.error.errors.map((error) => ({
      path: error.path.join("."),
      message: error.message,
    }));

    return Response.json(
      { error: "Invalid request body", errors },
      { status: 400 }
    );
  }

  const { studentId, termId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, termId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, termId });
  }

  //const schoolYear = await api.schoolYear.get(classroom.schoolYearId);
  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));
}

async function classroomReportCard({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: number;
}) {
  const school = await api.school.getSchool();
  console.log("classroomReportCard");
  console.log({ classroomId, termId, school });
  return new Response("Student not registered", { status: 400 });
}
async function indvidualReportCard({
  studentId,
  termId,
}: {
  studentId: string;
  termId: number;
}) {
  const student = await api.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }
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
    reportCard.map((c) => (c.isAbsent ? 0 : c.avg * c.coefficient))
  );

  const classroom = await api.classroom.get(student.classroom.id);
  const contact = await api.student.getPrimaryContact(student.id);
  const average = points / (totalCoeff || 1e9);

  const school = await api.school.getSchool();

  const stream = await renderToStream(
    IPBW({
      school,
      student,
      groups,
      contact,
      average: average,
      schoolYear: classroom.schoolYear,
    })
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
