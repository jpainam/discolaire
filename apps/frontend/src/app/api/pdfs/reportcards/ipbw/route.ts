import type { NextRequest } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { z } from "zod/v4";

import { getSession } from "~/auth/server";
import IPBW from "~/reports/reportcards/IPBW";
import IPBWClassroom from "~/reports/reportcards/IPBWClassroom";
import { caller } from "~/trpc/server";

const searchSchema = z.object({
  studentId: z.string().nullable(),
  classroomId: z.string().nullable(),
  termId: z.string().min(1),
});
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  const studId = req.nextUrl.searchParams.get("studentId");
  const term = req.nextUrl.searchParams.get("termId");
  const classId = req.nextUrl.searchParams.get("classroomId");

  const result = searchSchema.safeParse({
    studentId: studId,
    termId: term,
    classroomId: classId,
  });
  if (!result.success) {
    const error = z.treeifyError(result.error).errors;
    return new Response(JSON.stringify(error), { status: 400 });
  }

  const { studentId, termId, classroomId } = result.data;
  if (studentId) {
    return indvidualReportCard({ studentId, termId });
  } else if (classroomId) {
    return classroomReportCard({ classroomId, termId });
  }

  //const schoolYear = await caller.schoolYear.get(classroom.schoolYearId);
  //const totalPoints = sum(reportCard.map((c) => 20 * c.coefficient));
}

async function classroomReportCard({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const school = await caller.school.getSchool();
  const students = await caller.classroom.students(classroomId);
  const contacts = await caller.student.getPrimaryContacts({ classroomId });
  const report = await caller.reportCard.getSequence({
    classroomId,
    termId,
  });

  const subjects = await caller.classroom.subjects(classroomId);
  const term = await caller.term.get(termId);
  const classroom = await caller.classroom.get(classroomId);

  const disciplines = await caller.discipline.sequence({
    classroomId,
    termId,
  });

  const stream = await renderToStream(
    IPBWClassroom({
      school,
      students,
      disciplines,
      classroom,
      title: `BULLETIN SCOLAIRE : ${term.name}`,
      subjects,
      report,
      contacts,
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
  termId,
}: {
  studentId: string;
  termId: string;
}) {
  const student = await caller.student.get(studentId);
  if (!student.classroom) {
    return new Response("Student not registered", { status: 400 });
  }

  const report = await caller.reportCard.getSequence({
    classroomId: student.classroom.id,
    termId,
  });

  const subjects = await caller.classroom.subjects(student.classroom.id);
  const classroom = await caller.classroom.get(student.classroom.id);

  const studentReport = report.studentsReport.get(studentId);
  const globalRank = report.globalRanks.get(studentId);
  if (!studentReport || !globalRank) {
    return new Response("Student has no grades", { status: 400 });
  }

  const contact = await caller.student.getPrimaryContact(student.id);
  const school = await caller.school.getSchool();
  const term = await caller.term.get(termId);

  const disciplines = await caller.discipline.sequence({
    classroomId: classroom.id,
    termId,
  });

  const stream = await renderToStream(
    IPBW({
      school,
      disciplines: disciplines,
      student,
      classroom,
      title: `BULLETIN SCOLAIRE : ${term.name}`,
      subjects,
      report,
      contact,
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
