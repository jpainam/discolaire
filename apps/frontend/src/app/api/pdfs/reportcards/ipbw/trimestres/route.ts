import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import { IPBWTrimestre } from "~/reports/reportcards/IPBWTrimestre";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  trimestreId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studId = req.nextUrl.searchParams.get("studentId");
  const trimestre = req.nextUrl.searchParams.get("trimestreId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    trimestreId: trimestre,
    classroomId: classId,
  });
  if (!result.success) {
    const error = z.treeifyError(result.error).errors;
    return new Response(JSON.stringify(error), { status: 400 });
  }

  const { studentId, trimestreId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, trimestreId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, trimestreId });
  }
}

async function classroomReportCard({
  classroomId,
  trimestreId,
}: {
  classroomId: string;
  trimestreId: string;
}) {
  const school = await caller.school.getSchool();
  const students = await caller.classroom.students(classroomId);
  const contacts = await caller.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getTrimestre({
    classroomId: classroomId,
    termId: trimestreId,
  });

  const subjects = await caller.classroom.subjects(classroomId);
  const classroom = await caller.classroom.get(classroomId);

  const disciplines = await caller.discipline.trimestre({
    classroomId,
    termId: trimestreId,
  });
  const lang = classroom.section?.name == "ANG" ? "en" : "fr";

  const stream = await renderToStream(
    IPBWTrimestre({
      school,
      students,
      disciplines,
      classroom,
      trimestreId,
      subjects,
      report,
      contacts,
      lang,
      schoolYear: classroom.schoolYear,
    }),
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };
  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
async function indvidualReportCard({
  studentId,
  trimestreId,
}: {
  studentId: string;
  trimestreId: string;
}) {
  const student = await caller.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getTrimestre({
    classroomId: student.classroom.id,
    termId: trimestreId,
  });

  const subjects = await caller.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  const contacts = await caller.student.getPrimaryContacts({
    classroomId: student.classroom.id,
  });
  const school = await caller.school.getSchool();

  const disciplines = await caller.discipline.trimestre({
    classroomId: classroom.id,
    termId: trimestreId,
  });
  const lang = classroom.section?.name == "ANG" ? "en" : ("fr" as const);

  const stream = await renderToStream(
    IPBWTrimestre({
      school,
      students: [student],
      classroom,
      trimestreId,
      disciplines,
      subjects,
      report,
      contacts: contacts.filter((contact) => contact.studentId === student.id),
      lang,
      schoolYear: classroom.schoolYear,
    }),
  );

  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Cache-Control": "no-store, max-age=0",
  };

  // @ts-expect-error TODO: fix this
  return new Response(stream, { headers });
}
